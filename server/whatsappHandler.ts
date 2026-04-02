import { Request, Response } from 'express';
import OpenAI from 'openai';
import { db, storage } from './firebaseAdmin';
import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

// Register font for canvas
try {
  const fontPath = path.join(process.cwd(), 'Roboto-Regular.ttf');
  if (fs.existsSync(fontPath)) {
    GlobalFonts.registerFromPath(fontPath, 'Roboto');
    console.log("Successfully registered Roboto font for canvas.");
  } else {
    console.warn("Roboto-Regular.ttf not found. Canvas text rendering might fail on some systems.");
  }

  const handwritingFontPath = path.join(process.cwd(), 'PatrickHand-Regular.ttf');
  if (fs.existsSync(handwritingFontPath)) {
    GlobalFonts.registerFromPath(handwritingFontPath, 'PatrickHand');
    console.log("Successfully registered PatrickHand font for canvas.");
  } else {
    console.warn("PatrickHand-Regular.ttf not found.");
  }
} catch (e) {
  console.error("Failed to register font:", e);
}

// Initialize OpenAI
let openai: OpenAI | null = null;
function getOpenAI() {
  if (!openai) {
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OPENAI_API_KEY is missing. Using mock responses for now.");
      return null;
    }
    openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return openai;
}

// ============================================================================
// WHATSAPP API HELPERS
// ============================================================================
async function sendWhatsAppMessage(to: string, text: string) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!token || !phoneId) {
    console.log(`[MOCK WHATSAPP] To: ${to} | Message: ${text}`);
    return;
  }

  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: { body: text }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("WhatsApp API Error (sendWhatsAppMessage):", data);
    }
  } catch (error) {
    console.error("Error sending WhatsApp message:", error);
  }
}

async function sendWhatsAppImage(to: string, imageUrl: string): Promise<boolean> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  
  if (!token || !phoneId) {
    console.log(`[MOCK WHATSAPP] To: ${to} | Image URL: ${imageUrl}`);
    return true;
  }

  try {
    // 1. Read the local image file
    const fileName = imageUrl.split('/').pop();
    if (!fileName) {
      console.error("Invalid image URL:", imageUrl);
      return false;
    }
    const filePath = path.join(process.cwd(), 'solutions', fileName);
    if (!fs.existsSync(filePath)) {
      console.error("Image file not found:", filePath);
      return false;
    }
    const buffer = fs.readFileSync(filePath);

    // 2. Upload the image to WhatsApp Media API
    const formData = new FormData();
    const ext = fileName.split('.').pop()?.toLowerCase();
    const mimeType = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const blob = new Blob([buffer], { type: mimeType });
    formData.append('file', blob, fileName);
    formData.append('type', mimeType);
    formData.append('messaging_product', 'whatsapp');

    const uploadResponse = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/media`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok) {
      console.error("WhatsApp Media Upload Error:", uploadData);
      return false;
    }

    const mediaId = uploadData.id;

    // 3. Send the image message using the media ID
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: to,
        type: 'image',
        image: { id: mediaId }
      })
    });
    const data = await response.json();
    if (!response.ok) {
      console.error("WhatsApp API Error (sendWhatsAppImage):", data);
      return false;
    }
    return true;
  } catch (error) {
    console.error("Error sending WhatsApp image:", error);
    return false;
  }
}

const MODEL_PRICING: Record<string, { input: number, output: number }> = {
  'gpt-5.4': { input: 2.50, output: 15.00 },
  'gpt-5.2': { input: 1.75, output: 14.00 },
  'gpt-5.1': { input: 1.25, output: 10.00 },
  'gpt-5': { input: 1.25, output: 10.00 },
  'gpt-5-mini': { input: 0.25, output: 2.00 },
  'gpt-5-nano': { input: 0.05, output: 0.40 },
  'gpt-4o': { input: 2.50, output: 10.00 },
  'gpt-4o-mini': { input: 0.15, output: 0.60 },
  'gpt-4.1': { input: 2.00, output: 8.00 },
  'gpt-4.1-mini': { input: 0.80, output: 3.20 },
  'gpt-4.1-nano': { input: 0.20, output: 0.80 },
};

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o'];
  return (promptTokens / 1_000_000) * pricing.input + (completionTokens / 1_000_000) * pricing.output;
}

async function saveTokenUsage(uid: string, usage: any, model: string, action: string) {
  if (!db) return;
  try {
    const date = new Date().toISOString().split('T')[0];
    await db.collection('token_usage').add({
      uid,
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
      totalTokens: usage.total_tokens || 0,
      model,
      action,
      createdAt: new Date().toISOString(),
      date
    });
  } catch (error) {
    console.error("Error saving token usage:", error);
  }
}

async function extractTextFromWhatsAppImage(imageId: string, uid: string): Promise<{ text: string, cost: number }> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    console.error("WHATSAPP_ACCESS_TOKEN is missing.");
    return { text: "", cost: 0 };
  }

  try {
    // 1. Get Image URL from WhatsApp API
    const urlResponse = await fetch(`https://graph.facebook.com/v17.0/${imageId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const urlData = await urlResponse.json();
    
    if (!urlData.url) {
      console.error("Failed to get image URL from WhatsApp:", urlData);
      return { text: "", cost: 0 };
    }

    // 2. Download the image data
    const imageResponse = await fetch(urlData.url, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');
    const mimeType = urlData.mime_type || 'image/jpeg';

    // 3. Send to OpenAI GPT-4o Vision
    const ai = getOpenAI();
    if (!ai) return { text: "OpenAI API key missing.", cost: 0 };

    const aiResponse = await ai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { 
              type: "text", 
              text: "Bu görseldeki metni, özellikle matematik, geometri veya fen sorularını eksiksiz ve doğru bir şekilde metne dök. Sadece okuduğun metni ver, ekstra yorum yapma." 
            },
            { 
              type: "image_url", 
              image_url: { url: `data:${mimeType};base64,${base64Image}` } 
            }
          ]
        }
      ]
    });

    let cost = 0;
    if (aiResponse.usage) {
      await saveTokenUsage(uid, aiResponse.usage, "gpt-4o", "extract_text");
      cost = calculateCost("gpt-4o", aiResponse.usage.prompt_tokens || 0, aiResponse.usage.completion_tokens || 0);
    }

    return { text: aiResponse.choices[0].message.content || "", cost };
  } catch (error) {
    console.error("Error extracting text from image:", error);
    return { text: "", cost: 0 };
  }
}

// ============================================================================
// OPENAI LOGIC
// ============================================================================
async function analyzeQuestion(text: string, uid: string): Promise<{ isQuestion: boolean, difficulty: number, examType: string, subject: string, topic: string, cost: number }> {
  const ai = getOpenAI();
  if (!ai) return { isQuestion: true, difficulty: 2, examType: "Genel", subject: "Soru", topic: "Genel", cost: 0 };

  try {
    const response = await ai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `Sen bir eğitim asistanısın. Verilen metnin çözülmesi gereken bir ders/eğitim sorusu (matematik, fizik, kimya vb. herhangi bir seviyede) olup olmadığını kontrol et. Soru en basit düzeyde bir denklem veya işlem bile olsa 'isQuestion: true' döndür. Sadece sohbet, selamlaşma veya eğitimle alakasız metinlerde 'false' döndür.
          Eğer soru ise zorluk seviyesini 1 ile 4 arasında belirle.
          1: Kolay (tek işlem, basit bilgi, 1 adım çözümlü sorular)
          2: Orta (2-3 işlemli, temel yorum soruları)
          3: Zor (çok adımlı işlem, dikkat gerektiren mantık soruları)
          4: Çok Zor (uzun mantık zinciri, sınavın ayırt edici soruları)
          Ayrıca sorunun hangi sınava (TYT, AYT, LGS, YKS, KPSS, ALES, DGS, Okul Sınavı, Diğer), hangi derse (Matematik, Fizik, Kimya, Biyoloji, Türkçe, Tarih, Coğrafya, vb.) ve hangi konuya ait olduğunu belirle.
          Sadece şu JSON formatında yanıt ver: {"isQuestion": true/false, "difficulty": 1/2/3/4, "examType": "Sınav Türü", "subject": "Ders Adı", "topic": "Konu Adı"}`
        },
        { role: "user", content: text }
      ],
      response_format: { type: "json_object" }
    });

    let cost = 0;
    if (response.usage) {
      await saveTokenUsage(uid, response.usage, "gpt-5-nano", "analyze_question");
      cost = calculateCost("gpt-5-nano", response.usage.prompt_tokens || 0, response.usage.completion_tokens || 0);
    }

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      isQuestion: result.isQuestion || false,
      difficulty: result.difficulty || 1,
      examType: result.examType || "Genel",
      subject: result.subject || "Soru",
      topic: result.topic || "Genel",
      cost
    };
  } catch (error) {
    console.error("Error analyzing question:", error);
    return { isQuestion: false, difficulty: 1, examType: "Genel", subject: "Soru", topic: "Genel", cost: 0 };
  }
}

async function solveQuestion(text: string, difficulty: number, uid: string): Promise<{text: string, model: string, cost: number}> {
  const ai = getOpenAI();
  if (!ai) return { text: "Bu sorunun çözümü: 2x = 10, x = 5. (Mock Çözüm)", model: "mock", cost: 0 };

  let modelToUse = "gpt-5-nano";
  if (difficulty === 1) modelToUse = "gpt-5-nano";
  else if (difficulty === 2) modelToUse = "gpt-5-mini";
  else if (difficulty === 3) modelToUse = "gpt-5";
  else if (difficulty >= 4) modelToUse = "gpt-5.1";

  try {
    const response = await ai.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: "system",
          content: "Sen alanında 15+ yıl deneyimli, TYT/AYT/LGS sınavlarına öğrenci hazırlamış tecrübeli bir Türk öğretmenisin. Soruyu özel ders verir gibi çöz.\nGörevin:\n1. Çözümünün EN ÜSTÜNE, İLK SATIRA sadece sınav, ders ve konu bilgisini 'AYT / Matematik / Denklemler' formatında yaz. Bu satırda başka hiçbir kelime olmasın.\n2. İpucu ver – Soruyu çözmek için hangi kural, formül veya strateji gerekli?\n3. Adım adım çöz – Her adımı numaralandır, gerekçesini açıkla. Öğrenci sanki yanında oturuyormuş gibi konuş.\n4. Tuzaklara dikkat et – Bu soruda öğrencilerin sık yaptığı hatayı belirt.\n5. Doğru seçeneği açıkla – Cevabın neden doğru olduğunu, diğer şıkların neden yanlış olduğunu kısaca göster.\n6. Pekiştir – Tek cümlelik altın kural veya hafızada kalacak bir not bırak.\n7. Sınavda bu dersten kaç soru gelir ve bu konudan kaç soru gelebileceğini belirt.\n8 Cevabın doğruluğunu tekrar kontrol et. bir tutarsızlık varsa gerekirse tekrar çöz. Bu kontrolü herhangi bir mesaj döndürmeden yap.\n\nÖNEMLİ KURAL: Çözümü yazarken yukarıdaki görev maddelerinin başlıklarını veya soru cümlelerini (örneğin '2. İpucu ver:', 'Pekiştir:' gibi) KESİNLİKLE metne yazma. İlk satırdaki başlık hariç, geri kalan kısımları doğrudan cevapları, akıcı ve doğal bir anlatımla yaz.\n\nTürkçe cevap ver. Samimi, teşvik edici ve anlaşılır bir dil kullan. Çözüm metni bir resmin üzerine yazdırılacağı için düz metin (plain text) kullan, Markdown (yıldız, kare vb.) veya LaTeX kullanma."
        },
        { role: "user", content: text }
      ]
    });

    let cost = 0;
    if (response.usage) {
      await saveTokenUsage(uid, response.usage, modelToUse, "solve_question");
      cost = calculateCost(modelToUse, response.usage.prompt_tokens || 0, response.usage.completion_tokens || 0);
    }

    return { text: response.choices[0].message.content || "Çözüm üretilemedi.", model: modelToUse, cost };
  } catch (error) {
    console.error(`Error solving question with model ${modelToUse}:`, error);
    // Fallback to gpt-4o if the requested model doesn't exist yet (like gpt-4.1 or gpt-5)
    try {
      const fallbackResponse = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Sen alanında 15+ yıl deneyimli, TYT/AYT/LGS sınavlarına öğrenci hazırlamış tecrübeli bir Türk öğretmenisin. Soruyu özel ders verir gibi çöz.\nGörevin:\n1. Çözümünün EN ÜSTÜNE, İLK SATIRA sadece sınav, ders ve konu bilgisini 'AYT / Matematik / Denklemler' formatında yaz. Bu satırda başka hiçbir kelime olmasın.\n2. İpucu ver – Soruyu çözmek için hangi kural, formül veya strateji gerekli?\n3. Adım adım çöz – Her adımı numaralandır, gerekçesini açıkla. Öğrenci sanki yanında oturuyormuş gibi konuş.\n4. Tuzaklara dikkat et – Bu soruda öğrencilerin sık yaptığı hatayı belirt.\n5. Doğru seçeneği açıkla – Cevabın neden doğru olduğunu, diğer şıkların neden yanlış olduğunu kısaca göster.\n6. Pekiştir – Tek cümlelik altın kural veya hafızada kalacak bir not bırak.\n7. Sınavda bu dersten kaç soru gelir ve bu konudan kaç soru gelebileceğini belirt.\n8 Cevabın doğruluğunu tekrar kontrol et. bir tutarsızlık varsa gerekirse tekrar çöz. Bu kontrolü herhangi bir mesaj döndürmeden yap.\n\nÖNEMLİ KURAL: Çözümü yazarken yukarıdaki görev maddelerinin başlıklarını veya soru cümlelerini (örneğin '2. İpucu ver:', 'Pekiştir:' gibi) KESİNLİKLE metne yazma. İlk satırdaki başlık hariç, geri kalan kısımları doğrudan cevapları, akıcı ve doğal bir anlatımla yaz.\n\nTürkçe cevap ver. Samimi, teşvik edici ve anlaşılır bir dil kullan. Çözüm metni bir resmin üzerine yazdırılacağı için düz metin (plain text) kullan, Markdown (yıldız, kare vb.) veya LaTeX kullanma."
          },
          { role: "user", content: text }
        ]
      });
      
      let fallbackCost = 0;
      if (fallbackResponse.usage) {
        await saveTokenUsage(uid, fallbackResponse.usage, "gpt-4o", "solve_question_fallback");
        fallbackCost = calculateCost("gpt-4o", fallbackResponse.usage.prompt_tokens || 0, fallbackResponse.usage.completion_tokens || 0);
      }

      return { text: fallbackResponse.choices[0].message.content || "Çözüm üretilemedi.", model: "gpt-4o", cost: fallbackCost };
    } catch (fallbackError) {
      return { text: "Çözüm sırasında bir hata oluştu.", model: "error", cost: 0 };
    }
  }
}

export async function generateAndUploadImage(solutionText: string, baseUrl: string): Promise<string> {
  try {
    console.log("Starting generateAndUploadImage...");
    
    // Helper function to format math text (convert ^2 to ², etc.)
    const formatMathText = (text: string): string => {
      const superscripts: { [key: string]: string } = {
        '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴',
        '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
        '+': '⁺', '-': '⁻', 'n': 'ⁿ', 'x': 'ˣ', 'y': 'ʸ',
        '(': '⁽', ')': '⁾'
      };
      
      return text.replace(/\^\{?([0-9+\-nxy()]+)\}?/g, (match, p1) => {
        return p1.split('').map((char: string) => superscripts[char] || char).join('');
      });
    };

    const formattedSolutionText = formatMathText(solutionText);

    // 1. Find the image starting with 'generated' in the root directory
    const files = fs.readdirSync(process.cwd());
    const generatedImageFile = files.find(file => file.toLowerCase().startsWith('generated') && (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')));
    
    let bgImage;
    let canvasWidth = 1080;
    let canvasHeight = 1920;

    if (generatedImageFile) {
      console.log(`Found background image file: ${generatedImageFile}`);
      const imagePath = path.join(process.cwd(), generatedImageFile);
      const stats = fs.statSync(imagePath);
      if (stats.size > 0) {
        try {
          console.log(`Reading image file: ${imagePath}`);
          const imageBuffer = fs.readFileSync(imagePath);
          console.log(`Calling loadImage with buffer of size ${imageBuffer.length}...`);
          bgImage = await loadImage(imageBuffer);
          console.log("loadImage succeeded.");
          canvasWidth = bgImage.width;
          canvasHeight = bgImage.height;
        } catch (imgError) {
          console.error(`Failed to load background image ${generatedImageFile}:`, imgError);
          console.warn("Using fallback background due to image load error.");
          bgImage = undefined; // Force fallback
        }
      } else {
        console.warn(`Background image ${generatedImageFile} is empty (0 bytes). Using fallback background.`);
      }
    } else {
      console.warn("Background image starting with 'generated' not found. Using fallback background.");
    }

    console.log("Creating canvas...");
    // 3. Create Canvas and draw background
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext('2d');
    
    if (bgImage) {
      console.log("Drawing background image...");
      try {
        ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
      } catch (drawError) {
        console.error("Failed to draw background image:", drawError);
        console.warn("Falling back to solid background.");
        ctx.fillStyle = '#f4f4f9';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    } else {
      console.log("Drawing fallback background...");
      // Fallback background if image is missing or empty
      ctx.fillStyle = '#f4f4f9'; // Light gray/blueish background
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      
      // Draw some notebook lines
      ctx.strokeStyle = '#e0e0e0';
      ctx.lineWidth = 2;
      for (let y = 100; y < canvasHeight; y += 52) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }
    }

    console.log("Configuring text rendering...");
    // 4. Configure text rendering
    ctx.font = '30px PatrickHand'; // Use registered handwriting font
    ctx.fillStyle = '#3b3b3b'; // Pencil/graphite color
    
    // Adjust margins based on the notebook image structure
    const marginX = bgImage ? canvasWidth * 0.18 : canvasWidth * 0.10;
    const marginY = bgImage ? canvasHeight * 0.20 : canvasHeight * 0.15;
    const maxWidth = canvasWidth - (marginX * 2);
    const lineHeight = 46;

    console.log("Wrapping and drawing text...");
    // 5. Wrap and draw text
    const paragraphs = formattedSolutionText.split('\n');
    let currentY = marginY;
    let isFirstLine = true;

    for (let p = 0; p < paragraphs.length; p++) {
      const paragraphText = paragraphs[p].trim();
      // Skip empty paragraphs to avoid extra spacing, but add a small gap
      if (paragraphText === '') {
        currentY += lineHeight / 2;
        continue;
      }

      if (isFirstLine) {
        // Draw the title (first item)
        ctx.font = 'bold 50px PatrickHand';
        ctx.fillStyle = 'red';
        const metrics = ctx.measureText(paragraphText);
        const textWidth = metrics.width;
        const startX = (canvasWidth - textWidth) / 2;
        
        ctx.fillText(paragraphText, startX, currentY);
        
        // Draw underline
        ctx.beginPath();
        ctx.moveTo(startX, currentY + 8); // slightly below the baseline
        ctx.lineTo(startX + textWidth, currentY + 8);
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 3;
        ctx.stroke();
        
        currentY += 60; // Add extra space after the title
        isFirstLine = false;
      } else {
        // Draw normal text
        ctx.font = '30px PatrickHand';
        ctx.fillStyle = '#3b3b3b';

        const words = paragraphs[p].split(' ');
        let line = '';

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = ctx.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, marginX, currentY);
            line = words[n] + ' ';
            currentY += lineHeight;
          } else {
            line = testLine;
          }
        }
        ctx.fillText(line, marginX, currentY);
        currentY += lineHeight;
      }
    }

    console.log("Calling canvas.toBuffer...");
    let finalBuffer;
    let isJpeg = false;
    try {
      finalBuffer = canvas.toBuffer('image/png');
      console.log("Canvas text drawing completed (PNG). Buffer size:", finalBuffer.length);
    } catch (pngError: any) {
      console.warn("Failed to generate PNG buffer, falling back to JPEG:", pngError);
      finalBuffer = canvas.toBuffer('image/jpeg');
      isJpeg = true;
      console.log("Canvas text drawing completed (JPEG). Buffer size:", finalBuffer.length);
    }

    console.log("Saving locally...");
    // 6. Save locally and return URL
    const ext = isJpeg ? 'jpg' : 'png';
    const fileName = `solution_${Date.now()}.${ext}`;
    const solutionsDir = path.join(process.cwd(), 'solutions');
    if (!fs.existsSync(solutionsDir)) {
      fs.mkdirSync(solutionsDir);
    }
    const filePath = path.join(solutionsDir, fileName);
    fs.writeFileSync(filePath, finalBuffer);

    // Get the base URL from the environment or use a default
    const finalUrl = `${baseUrl}/solutions/${fileName}`;
    
    console.log("Successfully saved canvas image locally:", finalUrl);
    return finalUrl;

  } catch (error: any) {
    console.error("Error generating/uploading image:", error);
    console.error("Error stack:", error.stack);
    return `ERROR: ${error.message || String(error)}`;
  }
}

// ============================================================================
// WEBHOOK HANDLERS
// ============================================================================

export const verifyWhatsAppWebhook = (req: Request, res: Response) => {
  const verify_token = process.env.WHATSAPP_VERIFY_TOKEN || "my_secure_token";
  
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  console.log("--- Webhook Verification Request ---");
  console.log("Mode:", mode);
  console.log("Token received:", token);
  console.log("Token expected:", verify_token);
  console.log("Challenge:", challenge);

  if (mode && token) {
    if (mode === "subscribe" && token === verify_token) {
      console.log("✅ Webhook verified successfully!");
      res.status(200).type('text/plain').send(challenge);
    } else {
      console.error("❌ Webhook verification failed. Token mismatch.");
      res.sendStatus(403);
    }
  } else {
    console.error("❌ Webhook verification failed. Missing mode or token.");
    res.sendStatus(400);
  }
};

function normalizePhone(phone: string): string {
  let cleaned = phone.replace(/\D/g, '');
  if (cleaned.startsWith('90') && cleaned.length === 12) {
    cleaned = '0' + cleaned.substring(2);
  } else if (cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

export const handleWhatsAppWebhook = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    console.log("--- Incoming WhatsApp Webhook ---");
    console.log(JSON.stringify(body, null, 2));

    if (body.object === "whatsapp_business_account") {
      // Send 200 OK immediately to prevent WhatsApp from retrying
      res.sendStatus(200);

      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        // Process message asynchronously
        const baseUrl = `https://${req.get('host')}`;
        processWhatsAppMessage(messages[0], baseUrl).catch(console.error);
      }
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error("Webhook processing error:", error);
    if (!res.headersSent) {
      res.sendStatus(500);
    }
  }
};

async function processWhatsAppMessage(msg: any, baseUrl: string) {
  try {
    const phone = msg.from; // e.g., "905551234567"
    const normalizedPhone = normalizePhone(phone);

    // 1. Whatsapp numarasından üyelik kontrolü.
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }

    const phoneDoc = await db.collection('phone_numbers').doc(normalizedPhone).get();
    
    if (!phoneDoc.exists) {
      console.log(`User not found for phone: ${normalizedPhone}`);
      await sendWhatsAppMessage(phone, "Üyeliğiniz bulunamadı. www.kritiksoru.com 'dan üye olabilirsiniz.");
      return;
    }

    const uid = phoneDoc.data()?.uid;
    if (!uid) {
      console.log(`UID not found for phone: ${normalizedPhone}`);
      await sendWhatsAppMessage(phone, "Üyeliğiniz bulunamadı. www.kritiksoru.com 'dan üye olabilirsiniz.");
      return;
    }

    const userDoc = await db.collection('users').doc(uid).get();
    const user = userDoc.data();

    if (!user) {
      console.log(`User document not found for UID: ${uid}`);
      await sendWhatsAppMessage(phone, "Üyeliğiniz bulunamadı. www.kritiksoru.com 'dan üye olabilirsiniz.");
      return;
    }

    // 2. Üyenin kontör miktarı kontrolü.
    const tokens = user.tokens || 0;
    if (tokens === 0) {
      console.log(`User ${uid} has 0 tokens.`);
      await sendWhatsAppMessage(phone, "Yeterli kontörünüz bulunmamaktadır. www.kritiksoru.com 'dan kontör yükleyebilirsiniz.");
      return;
    }

    // 2.5 Günlük soru limiti kontrolü (Her kullanıcı için günde max 5 soru)
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD formatında bugünün tarihi
    let dailyCount = user.dailyQuestionCount || 0;
    const lastDate = user.lastQuestionDate || "";

    // Eğer son soru gönderilen tarih bugün değilse, sayacı sıfırla
    if (lastDate !== today) {
      dailyCount = 0;
    }

    // Eğer günlük limit (5) dolduysa, mesaj gönder ve işlemi durdur
    if (dailyCount >= 5) {
      console.log(`User ${uid} reached daily limit (${dailyCount}).`);
      await sendWhatsAppMessage(phone, "Günlük soru kotasını doldurdun. Yarın görüşmek üzere! ");
      return;
    }

    // 3. Gelen mesajın metin mi görsel mi olduğunun kontrolü.
    let questionText = "";
    let totalCost = 0;

    console.log("Message Type:", msg.type);

    if (msg.type === "text" && msg.text && msg.text.body) {
      questionText = msg.text.body;
    } else if (msg.type === "image" && msg.image && msg.image.id) {
      const imageId = msg.image.id;
      // Görseli metne çevir
      const extractResult = await extractTextFromWhatsAppImage(imageId, uid);
      questionText = extractResult.text;
      totalCost += extractResult.cost;
    } else {
      console.log("Unsupported message type or missing content:", msg);
      await sendWhatsAppMessage(phone, "Şu anda sadece metin ve görsel mesajları destekliyoruz.");
      return;
    }

    console.log("Extracted Question Text:", questionText);

    if (!questionText || questionText.trim() === "") {
       console.log("Question text is empty after extraction.");
       await sendWhatsAppMessage(phone, "Gönderdiğiniz mesajdan bir soru çıkarılamadı. Lütfen tekrar deneyin.");
       return;
    }

    // Metin bir tyt, ayt ve lgs sınav sorusu içeriyor mu GPT-4o mini ile kontrol et.
    const analysis = await analyzeQuestion(questionText, uid);
    totalCost += analysis.cost;
    
    if (!analysis.isQuestion) {
      await sendWhatsAppMessage(phone, "Soru bulunamadı. www.kritiksoru.com");
      return;
    }

    // Soru çözüm promtunu çalıştır
    const { text: solutionText, model: usedModel, cost: solveCost } = await solveQuestion(questionText, analysis.difficulty, uid);
    totalCost += solveCost;

    // Soru çözümünü metnini görsel üretim promptunu kullanarak görsele dönüştür & Firebase Storage'a yükle
    const solutionImageUrl = await generateAndUploadImage(solutionText, baseUrl);

    // Görseli whatsapp'tan kullanıcıya gönder.
    if (solutionImageUrl && !solutionImageUrl.startsWith('ERROR:')) {
      const success = await sendWhatsAppImage(phone, solutionImageUrl);
      if (!success) {
        await sendWhatsAppMessage(phone, "Görsel gönderilirken bir hata oluştu. Çözüm:\n\n" + solutionText);
      }
    } else {
      // Görsel oluşturulamadıysa veya yüklenemediyse metin olarak gönder
      const errMsg = solutionImageUrl.startsWith('ERROR:') ? solutionImageUrl : "Bilinmeyen hata";
      await sendWhatsAppMessage(phone, `Görsel oluşturulurken bir hata oluştu (${errMsg}). Çözüm:\n\n` + solutionText);
    }

    // Save the question to Firestore
    await db.collection('questions').add({
      uid: uid,
      questionText: questionText,
      answerText: solutionText,
      imageUrl: solutionImageUrl,
      status: 'solved',
      model: usedModel,
      cost: totalCost,
      examType: analysis.examType,
      subject: analysis.subject,
      topic: analysis.topic,
      createdAt: new Date().toISOString()
    });

    // Üyenin kontöründen 1 adet azalt ve günlük limiti güncelle.
    const updatedTokens = tokens - 1;
    await db.collection('users').doc(uid).update({ 
      tokens: updatedTokens,
      dailyQuestionCount: dailyCount + 1,
      lastQuestionDate: today
    });

    // Kullanıcıya üyelik paketinin hangisi olduğu ve kalan kontör miktarını bir mesajla gönder.
    const packageName = user.activePlan || "Standart Paket";
    await sendWhatsAppMessage(phone, `Paketiniz: ${packageName}\nKalan kontör miktarınız: ${updatedTokens}`);
  } catch (error) {
    console.error("Error processing WhatsApp message:", error);
  }
}

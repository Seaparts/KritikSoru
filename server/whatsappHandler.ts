import { Request, Response } from 'express';
import OpenAI from 'openai';
import { db, storage } from './firebaseAdmin';
import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

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
    const blob = new Blob([buffer], { type: 'image/png' });
    formData.append('file', blob, fileName);
    formData.append('type', 'image/png');
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

async function extractTextFromWhatsAppImage(imageId: string): Promise<string> {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    console.error("WHATSAPP_ACCESS_TOKEN is missing.");
    return "";
  }

  try {
    // 1. Get Image URL from WhatsApp API
    const urlResponse = await fetch(`https://graph.facebook.com/v17.0/${imageId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const urlData = await urlResponse.json();
    
    if (!urlData.url) {
      console.error("Failed to get image URL from WhatsApp:", urlData);
      return "";
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
    if (!ai) return "OpenAI API key missing.";

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

    return aiResponse.choices[0].message.content || "";
  } catch (error) {
    console.error("Error extracting text from image:", error);
    return "";
  }
}

// ============================================================================
// OPENAI LOGIC
// ============================================================================
async function analyzeQuestion(text: string): Promise<{ isQuestion: boolean, difficulty: number, examType: string, subject: string, topic: string }> {
  const ai = getOpenAI();
  if (!ai) return { isQuestion: true, difficulty: 2, examType: "Genel", subject: "Soru", topic: "Genel" };

  try {
    const response = await ai.chat.completions.create({
      model: "gpt-4o-mini",
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

    const result = JSON.parse(response.choices[0].message.content || "{}");
    return {
      isQuestion: result.isQuestion || false,
      difficulty: result.difficulty || 1,
      examType: result.examType || "Genel",
      subject: result.subject || "Soru",
      topic: result.topic || "Genel"
    };
  } catch (error) {
    console.error("Error analyzing question:", error);
    return { isQuestion: false, difficulty: 1, examType: "Genel", subject: "Soru", topic: "Genel" };
  }
}

async function solveQuestion(text: string, difficulty: number): Promise<string> {
  const ai = getOpenAI();
  if (!ai) return "Bu sorunun çözümü: 2x = 10, x = 5. (Mock Çözüm)";

  let modelToUse = "gpt-4o-mini";
  if (difficulty === 1) modelToUse = "gpt-4o-mini";
  else if (difficulty === 2) modelToUse = "gpt-4o";
  else if (difficulty === 3) modelToUse = "gpt-4.1";
  else if (difficulty >= 4) modelToUse = "gpt-5"; // Handling 4 or 5 as gpt-5 based on user prompt

  try {
    const response = await ai.chat.completions.create({
      model: modelToUse,
      messages: [
        {
          role: "system",
          content: "Sen uzman bir öğretmensin. Öğrencinin gönderdiği soruyu adım adım, anlaşılır bir şekilde çöz. Çözümü düz metin (plain text) olarak yaz. Kesinlikle LaTeX, Markdown (yıldız, kare vb.) veya karmaşık semboller KULLANMA. Kesirleri a/b şeklinde, üslü sayıları a^b şeklinde, köklü sayıları kök(x) şeklinde yaz. Çözüm metni bir resmin üzerine yazdırılacağı için çok uzun paragraflardan kaçın, maddeler halinde ve kısa cümleler kur."
        },
        { role: "user", content: text }
      ]
    });

    return response.choices[0].message.content || "Çözüm üretilemedi.";
  } catch (error) {
    console.error(`Error solving question with model ${modelToUse}:`, error);
    // Fallback to gpt-4o if the requested model doesn't exist yet (like gpt-4.1 or gpt-5)
    try {
      const fallbackResponse = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "Sen uzman bir öğretmensin. Öğrencinin gönderdiği soruyu adım adım, anlaşılır bir şekilde çöz. Çözümü düz metin (plain text) olarak yaz. Kesinlikle LaTeX, Markdown (yıldız, kare vb.) veya karmaşık semboller KULLANMA. Kesirleri a/b şeklinde, üslü sayıları a^b şeklinde, köklü sayıları kök(x) şeklinde yaz. Çözüm metni bir resmin üzerine yazdırılacağı için çok uzun paragraflardan kaçın, maddeler halinde ve kısa cümleler kur."
          },
          { role: "user", content: text }
        ]
      });
      return fallbackResponse.choices[0].message.content || "Çözüm üretilemedi.";
    } catch (fallbackError) {
      return "Çözüm sırasında bir hata oluştu.";
    }
  }
}

async function generateAndUploadImage(solutionText: string, baseUrl: string): Promise<string> {
  const ai = getOpenAI();
  if (!ai) return "https://picsum.photos/seed/solution/800/600";

  try {
    // 1. Generate Image with DALL-E
    const response = await ai.images.generate({
      model: "dall-e-3",
      prompt: `Bir defter sayfası arka planı oluştur. Aşağıdaki gerekliliklere tamamen uy:
1) Arka Plan: Temiz, yüksek çözünürlüklü, beyaz çizgili bir çizgili defter sayfası olsun. Sayfa hafif gerçekçi ışık-gölge hissi verebilir, ancak yazı okunabilirliğini bozmamalı. Üst ve alt kısımlar net, köşeler hafif yumuşak olabilir. Sayfada hiçbir yazı, çizim, leke, karalama OLMASIN.
2) Metin Yerleşimi İçin Boş Alan: Defter sayfasının iç kısmında, çözüm metninin yerleştirileceği tamamen boş bir alan bırak. Boş alan: sayfanın sol ve sağından en az 5% içerde olsun, üstten 10% boşluk bırakılmış olsun, çözümün uzunluğuna göre otomatik genişleyebilir bir alan gibi görünmeli.
3) Backend'in ekleyeceği çözüm metni için rehber: Bu görüntüde yazı SEN TARAFINDAN EKLENMEYECEK. Sadece yazının yerleştirileceği boş defter arka planı üret.
4) Stil: Gerçekçi, ama natural light, 2D, profesyonel eğitim materyali tarzında, A4 oranı, Yüksek çözünürlük. Kenarlar kesik veya kırpılmış olmamalı.
5) Tamamen Görsel Odaklı: Sorunun kendisini veya çözüm metnini ekleme. Sadece arka plan + boş alan üret.
Amaç: Backend çözüm metnini bu defter görüntüsüne daha sonra otomatik yerleştirecek. Bu nedenle temiz ve metinsiz bir defter arka planı üret.`,
      size: "1024x1792",
      quality: "standard",
      n: 1,
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) return "https://picsum.photos/seed/error/800/600";

    // 2. Download the DALL-E image
    const imageResponse = await fetch(imageUrl);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const bgImage = await loadImage(Buffer.from(arrayBuffer));

    // 3. Create Canvas and draw background
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);

    // 4. Configure text rendering
    ctx.font = 'bold 36px Arial'; // Use standard font
    ctx.fillStyle = '#000000'; // Black text for better visibility
    
    // Adjust margins based on the notebook image structure
    const marginX = bgImage.width * 0.18; // 18% from left
    const marginY = bgImage.height * 0.20; // 20% from top
    const maxWidth = bgImage.width - (marginX * 2);
    const lineHeight = 52;

    // 5. Wrap and draw text
    const paragraphs = solutionText.split('\n');
    let currentY = marginY;

    for (let p = 0; p < paragraphs.length; p++) {
      // Skip empty paragraphs to avoid extra spacing, but add a small gap
      if (paragraphs[p].trim() === '') {
        currentY += lineHeight / 2;
        continue;
      }

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

    const finalBuffer = canvas.toBuffer('image/png');
    console.log("Canvas text drawing completed. Buffer size:", finalBuffer.length);

    // 6. Save locally and return URL
    const fileName = `solution_${Date.now()}.png`;
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

  } catch (error) {
    console.error("Error generating/uploading image:", error);
    return "";
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

    console.log("Message Type:", msg.type);

    if (msg.type === "text" && msg.text && msg.text.body) {
      questionText = msg.text.body;
    } else if (msg.type === "image" && msg.image && msg.image.id) {
      const imageId = msg.image.id;
      // Görseli metne çevir
      questionText = await extractTextFromWhatsAppImage(imageId);
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
    const analysis = await analyzeQuestion(questionText);
    
    if (!analysis.isQuestion) {
      await sendWhatsAppMessage(phone, "Soru bulunamadı. www.kritiksoru.com");
      return;
    }

    // Soru çözüm promtunu çalıştır
    const solutionText = await solveQuestion(questionText, analysis.difficulty);

    // Soru çözümünü metnini görsel üretim promptunu kullanarak görsele dönüştür & Firebase Storage'a yükle
    const solutionImageUrl = await generateAndUploadImage(solutionText, baseUrl);

    // Görseli whatsapp'tan kullanıcıya gönder.
    if (solutionImageUrl) {
      const success = await sendWhatsAppImage(phone, solutionImageUrl);
      if (!success) {
        await sendWhatsAppMessage(phone, "Görsel gönderilirken bir hata oluştu. Çözüm:\n\n" + solutionText);
      }
    } else {
      // Görsel oluşturulamadıysa veya yüklenemediyse metin olarak gönder
      await sendWhatsAppMessage(phone, "Görsel oluşturulurken bir hata oluştu. Çözüm:\n\n" + solutionText);
    }

    // Save the question to Firestore
    await db.collection('questions').add({
      uid: uid,
      questionText: questionText,
      answerText: solutionText,
      imageUrl: solutionImageUrl,
      status: 'solved',
      model: 'gpt-4o',
      cost: 1,
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

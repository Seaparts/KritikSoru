// server.ts
import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path3 from "path";
import fs3 from "fs";

// server/whatsappHandler.ts
import OpenAI from "openai";

// server/firebaseAdmin.ts
import { initializeApp, cert, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import fs from "fs";
import path from "path";
var db;
var storage;
try {
  let config = {};
  const configPath = path.resolve(process.cwd(), "firebase-applet-config.json");
  if (fs.existsSync(configPath)) {
    config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } else {
    console.warn("firebase-applet-config.json not found. Falling back to environment variables.");
    config = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firestoreDatabaseId: process.env.FIREBASE_DATABASE_ID || "(default)"
    };
  }
  if (!getApps().length) {
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      try {
        const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
        initializeApp({
          credential: cert(serviceAccount),
          storageBucket: config.storageBucket || `${config.projectId}.appspot.com`
        });
        console.log("Firebase Admin initialized with Service Account from ENV.");
      } catch (e) {
        console.error("Failed to parse FIREBASE_SERVICE_ACCOUNT env var:", e);
      }
    } else {
      initializeApp({
        projectId: config.projectId,
        storageBucket: config.storageBucket || `${config.projectId}.appspot.com`
      });
      console.log("Firebase Admin initialized with Application Default Credentials.");
    }
  }
  try {
    db = getFirestore(getApps()[0], config.firestoreDatabaseId);
  } catch (e) {
    db = getFirestore();
  }
  storage = getStorage();
  console.log("Firebase Admin initialized.");
} catch (error) {
  console.error("Error initializing Firebase Admin:", error);
}

// server/whatsappHandler.ts
import { createCanvas, loadImage, GlobalFonts } from "@napi-rs/canvas";
import fs2 from "fs";
import path2 from "path";
try {
  const fontPath = path2.join(process.cwd(), "Roboto-Regular.ttf");
  if (fs2.existsSync(fontPath)) {
    GlobalFonts.registerFromPath(fontPath, "Roboto");
    console.log("Successfully registered Roboto font for canvas.");
  } else {
    console.warn("Roboto-Regular.ttf not found. Canvas text rendering might fail on some systems.");
  }
  const handwritingFontPath = path2.join(process.cwd(), "PatrickHand-Regular.ttf");
  if (fs2.existsSync(handwritingFontPath)) {
    GlobalFonts.registerFromPath(handwritingFontPath, "PatrickHand");
    console.log("Successfully registered PatrickHand font for canvas.");
  } else {
    console.warn("PatrickHand-Regular.ttf not found.");
  }
  const emojiFontPath = path2.join(process.cwd(), "TwemojiMozilla.ttf");
  if (fs2.existsSync(emojiFontPath)) {
    GlobalFonts.registerFromPath(emojiFontPath, "TwemojiMozilla");
    console.log("Successfully registered TwemojiMozilla font for canvas.");
  } else {
    console.warn("TwemojiMozilla.ttf not found.");
  }
} catch (e) {
  console.error("Failed to register font:", e);
}
var openai = null;
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
async function sendWhatsAppMessage(to, text) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    console.log(`[MOCK WHATSAPP] To: ${to} | Message: ${text}`);
    return;
  }
  try {
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "text",
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
async function sendWhatsAppImage(to, imageUrl) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  if (!token || !phoneId) {
    console.log(`[MOCK WHATSAPP] To: ${to} | Image URL: ${imageUrl}`);
    return true;
  }
  try {
    const fileName = imageUrl.split("/").pop();
    if (!fileName) {
      console.error("Invalid image URL:", imageUrl);
      return false;
    }
    const filePath = path2.join(process.cwd(), "solutions", fileName);
    if (!fs2.existsSync(filePath)) {
      console.error("Image file not found:", filePath);
      return false;
    }
    const buffer = fs2.readFileSync(filePath);
    const formData = new FormData();
    const ext = fileName.split(".").pop()?.toLowerCase();
    const mimeType = ext === "jpg" || ext === "jpeg" ? "image/jpeg" : "image/png";
    const blob = new Blob([buffer], { type: mimeType });
    formData.append("file", blob, fileName);
    formData.append("type", mimeType);
    formData.append("messaging_product", "whatsapp");
    const uploadResponse = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/media`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`
      },
      body: formData
    });
    const uploadData = await uploadResponse.json();
    if (!uploadResponse.ok) {
      console.error("WhatsApp Media Upload Error:", uploadData);
      return false;
    }
    const mediaId = uploadData.id;
    const response = await fetch(`https://graph.facebook.com/v17.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        to,
        type: "image",
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
var MODEL_PRICING = {
  "gpt-5.4": { input: 2.5, output: 15 },
  "gpt-5.2": { input: 1.75, output: 14 },
  "gpt-5.1": { input: 1.25, output: 10 },
  "gpt-5": { input: 1.25, output: 10 },
  "gpt-5-mini": { input: 0.25, output: 2 },
  "gpt-5-nano": { input: 0.05, output: 0.4 },
  "gpt-4o": { input: 2.5, output: 10 },
  "gpt-4o-mini": { input: 0.15, output: 0.6 },
  "gpt-4.1": { input: 2, output: 8 },
  "gpt-4.1-mini": { input: 0.8, output: 3.2 },
  "gpt-4.1-nano": { input: 0.2, output: 0.8 }
};
function calculateCost(model, promptTokens, completionTokens) {
  const pricing = MODEL_PRICING[model] || MODEL_PRICING["gpt-4o"];
  return promptTokens / 1e6 * pricing.input + completionTokens / 1e6 * pricing.output;
}
async function saveTokenUsage(uid, usage, model, action) {
  if (!db) return;
  try {
    const date = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    await db.collection("token_usage").add({
      uid,
      promptTokens: usage.prompt_tokens || 0,
      completionTokens: usage.completion_tokens || 0,
      totalTokens: usage.total_tokens || 0,
      model,
      action,
      createdAt: (/* @__PURE__ */ new Date()).toISOString(),
      date
    });
  } catch (error) {
    console.error("Error saving token usage:", error);
  }
}
async function extractTextFromWhatsAppImage(imageId, uid) {
  const token = process.env.WHATSAPP_ACCESS_TOKEN;
  if (!token) {
    console.error("WHATSAPP_ACCESS_TOKEN is missing.");
    return { text: "", cost: 0 };
  }
  try {
    const urlResponse = await fetch(`https://graph.facebook.com/v17.0/${imageId}`, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const urlData = await urlResponse.json();
    if (!urlData.url) {
      console.error("Failed to get image URL from WhatsApp:", urlData);
      return { text: "", cost: 0 };
    }
    const imageResponse = await fetch(urlData.url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString("base64");
    const mimeType = urlData.mime_type || "image/jpeg";
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
              text: "Bu g\xF6rseldeki metni, \xF6zellikle matematik, geometri veya fen sorular\u0131n\u0131 eksiksiz ve do\u011Fru bir \u015Fekilde metne d\xF6k. Sadece okudu\u011Fun metni ver, ekstra yorum yapma."
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
async function analyzeQuestion(text, uid) {
  const ai = getOpenAI();
  if (!ai) return { isQuestion: true, difficulty: 2, examType: "Genel", subject: "Soru", topic: "Genel", cost: 0 };
  try {
    const response = await ai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        {
          role: "system",
          content: `Sen bir e\u011Fitim asistan\u0131s\u0131n. Verilen metnin \xE7\xF6z\xFClmesi gereken bir ders/e\u011Fitim sorusu (matematik, fizik, kimya vb. herhangi bir seviyede) olup olmad\u0131\u011F\u0131n\u0131 kontrol et. Soru en basit d\xFCzeyde bir denklem veya i\u015Flem bile olsa 'isQuestion: true' d\xF6nd\xFCr. Sadece sohbet, selamla\u015Fma veya e\u011Fitimle alakas\u0131z metinlerde 'false' d\xF6nd\xFCr.
          E\u011Fer soru ise zorluk seviyesini 1 ile 4 aras\u0131nda belirle.
          1: Kolay (tek i\u015Flem, basit bilgi, 1 ad\u0131m \xE7\xF6z\xFCml\xFC sorular)
          2: Orta (2-3 i\u015Flemli, temel yorum sorular\u0131)
          3: Zor (\xE7ok ad\u0131ml\u0131 i\u015Flem, dikkat gerektiren mant\u0131k sorular\u0131)
          4: \xC7ok Zor (uzun mant\u0131k zinciri, s\u0131nav\u0131n ay\u0131rt edici sorular\u0131)
          Ayr\u0131ca sorunun hangi s\u0131nava (sadece LGS, TYT veya AYT), hangi derse (Matematik, Fizik, Kimya, Biyoloji, T\xFCrk\xE7e, Tarih, Co\u011Frafya, vb.) ve hangi konuya ait oldu\u011Funu belirle.
          Sadece \u015Fu JSON format\u0131nda yan\u0131t ver: {"isQuestion": true/false, "difficulty": 1/2/3/4, "examType": "LGS/TYT/AYT", "subject": "Ders Ad\u0131", "topic": "Konu Ad\u0131"}`
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
async function solveQuestion(text, difficulty, uid) {
  const ai = getOpenAI();
  if (!ai) return { text: "Bu sorunun \xE7\xF6z\xFCm\xFC: 2x = 10, x = 5. (Mock \xC7\xF6z\xFCm)", model: "mock", cost: 0 };
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
          content: `Sen alan\u0131nda 15+ y\u0131l deneyimli, TYT/AYT/LGS s\u0131navlar\u0131na \xF6\u011Frenci haz\u0131rlam\u0131\u015F tecr\xFCbeli bir T\xFCrk \xF6\u011Fretmenisin. Soruyu \xF6zel ders verir gibi \xE7\xF6z.
G\xF6revin:
1. Soruyu inceleyerek hangi s\u0131nav\u0131n (sadece LGS, TYT veya AYT), hangi dersin ve hangi konusu oldu\u011Funu analiz et. \xC7\xF6z\xFCm\xFCn\xFCn EN \xDCST\xDCNE, bu analizi sola dayal\u0131 olarak '**\u{1F4C1} S\u0131nav :**' hangi s\u0131navsa, bir alt sat\u0131ra '**\u270D\u{1F3FB} Ders :**' hangi ders ise, bir alt sat\u0131ra '**\u{1F4D6} Konu :**' hangi konu ise yaz. Ba\u015Fka hi\xE7bir kelime olmas\u0131n.
2. "**\u{1F9E9} \u0130PUCU >**" yaz. \u0130pucu ver \u2013 Soruyu \xE7\xF6zmek i\xE7in hangi kural, form\xFCl veya strateji gerekli oldu\u011Funu 15 kelimeyi ge\xE7meyecek \u015Fekilde anlat.
3. "**\u{1F680} \xC7\xD6Z\xDCM >**" yaz.  Ad\u0131m ad\u0131m \xE7\xF6z \u2013 Her ad\u0131mda alt sat\u0131ra ge\xE7, her ad\u0131m\u0131n sat\u0131r ba\u015F\u0131na "> " yaz. Gerek\xE7esini a\xE7\u0131kla. \xD6\u011Frenci sanki yan\u0131nda oturuyormu\u015F gibi konu\u015F.
4. "**\u{1F9D0} SIK YAPILAN HATA >**" yaz. Tuzaklara dikkat et \u2013 Bu soruda \xF6\u011Frencilerin s\u0131k yapt\u0131\u011F\u0131 hatay\u0131 belirt.
5. "**\u2705 DO\u011ERU CEVAP >**" yaz. Do\u011Fru se\xE7ene\u011Fi a\xE7\u0131kla \u2013 Cevab\u0131n neden do\u011Fru oldu\u011Funu, di\u011Fer \u015F\u0131klar\u0131n neden yanl\u0131\u015F oldu\u011Funu k\u0131saca g\xF6ster.
6. "**\u2728 BONUS  NOT >**" yaz. Tek c\xFCmlelik alt\u0131n kural veya haf\u0131zada kalacak bir not b\u0131rak.
7. "**\u{1F5C2}\uFE0F B\u0130LG\u0130 >**" yaz. S\u0131navda bu dersten ka\xE7 soru gelir ve bu konudan ka\xE7 soru gelebilece\u011Fini belirt.
8 Cevab\u0131n do\u011Frulu\u011Funu tekrar kontrol et. bir tutars\u0131zl\u0131k varsa gerekirse tekrar \xE7\xF6z. Bu kontrol\xFC herhangi bir mesaj d\xF6nd\xFCrmeden yap.

\xD6NEML\u0130 KURAL: Cevaplar\u0131 ak\u0131c\u0131 ve do\u011Fal bir anlat\u0131mla yaz. Sadece ba\u015Fl\u0131klar\u0131 (\xF6rne\u011Fin **\u{1F680} \xC7\xD6Z\xDCM >**) Markdown ile kal\u0131n yaz, ancak metnin geri kalan\u0131nda Markdown veya LaTeX kullanma.

T\xFCrk\xE7e cevap ver. Samimi, te\u015Fvik edici ve anla\u015F\u0131l\u0131r bir dil kullan. \xC7\xF6z\xFCm metni bir resmin \xFCzerine yazd\u0131r\u0131laca\u011F\u0131 i\xE7in d\xFCz metin (plain text) kullan.`
        },
        { role: "user", content: text }
      ]
    });
    let cost = 0;
    if (response.usage) {
      await saveTokenUsage(uid, response.usage, modelToUse, "solve_question");
      cost = calculateCost(modelToUse, response.usage.prompt_tokens || 0, response.usage.completion_tokens || 0);
    }
    return { text: response.choices[0].message.content || "\xC7\xF6z\xFCm \xFCretilemedi.", model: modelToUse, cost };
  } catch (error) {
    console.error(`Error solving question with model ${modelToUse}:`, error);
    try {
      const fallbackResponse = await ai.chat.completions.create({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `Sen alan\u0131nda 15+ y\u0131l deneyimli, TYT/AYT/LGS s\u0131navlar\u0131na \xF6\u011Frenci haz\u0131rlam\u0131\u015F tecr\xFCbeli bir T\xFCrk \xF6\u011Fretmenisin. Soruyu \xF6zel ders verir gibi \xE7\xF6z.
G\xF6revin:
1. Soruyu inceleyerek hangi s\u0131nav\u0131n (sadece LGS, TYT veya AYT), hangi dersin ve hangi konusu oldu\u011Funu analiz et. \xC7\xF6z\xFCm\xFCn\xFCn EN \xDCST\xDCNE, bu analizi sola dayal\u0131 olarak '**\u{1F4C1} S\u0131nav :**' hangi s\u0131navsa, bir alt sat\u0131ra '**\u270D\u{1F3FB} Ders :**' hangi ders ise, bir alt sat\u0131ra '**\u{1F4D6} Konu :**' hangi konu ise yaz. Ba\u015Fka hi\xE7bir kelime olmas\u0131n.
2. "**\u{1F9E9} \u0130PUCU >**" yaz. \u0130pucu ver \u2013 Soruyu \xE7\xF6zmek i\xE7in hangi kural, form\xFCl veya strateji gerekli oldu\u011Funu 15 kelimeyi ge\xE7meyecek \u015Fekilde anlat.
3. "**\u{1F680} \xC7\xD6Z\xDCM >**" yaz.  Ad\u0131m ad\u0131m \xE7\xF6z \u2013 Her ad\u0131mda alt sat\u0131ra ge\xE7, her ad\u0131m\u0131n sat\u0131r ba\u015F\u0131na "> " yaz. Gerek\xE7esini a\xE7\u0131kla. \xD6\u011Frenci sanki yan\u0131nda oturuyormu\u015F gibi konu\u015F.
4. "**\u{1F9D0} SIK YAPILAN HATA >**" yaz. Tuzaklara dikkat et \u2013 Bu soruda \xF6\u011Frencilerin s\u0131k yapt\u0131\u011F\u0131 hatay\u0131 belirt.
5. "**\u2705 DO\u011ERU CEVAP >**" yaz. Do\u011Fru se\xE7ene\u011Fi a\xE7\u0131kla \u2013 Cevab\u0131n neden do\u011Fru oldu\u011Funu, di\u011Fer \u015F\u0131klar\u0131n neden yanl\u0131\u015F oldu\u011Funu k\u0131saca g\xF6ster.
6. "**\u2728 BONUS  NOT >**" yaz. Tek c\xFCmlelik alt\u0131n kural veya haf\u0131zada kalacak bir not b\u0131rak.
7. "**\u{1F5C2}\uFE0F B\u0130LG\u0130 >**" yaz. S\u0131navda bu dersten ka\xE7 soru gelir ve bu konudan ka\xE7 soru gelebilece\u011Fini belirt.
8 Cevab\u0131n do\u011Frulu\u011Funu tekrar kontrol et. bir tutars\u0131zl\u0131k varsa gerekirse tekrar \xE7\xF6z. Bu kontrol\xFC herhangi bir mesaj d\xF6nd\xFCrmeden yap.

\xD6NEML\u0130 KURAL: Cevaplar\u0131 ak\u0131c\u0131 ve do\u011Fal bir anlat\u0131mla yaz. Sadece ba\u015Fl\u0131klar\u0131 (\xF6rne\u011Fin **\u{1F680} \xC7\xD6Z\xDCM >**) Markdown ile kal\u0131n yaz, ancak metnin geri kalan\u0131nda Markdown veya LaTeX kullanma.

T\xFCrk\xE7e cevap ver. Samimi, te\u015Fvik edici ve anla\u015F\u0131l\u0131r bir dil kullan. \xC7\xF6z\xFCm metni bir resmin \xFCzerine yazd\u0131r\u0131laca\u011F\u0131 i\xE7in d\xFCz metin (plain text) kullan.`
          },
          { role: "user", content: text }
        ]
      });
      let fallbackCost = 0;
      if (fallbackResponse.usage) {
        await saveTokenUsage(uid, fallbackResponse.usage, "gpt-4o", "solve_question_fallback");
        fallbackCost = calculateCost("gpt-4o", fallbackResponse.usage.prompt_tokens || 0, fallbackResponse.usage.completion_tokens || 0);
      }
      return { text: fallbackResponse.choices[0].message.content || "\xC7\xF6z\xFCm \xFCretilemedi.", model: "gpt-4o", cost: fallbackCost };
    } catch (fallbackError) {
      return { text: "\xC7\xF6z\xFCm s\u0131ras\u0131nda bir hata olu\u015Ftu.", model: "error", cost: 0 };
    }
  }
}
async function generateAndUploadImage(solutionText, baseUrl) {
  try {
    console.log("Starting generateAndUploadImage...");
    const formatMathText = (text) => {
      const superscripts = {
        "0": "\u2070",
        "1": "\xB9",
        "2": "\xB2",
        "3": "\xB3",
        "4": "\u2074",
        "5": "\u2075",
        "6": "\u2076",
        "7": "\u2077",
        "8": "\u2078",
        "9": "\u2079",
        "+": "\u207A",
        "-": "\u207B",
        "n": "\u207F",
        "x": "\u02E3",
        "y": "\u02B8",
        "(": "\u207D",
        ")": "\u207E"
      };
      return text.replace(/\^\{?([0-9+\-nxy()]+)\}?/g, (match, p1) => {
        return p1.split("").map((char) => superscripts[char] || char).join("");
      });
    };
    const formattedSolutionText = formatMathText(solutionText);
    const now = /* @__PURE__ */ new Date();
    const turkeyTime = new Date(now.getTime() + 3 * 60 * 60 * 1e3);
    const dd = String(turkeyTime.getUTCDate()).padStart(2, "0");
    const mm = String(turkeyTime.getUTCMonth() + 1).padStart(2, "0");
    const yyyy = turkeyTime.getUTCFullYear();
    const hh = String(turkeyTime.getUTCHours()).padStart(2, "0");
    const min = String(turkeyTime.getUTCMinutes()).padStart(2, "0");
    const footerText = `

www.kritiksoru.com
${dd}.${mm}.${yyyy} / ${hh}:${min}`;
    const finalSolutionText = formattedSolutionText + footerText;
    const imagePath = path2.join(process.cwd(), "back.jpg");
    let bgImage;
    let canvasWidth = 1080;
    let canvasHeight = 1920;
    if (fs2.existsSync(imagePath)) {
      console.log(`Found background image file: back.jpg`);
      const stats = fs2.statSync(imagePath);
      if (stats.size > 0) {
        try {
          console.log(`Reading image file: ${imagePath}`);
          const imageBuffer = fs2.readFileSync(imagePath);
          console.log(`Calling loadImage with buffer of size ${imageBuffer.length}...`);
          bgImage = await loadImage(imageBuffer);
          console.log("loadImage succeeded.");
          canvasWidth = bgImage.width;
          canvasHeight = bgImage.height;
        } catch (imgError) {
          console.error(`Failed to load background image back.jpg:`, imgError);
          console.warn("Using fallback background due to image load error.");
          bgImage = void 0;
        }
      } else {
        console.warn(`Background image back.jpg is empty (0 bytes). Using fallback background.`);
      }
    } else {
      console.warn("Background image back.jpg not found. Using fallback background.");
    }
    console.log("Creating canvas...");
    const canvas = createCanvas(canvasWidth, canvasHeight);
    const ctx = canvas.getContext("2d");
    if (bgImage) {
      console.log("Drawing background image...");
      try {
        ctx.drawImage(bgImage, 0, 0, canvasWidth, canvasHeight);
      } catch (drawError) {
        console.error("Failed to draw background image:", drawError);
        console.warn("Falling back to solid background.");
        ctx.fillStyle = "#f4f4f9";
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      }
    } else {
      console.log("Drawing fallback background...");
      ctx.fillStyle = "#f4f4f9";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);
      ctx.strokeStyle = "#e0e0e0";
      ctx.lineWidth = 2;
      for (let y = 100; y < canvasHeight; y += 52) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvasWidth, y);
        ctx.stroke();
      }
    }
    console.log("Configuring text rendering limits...");
    const startX = 75;
    const startY = 75;
    const maxWidth = 725;
    const maxHeight = 1e3;
    const maxFontSize = 35;
    const minFontSize = 20;
    const lineHeightMultiplier = 1.4;
    console.log("Wrapping and drawing text with dynamic sizing...");
    const paragraphs = finalSolutionText.split("\n");
    const bodyParagraphs = paragraphs;
    let currentFontSize = maxFontSize;
    let wrappedLines = [];
    let totalTextHeight = 0;
    while (currentFontSize >= minFontSize) {
      ctx.font = `${currentFontSize}px "PatrickHand", "Twemoji Mozilla", "TwemojiMozilla", sans-serif`;
      wrappedLines = [];
      totalTextHeight = 0;
      for (let p = 0; p < bodyParagraphs.length; p++) {
        const paragraphText = bodyParagraphs[p].trim();
        if (paragraphText === "") {
          wrappedLines.push({ text: "", isParagraphBreak: true });
          totalTextHeight += currentFontSize * lineHeightMultiplier / 2;
          continue;
        }
        const words = paragraphText.split(" ");
        let line = "";
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + " ";
          const cleanTestLine = testLine.replace(/\*\*/g, "");
          const metrics = ctx.measureText(cleanTestLine);
          const testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            wrappedLines.push({ text: line, isParagraphBreak: false });
            totalTextHeight += currentFontSize * lineHeightMultiplier;
            line = words[n] + " ";
          } else {
            line = testLine;
          }
        }
        wrappedLines.push({ text: line, isParagraphBreak: false });
        totalTextHeight += currentFontSize * lineHeightMultiplier;
      }
      if (totalTextHeight <= maxHeight) {
        break;
      }
      currentFontSize -= 2;
    }
    let currentY = startY;
    ctx.font = `${currentFontSize}px "PatrickHand", "Twemoji Mozilla", "TwemojiMozilla", sans-serif`;
    ctx.fillStyle = "#3b3b3b";
    ctx.strokeStyle = "#3b3b3b";
    const finalLineHeight = currentFontSize * lineHeightMultiplier;
    for (const lineObj of wrappedLines) {
      if (lineObj.isParagraphBreak) {
        currentY += finalLineHeight / 2;
      } else {
        let currentX = startX;
        const parts = lineObj.text.split(/(\*\*.*?\*\*)/g);
        for (const part of parts) {
          if (!part) continue;
          if (part.startsWith("**") && part.endsWith("**")) {
            const text = part.slice(2, -2);
            ctx.fillText(text, currentX, currentY);
            ctx.lineWidth = 1;
            ctx.strokeText(text, currentX, currentY);
            currentX += ctx.measureText(text).width;
          } else {
            ctx.fillText(part, currentX, currentY);
            currentX += ctx.measureText(part).width;
          }
        }
        currentY += finalLineHeight;
      }
    }
    console.log("Calling canvas.toBuffer...");
    let finalBuffer;
    let isJpeg = false;
    try {
      finalBuffer = canvas.toBuffer("image/png");
      console.log("Canvas text drawing completed (PNG). Buffer size:", finalBuffer.length);
    } catch (pngError) {
      console.warn("Failed to generate PNG buffer, falling back to JPEG:", pngError);
      finalBuffer = canvas.toBuffer("image/jpeg");
      isJpeg = true;
      console.log("Canvas text drawing completed (JPEG). Buffer size:", finalBuffer.length);
    }
    console.log("Saving locally...");
    const ext = isJpeg ? "jpg" : "png";
    const fileName = `solution_${Date.now()}.${ext}`;
    const solutionsDir = path2.join(process.cwd(), "solutions");
    if (!fs2.existsSync(solutionsDir)) {
      fs2.mkdirSync(solutionsDir);
    }
    const filePath = path2.join(solutionsDir, fileName);
    fs2.writeFileSync(filePath, finalBuffer);
    const finalUrl = `${baseUrl}/solutions/${fileName}`;
    console.log("Successfully saved canvas image locally:", finalUrl);
    return finalUrl;
  } catch (error) {
    console.error("Error generating/uploading image:", error);
    console.error("Error stack:", error.stack);
    return `ERROR: ${error.message || String(error)}`;
  }
}
var verifyWhatsAppWebhook = (req, res) => {
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
      console.log("\u2705 Webhook verified successfully!");
      res.status(200).type("text/plain").send(challenge);
    } else {
      console.error("\u274C Webhook verification failed. Token mismatch.");
      res.sendStatus(403);
    }
  } else {
    console.error("\u274C Webhook verification failed. Missing mode or token.");
    res.sendStatus(400);
  }
};
function normalizePhone(phone) {
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.startsWith("90") && cleaned.length === 12) {
    cleaned = "0" + cleaned.substring(2);
  } else if (cleaned.length === 10) {
    cleaned = "0" + cleaned;
  }
  return cleaned;
}
var handleWhatsAppWebhook = async (req, res) => {
  try {
    const body = req.body;
    console.log("--- Incoming WhatsApp Webhook ---");
    console.log(JSON.stringify(body, null, 2));
    if (body.object === "whatsapp_business_account") {
      res.sendStatus(200);
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;
      if (messages && messages.length > 0) {
        const baseUrl = `https://${req.get("host")}`;
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
async function processWhatsAppMessage(msg, baseUrl) {
  try {
    const phone = msg.from;
    const normalizedPhone = normalizePhone(phone);
    if (!db) {
      console.error("Firestore is not initialized.");
      return;
    }
    const phoneDoc = await db.collection("phone_numbers").doc(normalizedPhone).get();
    if (!phoneDoc.exists) {
      console.log(`User not found for phone: ${normalizedPhone}`);
      await sendWhatsAppMessage(phone, "\xDCyeli\u011Finiz bulunamad\u0131. www.kritiksoru.com 'dan \xFCye olabilirsiniz.");
      return;
    }
    const uid = phoneDoc.data()?.uid;
    if (!uid) {
      console.log(`UID not found for phone: ${normalizedPhone}`);
      await sendWhatsAppMessage(phone, "\xDCyeli\u011Finiz bulunamad\u0131. www.kritiksoru.com 'dan \xFCye olabilirsiniz.");
      return;
    }
    const userDoc = await db.collection("users").doc(uid).get();
    const user = userDoc.data();
    if (!user) {
      console.log(`User document not found for UID: ${uid}`);
      await sendWhatsAppMessage(phone, "\xDCyeli\u011Finiz bulunamad\u0131. www.kritiksoru.com 'dan \xFCye olabilirsiniz.");
      return;
    }
    const tokens = user.tokens || 0;
    if (tokens === 0) {
      console.log(`User ${uid} has 0 tokens.`);
      await sendWhatsAppMessage(phone, "Yeterli kont\xF6r\xFCn\xFCz bulunmamaktad\u0131r. www.kritiksoru.com 'dan kont\xF6r y\xFCkleyebilirsiniz.");
      return;
    }
    const today = (/* @__PURE__ */ new Date()).toISOString().split("T")[0];
    let dailyCount = user.dailyQuestionCount || 0;
    const lastDate = user.lastQuestionDate || "";
    if (lastDate !== today) {
      dailyCount = 0;
    }
    if (dailyCount >= 5) {
      console.log(`User ${uid} reached daily limit (${dailyCount}).`);
      await sendWhatsAppMessage(phone, "G\xFCnl\xFCk soru kotas\u0131n\u0131 doldurdun. Yar\u0131n g\xF6r\xFC\u015Fmek \xFCzere! ");
      return;
    }
    let questionText = "";
    let totalCost = 0;
    console.log("Message Type:", msg.type);
    if (msg.type === "text" && msg.text && msg.text.body) {
      questionText = msg.text.body;
    } else if (msg.type === "image" && msg.image && msg.image.id) {
      const imageId = msg.image.id;
      const extractResult = await extractTextFromWhatsAppImage(imageId, uid);
      questionText = extractResult.text;
      totalCost += extractResult.cost;
    } else {
      console.log("Unsupported message type or missing content:", msg);
      await sendWhatsAppMessage(phone, "\u015Eu anda sadece metin ve g\xF6rsel mesajlar\u0131 destekliyoruz.");
      return;
    }
    console.log("Extracted Question Text:", questionText);
    if (!questionText || questionText.trim() === "") {
      console.log("Question text is empty after extraction.");
      await sendWhatsAppMessage(phone, "G\xF6nderdi\u011Finiz mesajdan bir soru \xE7\u0131kar\u0131lamad\u0131. L\xFCtfen tekrar deneyin.");
      return;
    }
    const analysis = await analyzeQuestion(questionText, uid);
    totalCost += analysis.cost;
    if (!analysis.isQuestion) {
      await sendWhatsAppMessage(phone, "Soru bulunamad\u0131. www.kritiksoru.com");
      return;
    }
    const { text: solutionText, model: usedModel, cost: solveCost } = await solveQuestion(questionText, analysis.difficulty, uid);
    totalCost += solveCost;
    const solutionImageUrl = await generateAndUploadImage(solutionText, baseUrl);
    if (solutionImageUrl && !solutionImageUrl.startsWith("ERROR:")) {
      const success = await sendWhatsAppImage(phone, solutionImageUrl);
      if (!success) {
        await sendWhatsAppMessage(phone, "G\xF6rsel g\xF6nderilirken bir hata olu\u015Ftu. \xC7\xF6z\xFCm:\n\n" + solutionText);
      }
    } else {
      const errMsg = solutionImageUrl.startsWith("ERROR:") ? solutionImageUrl : "Bilinmeyen hata";
      await sendWhatsAppMessage(phone, `G\xF6rsel olu\u015Fturulurken bir hata olu\u015Ftu (${errMsg}). \xC7\xF6z\xFCm:

` + solutionText);
    }
    await db.collection("questions").add({
      uid,
      questionText,
      answerText: solutionText,
      imageUrl: solutionImageUrl,
      status: "solved",
      model: usedModel,
      cost: totalCost,
      examType: analysis.examType,
      subject: analysis.subject,
      topic: analysis.topic,
      createdAt: (/* @__PURE__ */ new Date()).toISOString()
    });
    const updatedTokens = tokens - 1;
    await db.collection("users").doc(uid).update({
      tokens: updatedTokens,
      dailyQuestionCount: dailyCount + 1,
      lastQuestionDate: today
    });
    const packageName = user.activePlan || "Standart Paket";
    await sendWhatsAppMessage(phone, `Paketiniz: ${packageName}
Kalan kont\xF6r miktar\u0131n\u0131z: ${updatedTokens}`);
  } catch (error) {
    console.error("Error processing WhatsApp message:", error);
  }
}

// server.ts
async function startServer() {
  const app = express();
  const PORT = 3e3;
  app.use(cors());
  app.use(express.json());
  const solutionsDir = path3.join(process.cwd(), "solutions");
  if (!fs3.existsSync(solutionsDir)) {
    fs3.mkdirSync(solutionsDir);
  }
  app.use("/solutions", express.static(solutionsDir));
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });
  app.get("/api/system-health", (req, res) => {
    const memoryUsage = process.memoryUsage();
    const uptimeSeconds = Math.floor(process.uptime());
    const days = Math.floor(uptimeSeconds / (3600 * 24));
    const hours = Math.floor(uptimeSeconds % (3600 * 24) / 3600);
    const minutes = Math.floor(uptimeSeconds % 3600 / 60);
    const seconds = uptimeSeconds % 60;
    let uptimeStr = "";
    if (days > 0) uptimeStr += `${days}g `;
    if (hours > 0) uptimeStr += `${hours}s `;
    if (minutes > 0) uptimeStr += `${minutes}d `;
    uptimeStr += `${seconds}sn`;
    res.json({
      status: "Online",
      uptime: uptimeStr,
      memoryRss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || "development",
      webhookActive: !!process.env.WHATSAPP_VERIFY_TOKEN
    });
  });
  app.get("/api/webhook/whatsapp", verifyWhatsAppWebhook);
  app.post("/api/webhook/whatsapp", handleWhatsAppWebhook);
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path3.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path3.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}
startServer();

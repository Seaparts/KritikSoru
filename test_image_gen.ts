import { generateAndUploadImage } from './server/whatsappHandler';

async function run() {
  try {
    const url = await generateAndUploadImage("Test solution text\nLine 2\nLine 3", "http://localhost:3000");
    console.log("Result URL:", url);
  } catch (e) {
    console.error("Test failed:", e);
  }
}

run();

import { generateAndUploadImage } from './server/whatsappHandler.js';

async function test() {
  try {
    const url = await generateAndUploadImage("Test text", "http://localhost:3000");
    console.log("Result URL:", url);
  } catch (e) {
    console.error(e);
  }
}
test();

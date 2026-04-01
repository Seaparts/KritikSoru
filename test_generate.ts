import { generateAndUploadImage } from './server/whatsappHandler.js';

async function test() {
  const url = await generateAndUploadImage("Test solution text", "http://localhost:3000");
  console.log("Result:", url);
}

test().catch(console.error);

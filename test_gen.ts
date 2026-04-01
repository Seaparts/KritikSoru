import { generateAndUploadImage } from './server/whatsappHandler';

async function run() {
  try {
    const url = await generateAndUploadImage('Test solution text', 'http://localhost:3000');
    console.log('Result:', url);
  } catch (e) {
    console.error('Error:', e);
  }
}
run();

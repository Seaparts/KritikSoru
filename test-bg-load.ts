import fs from 'fs';
import path from 'path';
import { loadImage } from '@napi-rs/canvas';

async function test() {
  const files = fs.readdirSync(process.cwd());
  const generatedImageFile = files.find(file => file.toLowerCase().startsWith('generate') && (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')));
  
  if (generatedImageFile) {
    console.log(`Found background image file: ${generatedImageFile}`);
    const imagePath = path.join(process.cwd(), generatedImageFile);
    const imageBuffer = fs.readFileSync(imagePath);
    try {
      const bgImage = await loadImage(imageBuffer);
      console.log("loadImage succeeded.", bgImage.width, bgImage.height);
    } catch (e) {
      console.error("Failed to load image:", e);
    }
  } else {
    console.log("No file found");
  }
}
test();

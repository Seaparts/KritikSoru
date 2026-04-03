import { loadImage } from '@napi-rs/canvas';
import * as fs from 'fs';
import * as path from 'path';

async function test() {
  const files = fs.readdirSync(process.cwd());
  const generatedImageFile = files.find(file => 
    (file.toLowerCase().startsWith('generate_bg') || file.toLowerCase().startsWith('generated')) && 
    (file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
  );
  
  if (generatedImageFile) {
    console.log(`Found background image file: ${generatedImageFile}`);
    const imagePath = path.join(process.cwd(), generatedImageFile);
    const stats = fs.statSync(imagePath);
    console.log(`File size: ${stats.size}`);
    if (stats.size > 0) {
      try {
        const imageBuffer = fs.readFileSync(imagePath);
        const bgImage = await loadImage(imageBuffer);
        console.log("loadImage succeeded.", bgImage.width, bgImage.height);
      } catch (e) {
        console.error("Failed to load image:", e);
      }
    }
  } else {
    console.log("No file found.");
  }
}
test();

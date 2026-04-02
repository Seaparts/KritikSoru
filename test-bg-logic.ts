import fs from 'fs';
import path from 'path';
import { loadImage, createCanvas } from '@napi-rs/canvas';

async function test() {
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

  console.log("bgImage is:", !!bgImage);
}
test();

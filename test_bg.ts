import { loadImage, createCanvas } from '@napi-rs/canvas';
import fs from 'fs';

async function test() {
  try {
    const buffer = fs.readFileSync('generated_bg.png');
    console.log("Read buffer of size", buffer.length);
    const img = await loadImage(buffer);
    console.log("Loaded image", img.width, img.height);
    
    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    
    console.log("Drawing image succeeded.");
    
    const outBuffer = canvas.toBuffer('image/png');
    console.log("toBuffer succeeded, size", outBuffer.length);
  } catch (e: any) {
    console.error("Error:", e.message);
  }
}
test();

import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function run() {
  try {
    const imageBuffer = fs.readFileSync('generated_bg.png');
    const bgImage = await loadImage(imageBuffer);
    
    const canvas = createCanvas(bgImage.width, bgImage.height);
    const ctx = canvas.getContext('2d');
    
    ctx.drawImage(bgImage, 0, 0, bgImage.width, bgImage.height);
    
    const buf = canvas.toBuffer('image/png');
    console.log("PNG works, size:", buf.length);
  } catch (e) {
    console.error("Error:", e);
  }
}
run();

import { createCanvas, loadImage } from '@napi-rs/canvas';

async function run() {
  try {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    
    // Create an invalid image buffer
    const buffer = Buffer.from('invalid image data');
    const img = await loadImage(buffer);
    
    ctx.drawImage(img, 0, 0, 100, 100);
  } catch (e) {
    console.error("Error:", e);
  }
}

run();

import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function test() {
  try {
    console.log("Creating canvas...");
    const canvas = createCanvas(800, 600);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 800, 600);
    ctx.fillStyle = '#000000';
    ctx.font = '30px Arial';
    ctx.fillText('Test', 50, 50);
    
    console.log("Exporting to buffer...");
    const buffer = canvas.toBuffer('image/png');
    console.log("Buffer size:", buffer.length);
    
    console.log("Loading image...");
    const bgBuffer = fs.readFileSync('generated_bg.png');
    const img = await loadImage(bgBuffer);
    console.log("Image loaded:", img.width, img.height);
  } catch (e) {
    console.error("Error:", e);
  }
}

test();

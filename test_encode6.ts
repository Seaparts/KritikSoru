import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function run() {
  try {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    
    // Draw something
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 100, 100);
    
    try {
      canvas.toBuffer('image/jpeg');
      console.log("image/jpeg works");
    } catch (e) {
      console.log("image/jpeg threw:", e.message);
    }
  } catch (e) {
    console.error("Outer Error:", e);
  }
}
run();

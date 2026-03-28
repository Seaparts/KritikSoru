import { createCanvas, loadImage, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';
import path from 'path';

async function test() {
  try {
    const fontPath = path.join(process.cwd(), 'Roboto-Regular.ttf');
    GlobalFonts.registerFromPath(fontPath, 'Roboto');
    
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f4f4f9';
    ctx.fillRect(0, 0, 1080, 1920);
    
    ctx.font = 'bold 36px Roboto';
    ctx.fillStyle = '#000000';
    ctx.fillText('Test Solution', 100, 100);
    
    const buffer = canvas.toBuffer('image/png');
    console.log("Success! Buffer size:", buffer.length);
  } catch (e) {
    console.error("Failed:", e);
  }
}

test();

import { loadImage } from '@napi-rs/canvas';
import * as fs from 'fs';

async function test() {
  try {
    const imageBuffer = fs.readFileSync('generated_bg.png');
    const bgImage = await loadImage(imageBuffer);
    console.log("loadImage succeeded.", bgImage.width, bgImage.height);
  } catch (e) {
    console.error("Failed to load image:", e);
  }
}
test();

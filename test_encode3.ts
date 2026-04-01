import { createCanvas, loadImage } from '@napi-rs/canvas';
import fs from 'fs';

async function run() {
  try {
    const canvas = createCanvas(100, 100);
    const ctx = canvas.getContext('2d');
    
    // Create a valid image but maybe with weird dimensions or something?
    // Actually, if loadImage succeeds, the image is valid.
    
    // What if we don't use 'image/png' but something else?
    const buf = canvas.toBuffer('image/png');
    console.log("PNG works");
  } catch (e) {
    console.error("Error:", e);
  }
}
run();

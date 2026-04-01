import { createCanvas } from '@napi-rs/canvas';

async function run() {
  try {
    const canvas = createCanvas(1080, 1920);
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, 1080, 1920);
    
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

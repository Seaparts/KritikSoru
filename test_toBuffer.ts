import { createCanvas } from '@napi-rs/canvas';

try {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
  
  const buffer = canvas.toBuffer('image/png');
  console.log("PNG works");
} catch (e) {
  console.error("Error PNG:", e);
}

try {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
  
  const buffer = canvas.toBuffer('image/jpeg');
  console.log("JPEG works");
} catch (e) {
  console.error("Error JPEG:", e);
}

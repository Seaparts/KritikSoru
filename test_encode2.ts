import { createCanvas } from '@napi-rs/canvas';
try {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
  const buf1 = canvas.toBuffer('image/png');
  console.log("PNG works, size:", buf1.length);
  const buf2 = canvas.toBuffer('image/jpeg');
  console.log("JPEG works, size:", buf2.length);
} catch (e) {
  console.error("Error:", e);
}

import { createCanvas } from '@napi-rs/canvas';

try {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);
  
  // Try invalid mime type
  canvas.toBuffer('image/invalid');
} catch (e) {
  console.error("Error with invalid mime type:", e);
}

try {
  const canvas = createCanvas(100, 100);
  canvas.toBuffer('image/png');
  console.log("image/png works");
} catch (e) {
  console.error("Error with image/png:", e);
}

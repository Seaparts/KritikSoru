import { createCanvas, Image } from '@napi-rs/canvas';

try {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  
  const img = new Image();
  // img.src is not set, or set to invalid
  ctx.drawImage(img, 0, 0, 100, 100);
} catch (e) {
  console.error("Error with drawImage:", e);
}

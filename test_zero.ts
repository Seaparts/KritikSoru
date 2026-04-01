import { createCanvas } from '@napi-rs/canvas';

try {
  const canvas = createCanvas(0, 0);
  canvas.toBuffer('image/png');
} catch (e) {
  console.error("Error 0x0:", e);
}

import { createCanvas } from '@napi-rs/canvas';

async function test() {
  const canvas = createCanvas(100, 100);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'red';
  ctx.fillRect(0, 0, 100, 100);

  const formats = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];
  for (const format of formats) {
    try {
      const buffer = canvas.toBuffer(format as any);
      console.log(`${format}: Success, size ${buffer.length}`);
    } catch (e: any) {
      console.error(`${format}: Failed - ${e.message}`);
    }
  }
}

test();

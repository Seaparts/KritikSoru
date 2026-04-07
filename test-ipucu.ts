import { Canvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';

GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
GlobalFonts.registerFromPath('AppleColorEmoji.ttf', 'AppleColorEmoji');

const canvas = new Canvas(1080, 1920);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#f4f4f9';
ctx.fillRect(0, 0, 1080, 1920);

const currentFontSize = 30;
const startX = 75;
let currentY = 100;

const textToDraw = "> İPUCU : Q = I*t formülünü kullan.";
const prefix = '> İPUCU :';
const idx = textToDraw.indexOf(prefix);

if (idx !== -1) {
  const before = textToDraw.substring(0, idx);
  const after = textToDraw.substring(idx + prefix.length);
  
  let currentX = startX;
  if (before) {
    ctx.font = `${currentFontSize}px "PatrickHand", "AppleColorEmoji", sans-serif`;
    ctx.fillStyle = '#3b3b3b';
    ctx.fillText(before, currentX, currentY);
    currentX += ctx.measureText(before).width;
  }
  
  ctx.font = `bold ${currentFontSize}px "PatrickHand", "AppleColorEmoji", sans-serif`;
  ctx.fillStyle = '#4f46e5';
  ctx.fillText(prefix, currentX, currentY);
  currentX += ctx.measureText(prefix).width;
  
  ctx.font = `${currentFontSize}px "PatrickHand", "AppleColorEmoji", sans-serif`;
  ctx.fillStyle = '#3b3b3b';
  if (after) {
    ctx.fillText(after, currentX, currentY);
  }
}

fs.writeFileSync('test-ipucu.png', canvas.toBuffer('image/png'));

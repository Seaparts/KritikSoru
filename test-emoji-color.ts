import { GlobalFonts, Canvas } from '@napi-rs/canvas';
import fs from 'fs';

GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
GlobalFonts.registerFromPath('NotoColorEmoji.ttf', 'NotoColorEmoji');
const canvas = new Canvas(400, 200);
const ctx = canvas.getContext('2d');
ctx.fillStyle = 'red';
ctx.font = '30px "PatrickHand", "NotoColorEmoji", sans-serif';
ctx.fillText('Hello 📁 ✍🏻 📖 🧩', 50, 100);
const buffer = canvas.toBuffer('image/png');
fs.writeFileSync('test-emoji-color.png', buffer);
console.log("Buffer size:", buffer.length);

import { GlobalFonts, Canvas } from '@napi-rs/canvas';
import fs from 'fs';

GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
GlobalFonts.registerFromPath('NotoColorEmoji.ttf', 'NotoColorEmoji');
const canvas = new Canvas(400, 200);
const ctx = canvas.getContext('2d');
ctx.font = '30px "PatrickHand", "NotoColorEmoji", sans-serif';
ctx.fillText('Hello 📁 ✍🏻 📖 🧩', 50, 100);
fs.writeFileSync('test-emoji.png', canvas.toBuffer('image/png'));

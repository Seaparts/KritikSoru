import { GlobalFonts, Canvas } from '@napi-rs/canvas';
import fs from 'fs';

GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
const canvas = new Canvas(400, 200);
const ctx = canvas.getContext('2d');
ctx.font = '30px "Patrick Hand"';
ctx.fillText('Hello World', 50, 100);
ctx.font = '30px PatrickHand';
ctx.fillText('Hello World 2', 50, 150);
fs.writeFileSync('test-font-draw.png', canvas.toBuffer('image/png'));

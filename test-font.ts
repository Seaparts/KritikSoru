import { GlobalFonts, Canvas } from '@napi-rs/canvas';
import fs from 'fs';

GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
const canvas = new Canvas(400, 200);
const ctx = canvas.getContext('2d');
ctx.font = '30px PatrickHand';
ctx.fillStyle = 'black';
ctx.fillText('x² x³ x⁴ xⁿ 2¹⁰', 50, 100);
fs.writeFileSync('test-font.png', canvas.toBuffer('image/png'));
console.log('Done');

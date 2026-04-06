import { Canvas, GlobalFonts } from '@napi-rs/canvas';
import fs from 'fs';

GlobalFonts.registerFromPath('PatrickHand-Regular.ttf', 'PatrickHand');
GlobalFonts.registerFromPath('NotoColorEmoji.ttf', 'NotoColorEmoji');

const canvas = new Canvas(1080, 1920);
const ctx = canvas.getContext('2d');

ctx.fillStyle = '#f4f4f9';
ctx.fillRect(0, 0, 1080, 1920);

ctx.font = '30px "PatrickHand", "NotoColorEmoji", sans-serif';
ctx.fillStyle = 'black';
ctx.fillText('📁 Sınav : AYT', 75, 75);

ctx.font = '30px "PatrickHand", "NotoColorEmoji", sans-serif';
ctx.fillStyle = '#3b3b3b';
ctx.fillText('✍🏻 Ders : Kimya', 75, 150);
ctx.fillText('📖 Konu : Elektroliz', 75, 200);
ctx.fillText('🧩 İPUCU : Q = I*t', 75, 250);

fs.writeFileSync('test-final.png', canvas.toBuffer('image/png'));

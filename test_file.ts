import fs from 'fs';
const buf = fs.readFileSync('generated_bg.png');
console.log(buf.slice(0, 16).toString('hex'));
console.log(buf.slice(0, 16).toString('utf8'));

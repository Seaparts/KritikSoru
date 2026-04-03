import * as fs from 'fs';

const buffer = fs.readFileSync('generated_bg.png');
console.log(buffer.subarray(0, 8).toString('hex'));

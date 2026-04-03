import * as fs from 'fs';

const buffer = fs.readFileSync('generate_bg.png');
console.log(buffer.subarray(0, 8).toString('hex'));

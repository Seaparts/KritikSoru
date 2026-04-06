import fs from 'fs';
import https from 'https';

function download(url: string, dest: string) {
  return new Promise<void>((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location!, dest).then(resolve).catch(reject);
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve();
        });
      } else {
        reject(new Error(`Status code: ${res.statusCode}`));
      }
    }).on('error', reject);
  });
}

download('https://github.com/samuelngs/apple-emoji-linux/releases/download/v17.4/AppleColorEmoji.ttf', 'AppleColorEmoji.ttf')
  .then(() => console.log('Downloaded, size:', fs.statSync('AppleColorEmoji.ttf').size))
  .catch(console.error);

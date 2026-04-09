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

async function downloadAll() {
  try {
    console.log('Downloading PatrickHand...');
    await download('https://github.com/google/fonts/raw/main/ofl/patrickhand/PatrickHand-Regular.ttf', 'PatrickHand-Regular.ttf');
    console.log('PatrickHand downloaded.');
    
    console.log('Downloading TwemojiMozilla...');
    await download('https://github.com/mozilla/twemoji-colr/releases/download/v0.7.0/Twemoji.Mozilla.ttf', 'TwemojiMozilla.ttf');
    console.log('TwemojiMozilla downloaded.');
    process.exit(0);
  } catch (error) {
    console.error('Download failed:', error);
    process.exit(1);
  }
}

downloadAll();

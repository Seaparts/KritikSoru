import fs from 'fs';
import https from 'https';

const url = 'https://github.com/google/fonts/raw/main/ofl/patrickhand/PatrickHand-Regular.ttf';
const file = fs.createWriteStream('PatrickHand-Regular.ttf');

https.get(url, (response) => {
  if (response.statusCode === 301 || response.statusCode === 302) {
    https.get(response.headers.location!, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Download completed.');
      });
    });
  } else {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('Download completed.');
    });
  }
});

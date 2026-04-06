import fs from 'fs';
import https from 'https';

const file = fs.createWriteStream("NotoColorEmoji.ttf");
https.get("https://github.com/googlefonts/noto-emoji/raw/main/fonts/NotoColorEmoji.ttf", function(response) {
  if (response.statusCode === 302 || response.statusCode === 301) {
    https.get(response.headers.location, function(redirectResponse) {
      redirectResponse.pipe(file);
    });
  } else {
    response.pipe(file);
  }
});

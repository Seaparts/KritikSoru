import fs from 'fs';
import path from 'path';

function search(dir: string, keyword: string) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      search(fullPath, keyword);
    } else if (stat.isFile() && (fullPath.endsWith('.js') || fullPath.endsWith('.ts') || fullPath.endsWith('.node'))) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes(keyword)) {
          console.log(`Found in: ${fullPath}`);
        }
      } catch (e) {
        // Ignore binary files or read errors
      }
    }
  }
}

search('node_modules/@napi-rs/canvas', 'Unsupported image type');

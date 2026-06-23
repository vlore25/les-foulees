const fs = require('fs');
const path = require('path');

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    if (file === 'node_modules' || file === '.next' || file === '.git') return;
    const dirFile = path.join(dir, file);
    try {
      if (fs.statSync(dirFile).isDirectory()) {
        filelist = walkSync(dirFile, filelist);
      } else {
        if (dirFile.endsWith('.tsx') || dirFile.endsWith('.ts')) {
          filelist.push(dirFile);
        }
      }
    } catch (err) {
      if (err.code === 'ENOENT' || err.code === 'EACCES' || err.code === 'EPERM') {
        // Skip
      } else throw err;
    }
  });
  return filelist;
}

const dirPath = 'D:\\DEV\\les-foulees';
const files = walkSync(dirPath);

let changedFiles = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Replace various rounded sizes with lg
  content = content.replace(/\brounded-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-lg');
  content = content.replace(/\brounded-t-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-t-lg');
  content = content.replace(/\brounded-b-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-b-lg');
  content = content.replace(/\brounded-l-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-l-lg');
  content = content.replace(/\brounded-r-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-r-lg');
  content = content.replace(/\brounded-tl-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-tl-lg');
  content = content.replace(/\brounded-tr-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-tr-lg');
  content = content.replace(/\brounded-bl-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-bl-lg');
  content = content.replace(/\brounded-br-(?:xl|2xl|3xl|\[2rem\]|\[2\.5rem\])\b/g, 'rounded-br-lg');

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changedFiles++;
  }
});

console.log(`Updated ${changedFiles} files with rounded-lg.`);

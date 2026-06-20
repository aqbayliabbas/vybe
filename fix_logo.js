const fs = require('fs');
const path = require('path');

function getFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getFiles(filePath));
    } else {
      if (filePath.endsWith('.tsx')) {
        results.push(filePath);
      }
    }
  }
  return results;
}

const files = getFiles(path.join(__dirname, 'src/app/[lang]'));

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  // Fix literal \n
  if (content.includes('\\n          <VybeLogo')) {
    content = content.replace(/\\n          <VybeLogo/g, '\n          <VybeLogo');
    content = content.replace(/ \/>\\n        <\/div>/g, ' />\n        </div>');
    changed = true;
  }

  // Check if it has VybeLogo but missing import
  if (content.includes('<VybeLogo') && !content.includes('import { VybeLogo }')) {
    const lines = content.split('\n');
    let lastImportIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].startsWith('import ')) {
        lastImportIndex = i;
      }
    }
    if (lastImportIndex !== -1) {
      lines.splice(lastImportIndex + 1, 0, "import { VybeLogo } from '@/components/VybeLogo';");
    } else {
      lines.unshift("import { VybeLogo } from '@/components/VybeLogo';");
    }
    content = lines.join('\n');
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Fixed ${file}`);
  }
}

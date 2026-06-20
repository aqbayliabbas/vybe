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

const importVybeLogo = `import { VybeLogo } from '@/components/VybeLogo';\n`;

const regexLogoBlock = /<\s*div\s+className="[^"]*flex\s+items-center[^"]*gap-2\.5[^"]*">\s*<\s*div\s+className="[^"]*flex\s+h-\d+\.?\d*\s+w-\d+\.?\d*[^"]*bg-gradient[^"]*">\s*<\s*Zap\s+className="[^"]*"[^>]*\/>\s*<\s*\/div\s*>\s*<\s*span\s+className="[^"]*font-heading[^"]*">\s*Vybe\s*<\s*\/span\s*>\s*<\s*\/div\s*>/g;

let updated = 0;

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  let changed = false;

  const originalContent = content;

  content = content.replace(regexLogoBlock, (match) => {
    // Add import if missing
    if (!content.includes('import { VybeLogo }')) {
      const lastImportIndex = content.lastIndexOf('import ');
      if (lastImportIndex !== -1) {
        const endOfLastImport = content.indexOf('\\n', lastImportIndex);
        if (endOfLastImport !== -1) {
             content = content.slice(0, endOfLastImport + 1) + importVybeLogo + content.slice(endOfLastImport + 1);
        } else {
             content = importVybeLogo + content;
        }
      } else {
        content = importVybeLogo + content;
      }
    }

    // Determine context based on classnames
    let wrapperClasses = match.match(/className="([^"]+)"/)[1];
    
    if (wrapperClasses.includes('justify-center')) {
      return `<div className="flex items-center justify-center mb-12">\\n          <VybeLogo className="scale-110 origin-center" />\\n        </div>`;
    } else {
      return `<div className="flex items-center">\\n          <VybeLogo className="scale-100 origin-left" />\\n        </div>`;
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(file, content, 'utf8');
    changed = true;
    updated++;
    console.log(`Updated ${file}`);
  }
}

console.log(`Finished updating ${updated} files.`);

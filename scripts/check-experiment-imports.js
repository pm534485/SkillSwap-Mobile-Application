const fs = require('fs');
const path = require('path');

const srcPath = path.join(__dirname, '..', 'mobile', 'src');

if (!fs.existsSync(srcPath)) {
  console.log('No mobile/src folder found yet, skipping check.');
  process.exit(0);
}

const expFolders = fs.readdirSync(srcPath).filter(f => f.startsWith('Exp') && fs.statSync(path.join(srcPath, f)).isDirectory());

const expNumbers = expFolders.map(f => {
  const match = f.match(/Exp(\d+)_/);
  return match ? { folder: f, num: parseInt(match[1], 10) } : null;
}).filter(Boolean);

let hasError = false;

function checkImports(filePath, currentExpNum, currentExpFolder) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Basic import regex matching
    const importMatch = line.match(/import.*from\s+['"](.*)['"]/);
    if (importMatch) {
      const importPath = importMatch[1];
      
      // Extract the target folder name
      expNumbers.forEach(target => {
        if (importPath.includes(target.folder) && target.num > currentExpNum) {
          console.error(`ERROR: ${currentExpFolder} imports from ${target.folder} in ${path.basename(filePath)}:${index + 1}`);
          console.error(`  ${line}`);
          console.error(`  Reason: Earlier experiments cannot import from later experiments.`);
          hasError = true;
        }
      });
    }
  });
}

function traverseAndCheck(dir, currentExpNum, currentExpFolder) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverseAndCheck(fullPath, currentExpNum, currentExpFolder);
    } else if (file.endsWith('.js')) {
      checkImports(fullPath, currentExpNum, currentExpFolder);
    }
  });
}

expNumbers.forEach(exp => {
  traverseAndCheck(path.join(srcPath, exp.folder), exp.num, exp.folder);
});

if (hasError) {
  console.error('\nExperiment import check FAILED.');
  process.exit(1);
} else {
  console.log('Experiment import check PASSED.');
}

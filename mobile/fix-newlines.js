const fs = require('fs');
const path = require('path');

function walk(dir) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== 'node_modules') walk(full);
        } else if (/\.(js|jsx|ts|tsx)$/.test(entry.name) && entry.name !== 'fix-newlines.js') {
            const src = fs.readFileSync(full, 'utf8');
            const out = src.replace(/\\n\s*$/, '\n');
            if (src !== out) {
                fs.writeFileSync(full, out);
                console.log('fixed', full);
            }
        }
    }
}

walk('.');
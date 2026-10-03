const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'gameverse-frontend', 'src', 'services', 'mockData.js');
let content = fs.readFileSync(file, 'utf8');

// Fix literal "\n" strings that were accidentally written
content = content.replace(/\\n/g, '\n');
// Fix any trailing backticks
content = content.replace(/`/g, '');

fs.writeFileSync(file, content);
console.log('Fixed syntax errors');

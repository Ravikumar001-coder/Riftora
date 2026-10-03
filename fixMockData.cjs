const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'gameverse-frontend', 'src', 'services', 'mockData.js');
let content = fs.readFileSync(file, 'utf8');
content = content.replace(/`/g, '');
fs.writeFileSync(file, content);

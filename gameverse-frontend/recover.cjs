const fs = require('fs');

const logPath = 'C:/Users/ravi kumar/.gemini/antigravity-ide/brain/e46e2212-85ec-41cb-bec3-5694e5a60cc5/.system_generated/logs/transcript_full.jsonl';
const logContent = fs.readFileSync(logPath, 'utf8');

const lines = logContent.split('\n');
for (const line of lines) {
  if (!line) continue;
  try {
    const obj = JSON.parse(line);
    if (obj.tool_responses) {
      for (const res of obj.tool_responses) {
        if (res.name === 'default_api:view_file' && res.content) {
          if (res.content.includes('File Path: `file:///c:/Users/ravi%20kumar/Desktop/new/ETMS/gameverse-frontend/src/services/mockData.js`') && res.content.includes('Total Lines: 541')) {
            // Extract the code content
            const match = res.content.match(/The following code has been modified to include a line number before every line, in the format: <line_number>: <original_line>\. Please note that any changes targeting the original code should remove the line number, colon, and leading space\.\n([\s\S]+?)\nThe above content shows the entire, complete file contents of the requested file\./);
            
            if (match) {
              const codeWithLines = match[1];
              const cleanCode = codeWithLines.split('\n').map(l => {
                const parts = l.split(/^[0-9]+: /);
                if (parts.length > 1) {
                  return parts.slice(1).join('');
                }
                return l;
              }).join('\n');
              
              fs.writeFileSync('c:/Users/ravi kumar/Desktop/new/ETMS/gameverse-frontend/src/services/mockData.js', cleanCode);
              console.log('Successfully recovered mockData.js');
              process.exit(0);
            }
          }
        }
      }
    }
  } catch (e) {
    // ignore parse error
  }
}
console.log('Could not find recovery data');

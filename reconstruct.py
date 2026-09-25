import json
import re

def reconstruct(filename, outfile):
    best_content = None
    max_lines = 0
    with open(r'C:\Users\ravi kumar\.gemini\antigravity-ide\brain\e574e9ff-7c07-459a-9f33-54da283d18df\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            if data.get('type') == 'VIEW_FILE' and filename in data.get('content', ''):
                content = data['content']
                # parse the content to get the actual source
                match = re.search(r'Showing lines \d+ to \d+\n.*?:\s+(.*)\n(?:The above content|$)', content, re.DOTALL | re.MULTILINE)
                if match:
                    # Actually we need to strip the line numbers "1: " "2: " etc.
                    lines = content.split('\n')
                    source_lines = []
                    for l in lines:
                        if re.match(r'^\d+: ', l):
                            source_lines.append(l.split(': ', 1)[1])
                    if len(source_lines) > max_lines:
                        max_lines = len(source_lines)
                        best_content = '\n'.join(source_lines)
    
    if best_content:
        with open(outfile, 'w', encoding='utf-8') as f:
            f.write(best_content)
        print(f"Reconstructed {outfile} with {max_lines} lines.")
    else:
        print(f"Could not reconstruct {outfile}")

if __name__ == '__main__':
    reconstruct('TournamentOverviewPage.jsx', r'C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-frontend\src\features\tournaments\pages\TournamentOverviewPage.jsx')
    reconstruct('OverlayControlPage.jsx', r'C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-frontend\src\portals\production\pages\OverlayControlPage.jsx')

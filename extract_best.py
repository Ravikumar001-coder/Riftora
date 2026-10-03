import json
import re
import os

def extract_best():
    brains = [
        '1e9011b6-be6d-4882-a1cd-fccf60c149f0',
        '2ae47354-3e4d-4970-9440-1baa391672fc',
        '87418747-87fa-4103-be36-9df62c13970e',
        'e574e9ff-7c07-459a-9f33-54da283d18df'
    ]
    
    best_content = ""
    max_lines = 0
    filename = "features/tournaments/pages/TournamentOverviewPage.jsx"
    
    for brain in brains:
        path = os.path.join(r'C:\Users\ravi kumar\.gemini\antigravity-ide\brain', brain, '.system_generated', 'logs', 'transcript_full.jsonl')
        if not os.path.exists(path): continue
        with open(path, 'r', encoding='utf-8') as f:
            for line in f:
                data = json.loads(line)
                if data.get('type') == 'VIEW_FILE' and filename in data.get('content', '') or r"features\tournaments\pages\TournamentOverviewPage.jsx" in data.get('content', ''):
                    content = data['content']
                    match = re.search(r'Showing lines \d+ to \d+\n.*?:\s+(.*)\n(?:The above content|$)', content, re.DOTALL | re.MULTILINE)
                    if match:
                        lines = content.split('\n')
                        source_lines = []
                        for l in lines:
                            if re.match(r'^\d+: ', l):
                                source_lines.append(l.split(': ', 1)[1])
                        if len(source_lines) > max_lines:
                            max_lines = len(source_lines)
                            best_content = '\n'.join(source_lines)
                            
    if best_content:
        out = r'C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-frontend\src\features\tournaments\pages\TournamentOverviewPage.jsx'
        with open(out, 'w', encoding='utf-8') as f:
            f.write(best_content)
        print(f"Reconstructed with {max_lines} lines!")
    else:
        print("Could not reconstruct.")

if __name__ == '__main__':
    extract_best()

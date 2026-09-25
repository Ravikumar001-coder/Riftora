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
    
    files_to_find = [
        ("gameverse-backend/src/main/java/com/gameverse/modules/notification/service/AnnouncementService.java", r"C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-backend\src\main\java\com\gameverse\modules\notification\service\AnnouncementService.java"),
        ("gameverse-frontend/src/features/notifications/api/useAnnouncementQueries.js", r"C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-frontend\src\features\notifications\api\useAnnouncementQueries.js"),
        ("gameverse-frontend/src/features/notifications/components/AnnouncementComposer.jsx", r"C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-frontend\src\features\notifications\components\AnnouncementComposer.jsx")
    ]
    
    for search_str, out_path in files_to_find:
        best_content = ""
        max_lines = 0
        for brain in brains:
            path = os.path.join(r'C:\Users\ravi kumar\.gemini\antigravity-ide\brain', brain, '.system_generated', 'logs', 'transcript_full.jsonl')
            if not os.path.exists(path): continue
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    data = json.loads(line)
                    if data.get('type') == 'VIEW_FILE' and (search_str in data.get('content', '') or search_str.replace('/', '\\') in data.get('content', '')):
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
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(best_content)
            print(f"Reconstructed {os.path.basename(out_path)} with {max_lines} lines!")
        else:
            print(f"Could not reconstruct {os.path.basename(out_path)}")

if __name__ == '__main__':
    extract_best()

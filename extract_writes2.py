import json
import os

def extract_writes():
    brains = [
        '1e9011b6-be6d-4882-a1cd-fccf60c149f0',
        '2ae47354-3e4d-4970-9440-1baa391672fc',
        '87418747-87fa-4103-be36-9df62c13970e',
        'e574e9ff-7c07-459a-9f33-54da283d18df'
    ]
    
    files_to_find = [
        ("AnnouncementService.java", r"C:\Users\ravi kumar\Desktop\new\ETMS\gameverse-backend\src\main\java\com\gameverse\modules\notification\service\AnnouncementService.java"),
    ]
    
    for search_str, out_path in files_to_find:
        best_content = None
        for brain in brains:
            path = os.path.join(r'C:\Users\ravi kumar\.gemini\antigravity-ide\brain', brain, '.system_generated', 'logs', 'transcript_full.jsonl')
            if not os.path.exists(path): continue
            with open(path, 'r', encoding='utf-8') as f:
                for line in f:
                    data = json.loads(line)
                    if data.get('type') == 'PLANNER_RESPONSE':
                        if 'tool_calls' in data:
                            for call in data['tool_calls']:
                                if call.get('name') == 'write_to_file':
                                    args = call.get('args', {})
                                    if search_str in args.get('TargetFile', ''):
                                        best_content = args.get('CodeContent', '')
                                
        if best_content:
            with open(out_path, 'w', encoding='utf-8') as f:
                f.write(best_content)
            print(f"Reconstructed {os.path.basename(out_path)} from write_to_file!")
        else:
            print(f"Could not reconstruct {os.path.basename(out_path)}")

if __name__ == '__main__':
    extract_writes()

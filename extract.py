import json

def extract():
    with open(r'C:\Users\ravi kumar\.gemini\antigravity-ide\brain\e574e9ff-7c07-459a-9f33-54da283d18df\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            if 'OverlayControlPage.jsx' in data.get('content', ''):
                print(f"Match at step {data.get('step_index')}, type {data.get('type')}")
                if data.get('type') == 'WRITE_TO_FILE' or data.get('type') == 'REPLACE_FILE_CONTENT' or data.get('type') == 'MULTI_REPLACE_FILE_CONTENT':
                    print("EDIT FOUND")

if __name__ == '__main__':
    extract()

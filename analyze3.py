import json

def analyze():
    with open(r'C:\Users\ravi kumar\.gemini\antigravity-ide\brain\e574e9ff-7c07-459a-9f33-54da283d18df\.system_generated\logs\transcript_full.jsonl', 'r', encoding='utf-8') as f:
        for line in f:
            data = json.loads(line)
            if data.get('type') == 'VIEW_FILE' and 'features/tournaments/pages/TournamentOverviewPage.jsx' in data.get('content', ''):
                print(f"Step {data.get('step_index')}, Total lines: {len(data.get('content', '').split(chr(10)))}")

if __name__ == '__main__':
    analyze()

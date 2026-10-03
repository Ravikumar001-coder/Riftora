import difflib
import re
from typing import Dict, Any, Optional, Tuple

class ResolvedPlayer:
    def __init__(self, slot: int, team_id: str, team_name: str, team_tag: str, player_id: str, player_name: str, confidence: float, match_type: str):
        self.slot = slot
        self.team_id = team_id
        self.team_name = team_name
        self.team_tag = team_tag
        self.player_id = player_id
        self.player_name = player_name
        self.confidence = confidence
        self.match_type = match_type # "EXACT", "ALIAS", "FUZZY_PLAYER", "SLOT_DIRECT"

class MatchSlotResolver:
    """Pre-loaded Match Context dictionary resolver. Never trusts raw OCR identity without slot grounding."""
    
    def __init__(self, match_context: Dict[str, Any]):
        self.match_id = match_context.get("matchId", "")
        self.slots = match_context.get("slots", {})
        
        # Build normalized lookups
        self.ign_to_slot: Dict[str, Tuple[int, str, str, str, str]] = {}
        self.team_tag_to_slot: Dict[str, int] = {}
        
        for slot_key, slot_data in self.slots.items():
            slot_num = int(slot_data.get("slotNumber", slot_key))
            team_id = slot_data.get("teamId", "")
            team_name = slot_data.get("teamName", "")
            team_tag = slot_data.get("teamTag", "").upper()
            
            if team_tag:
                self.team_tag_to_slot[team_tag] = slot_num
                
            players = slot_data.get("players", {})
            for ign, player_id in players.items():
                norm_ign = self.normalize_text(ign)
                self.ign_to_slot[norm_ign] = (slot_num, team_id, team_name, team_tag, player_id, ign)

    @staticmethod
    def normalize_text(text: str) -> str:
        # Strip special symbols, spaces, lowercase
        cleaned = re.sub(r'[^A-Za-z0-9]', '', text).upper()
        return cleaned

    def resolve_identity(self, raw_ocr_text: str, candidate_slot: Optional[int] = None) -> Optional[ResolvedPlayer]:
        norm = self.normalize_text(raw_ocr_text)
        if not norm:
            return None

        # 1. Exact match against known player IGNs
        if norm in self.ign_to_slot:
            slot_num, team_id, team_name, team_tag, player_id, orig_ign = self.ign_to_slot[norm]
            return ResolvedPlayer(slot_num, team_id, team_name, team_tag, player_id, orig_ign, 1.0, "EXACT")

        # 2. Candidate slot constraint if HUD exposed slot badge (e.g., match_103:05)
        if candidate_slot and str(candidate_slot).zfill(2) in self.slots:
            slot_data = self.slots[str(candidate_slot).zfill(2)]
            slot_num = slot_data["slotNumber"]
            team_id = slot_data["teamId"]
            team_name = slot_data["teamName"]
            team_tag = slot_data["teamTag"]
            
            # Find best player in that specific team
            best_ign = ""
            best_score = 0.0
            best_pid = ""
            for ign, pid in slot_data.get("players", {}).items():
                score = difflib.SequenceMatcher(None, norm, self.normalize_text(ign)).ratio()
                if score > best_score:
                    best_score = score
                    best_ign = ign
                    best_pid = pid
            
            if best_score >= 0.60:
                return ResolvedPlayer(slot_num, team_id, team_name, team_tag, best_pid, best_ign, round(best_score * 0.95, 3), "SLOT_DIRECT")

        # 3. Fuzzy search across entire match registration dictionary
        best_match = None
        highest_ratio = 0.0
        for norm_ign, data in self.ign_to_slot.items():
            ratio = difflib.SequenceMatcher(None, norm, norm_ign).ratio()
            if ratio > highest_ratio:
                highest_ratio = ratio
                best_match = data

        if highest_ratio >= 0.70 and best_match:
            slot_num, team_id, team_name, team_tag, player_id, orig_ign = best_match
            return ResolvedPlayer(slot_num, team_id, team_name, team_tag, player_id, orig_ign, round(highest_ratio, 3), "FUZZY_PLAYER")

        return None

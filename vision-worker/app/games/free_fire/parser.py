import re
from typing import Dict, Any, Optional
from app.games.base import BaseGameVisionProfile
from app.context.slot_resolver import MatchSlotResolver

class FreeFireProfile(BaseGameVisionProfile):
    """Free Fire MAX Elimination Parser."""
    
    def game_code(self) -> str:
        return "FREE_FIRE"

    def default_regions(self) -> Dict[str, Any]:
        return {
            "kill_feed": {"x": 0.70, "y": 0.05, "width": 0.28, "height": 0.20},
            "alive_teams": {"x": 0.04, "y": 0.04, "width": 0.16, "height": 0.05}
        }

    PATTERNS = [
        re.compile(r'^(?P<killer>.+?)\s+(?:headshot|eliminated|blasted)\s+(?P<victim>.+)$', re.IGNORECASE),
        re.compile(r'^(?P<killer>.+?)\s+>>\s+(?P<victim>.+)$')
    ]

    def parse_combat_feed(self, ocr_text: str, resolver: MatchSlotResolver) -> Optional[Dict[str, Any]]:
        text = ocr_text.strip()
        if not text:
            return None

        # Check for Booyah (Free Fire winner banner)
        if "BOOYAH" in text.upper():
            return {
                "event_type": "PLACEMENT_UPDATE",
                "placement": 1,
                "pattern_confidence": 0.99,
                "raw_text": text
            }

        for pattern in self.PATTERNS:
            match = pattern.match(text)
            if match:
                raw_killer = match.group("killer").strip()
                raw_victim = match.group("victim").strip()

                k_res = resolver.resolve_identity(raw_killer)
                v_res = resolver.resolve_identity(raw_victim)

                if k_res and v_res:
                    return {
                        "event_type": "PLAYER_KILL",
                        "killer": {
                            "slot": k_res.slot,
                            "playerId": k_res.player_id,
                            "playerName": k_res.player_name,
                            "teamId": k_res.team_id,
                            "teamName": k_res.team_name,
                            "teamTag": k_res.team_tag,
                            "rawText": raw_killer,
                            "confidence": k_res.confidence
                        },
                        "victim": {
                            "slot": v_res.slot,
                            "playerId": v_res.player_id,
                            "playerName": v_res.player_name,
                            "teamId": v_res.team_id,
                            "teamName": v_res.team_name,
                            "teamTag": v_res.team_tag,
                            "rawText": raw_victim,
                            "confidence": v_res.confidence
                        },
                        "pattern_confidence": 0.94,
                        "raw_text": text
                    }

        return None

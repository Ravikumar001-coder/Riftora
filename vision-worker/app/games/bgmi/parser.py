import re
from typing import Dict, Any, Optional
from app.games.base import BaseGameVisionProfile
from app.context.slot_resolver import MatchSlotResolver

class BGMIProfile(BaseGameVisionProfile):
    """BGMI / PUBG Mobile Kill Feed & Event Parser."""
    
    def game_code(self) -> str:
        return "BGMI"

    def default_regions(self) -> Dict[str, Any]:
        return {
            "kill_feed": {"x": 0.68, "y": 0.06, "width": 0.30, "height": 0.24},
            "alive_teams": {"x": 0.85, "y": 0.015, "width": 0.14, "height": 0.045},
            "placement_banner": {"x": 0.25, "y": 0.20, "width": 0.50, "height": 0.30}
        }

    # Common separators in BGMI OCR kill feeds (weapons, killed, eliminated, knocked)
    COMBAT_PATTERNS = [
        re.compile(r'^(?P<killer>.+?)\s+(?:killed|eliminated|finished|knocked\s+out|downed|with\s+\w+)\s+(?P<victim>.+)$', re.IGNORECASE),
        re.compile(r'^(?P<killer>[A-Za-z0-9_x]+)\s+\[\w+\]\s+(?P<victim>[A-Za-z0-9_x]+)$', re.IGNORECASE),
        re.compile(r'^(?P<killer>.+?)\s+-\s+(?P<victim>.+)$')
    ]

    def parse_combat_feed(self, ocr_text: str, resolver: MatchSlotResolver) -> Optional[Dict[str, Any]]:
        text = ocr_text.strip()
        if not text or len(text) < 4:
            return None

        # Check for placement banner or winner
        if "CHICKEN DINNER" in text.upper() or "WINNER" in text.upper() or "#1" in text:
            return {
                "event_type": "PLACEMENT_UPDATE",
                "placement": 1,
                "pattern_confidence": 0.98,
                "raw_text": text
            }

        # Match combat patterns
        for pattern in self.COMBAT_PATTERNS:
            match = pattern.match(text)
            if match:
                raw_killer = match.group("killer").strip()
                raw_victim = match.group("victim").strip()

                killer_resolved = resolver.resolve_identity(raw_killer)
                victim_resolved = resolver.resolve_identity(raw_victim)

                if killer_resolved and victim_resolved:
                    # Sanity check: killer cannot be on same team as victim for standard kill point
                    is_friendly_fire = (killer_resolved.slot == victim_resolved.slot)
                    
                    return {
                        "event_type": "PLAYER_KILL",
                        "killer": {
                            "slot": killer_resolved.slot,
                            "playerId": killer_resolved.player_id,
                            "playerName": killer_resolved.player_name,
                            "teamId": killer_resolved.team_id,
                            "teamName": killer_resolved.team_name,
                            "teamTag": killer_resolved.team_tag,
                            "rawText": raw_killer,
                            "confidence": killer_resolved.confidence
                        },
                        "victim": {
                            "slot": victim_resolved.slot,
                            "playerId": victim_resolved.player_id,
                            "playerName": victim_resolved.player_name,
                            "teamId": victim_resolved.team_id,
                            "teamName": victim_resolved.team_name,
                            "teamTag": victim_resolved.team_tag,
                            "rawText": raw_victim,
                            "confidence": victim_resolved.confidence
                        },
                        "pattern_confidence": 0.95 if not is_friendly_fire else 0.40,
                        "friendly_fire": is_friendly_fire,
                        "raw_text": text
                    }

        return None

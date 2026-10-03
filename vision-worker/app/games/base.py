from abc import ABC, abstractmethod
from typing import Dict, Any, List, Optional
import numpy as np
from app.context.slot_resolver import MatchSlotResolver

class BaseGameVisionProfile(ABC):
    @abstractmethod
    def game_code(self) -> str:
        pass

    @abstractmethod
    def default_regions(self) -> Dict[str, Any]:
        pass

    @abstractmethod
    def parse_combat_feed(self, ocr_text: str, resolver: MatchSlotResolver) -> Optional[Dict[str, Any]]:
        pass

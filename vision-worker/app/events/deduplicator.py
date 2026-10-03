import time
from typing import Dict, Set

class TemporalDeduplicator:
    """Temporal stabilization and idempotent fingerprint deduplication for candidate events."""

    def __init__(self, window_seconds: float = 3.0):
        self.window_seconds = window_seconds
        self.cache: Dict[str, float] = {}

    def is_duplicate(self, fingerprint: str) -> bool:
        now = time.time()
        self._evict_expired(now)

        if fingerprint in self.cache:
            return True
        
        self.cache[fingerprint] = now
        return False

    def _evict_expired(self, current_time: float):
        expired = [fp for fp, ts in self.cache.items() if current_time - ts > self.window_seconds]
        for fp in expired:
            del self.cache[fp]

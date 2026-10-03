from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
import hashlib
import time

class EntitySchema(BaseModel):
    slot: int
    playerId: str
    playerName: str
    teamId: str
    teamName: str
    teamTag: str
    rawText: str
    confidence: float

class EvidenceSchema(BaseModel):
    frameTimestamp: float
    frameNumber: int
    roi: Dict[str, Any]
    rawOcrText: str
    ocrEngine: str
    ocrConfidence: float
    imageThumbnail: Optional[str] = None

class ConfidenceBreakdown(BaseModel):
    ocr: float
    identity: float
    pattern: float
    temporal: float
    overall: float

class OCRCandidateEventSchema(BaseModel):
    schemaVersion: int = 1
    eventId: str
    sessionId: str
    matchId: str
    eventType: str
    game: str
    killer: Optional[EntitySchema] = None
    victim: Optional[EntitySchema] = None
    placement: Optional[int] = None
    evidence: EvidenceSchema
    confidence: ConfidenceBreakdown
    source: str = "ocr"
    status: str = "DETECTED" # DETECTED, AUTO_ACCEPTED, REVIEW_REQUIRED, REJECTED
    fingerprint: str
    createdAt: str

    @staticmethod
    def generate_fingerprint(match_id: str, event_type: str, killer_id: str, victim_id: str, window_slot: int) -> str:
        raw = f"{match_id}:{event_type}:{killer_id}:{victim_id}:{window_slot}"
        return hashlib.sha256(raw.encode('utf-8')).hexdigest()[:24]

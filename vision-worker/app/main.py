from fastapi import FastAPI, HTTPException, Header, Depends
from pydantic import BaseModel
import time
import logging
from typing import Dict, Any, Optional

from app.config.settings import settings
from app.ocr.engine import get_ocr_engine
from app.context.slot_resolver import MatchSlotResolver
from app.games.bgmi.parser import BGMIProfile
from app.games.free_fire.parser import FreeFireProfile
from app.events.deduplicator import TemporalDeduplicator
from app.events.publisher import IngestionPublisher

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("vision_worker")

app = FastAPI(title="Riftora Vision Worker", version="1.0.0")

# Runtime worker state
worker_state = {
    "status": "RUNNING",
    "active_session": None,
    "resolver": None,
    "profile": BGMIProfile(),
    "ocr_engine": get_ocr_engine(settings.ocr_engine, settings.vision_device),
    "deduplicator": TemporalDeduplicator(),
    "publisher": IngestionPublisher(),
    "frames_received": 0,
    "frames_processed": 0,
    "frames_dropped": 0,
    "events_detected": 0,
    "events_accepted": 0,
    "events_reviewed": 0,
    "events_rejected": 0,
    "start_time": time.time(),
}

@app.get("/health")
def health_check():
    return {
        "status": "UP",
        "worker_id": settings.worker_id,
        "engine": settings.ocr_engine,
        "device": settings.vision_device,
        "uptime_seconds": round(time.time() - worker_state["start_time"], 1)
    }

@app.get("/ready")
def readiness_check():
    return {"ready": True, "active_session": worker_state["active_session"] is not None}

@app.get("/metrics")
def get_metrics():
    return {
        "worker_id": settings.worker_id,
        "frames_received": worker_state["frames_received"],
        "frames_processed": worker_state["frames_processed"],
        "frames_dropped": worker_state["frames_dropped"],
        "events_detected": worker_state["events_detected"],
        "events_accepted": worker_state["events_accepted"],
        "events_reviewed": worker_state["events_reviewed"],
        "events_rejected": worker_state["events_rejected"],
    }

class StartSessionRequest(BaseModel):
    sessionId: str
    matchId: str
    game: Dict[str, Any]
    slots: Dict[str, Any]
    regions: Optional[Dict[str, Any]] = None

@app.post("/v1/vision-worker/session")
def configure_session(req: StartSessionRequest, x_worker_secret: Optional[str] = Header(None)):
    if x_worker_secret and x_worker_secret != settings.worker_secret:
        raise HTTPException(status_code=403, detail="Invalid worker secret")
        
    logger.info(f"Initializing vision worker session {req.sessionId} for match {req.matchId} ({req.game.get('code')})")
    
    worker_state["active_session"] = req.sessionId
    worker_state["resolver"] = MatchSlotResolver(req.model_dump())
    
    if req.game.get("code") == "FREE_FIRE":
        worker_state["profile"] = FreeFireProfile()
    else:
        worker_state["profile"] = BGMIProfile()

    return {
        "status": "SESSION_INITIALIZED",
        "sessionId": req.sessionId,
        "matchId": req.matchId,
        "slots_loaded": len(req.slots),
        "game": req.game.get("code")
    }

@app.post("/v1/vision-worker/stop")
def stop_session():
    prev_session = worker_state["active_session"]
    worker_state["active_session"] = None
    worker_state["resolver"] = None
    return {"status": "STOPPED", "previousSession": prev_session}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8090, reload=False)

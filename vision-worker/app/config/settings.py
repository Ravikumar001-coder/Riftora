from pydantic_settings import BaseSettings
from typing import Literal

class VisionWorkerSettings(BaseSettings):
    worker_id: str = "worker_node_blr_01"
    worker_secret: str = "prod_worker_secret_9941a8"
    backend_base_url: str = "http://localhost:8080"
    
    ocr_engine: Literal["paddle", "tesseract", "easyocr"] = "tesseract"
    vision_device: Literal["auto", "cpu", "cuda"] = "auto"
    
    frame_sample_fps: int = 10
    max_frame_queue: int = 3
    
    event_confidence_threshold: float = 0.90
    review_confidence_threshold: float = 0.70
    auto_accept_high_confidence: bool = True
    high_confidence_threshold: float = 0.95
    
    evidence_storage_bucket: str = "riftora-vision-evidence-ap-south-1"
    evidence_local_cache_dir: str = "/tmp/vision_evidence"
    
    temporal_window_frames: int = 3
    temporal_match_threshold_ms: int = 2500
    
    redis_url: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"
        env_prefix = "VISION_"

settings = VisionWorkerSettings()

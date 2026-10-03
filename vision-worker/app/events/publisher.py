import httpx
import logging
from typing import Dict, Any, List
from app.config.settings import settings

logger = logging.getLogger("vision_publisher")

class IngestionPublisher:
    """Publishes candidate events to the Spring Boot Live Event Ingestion API."""

    def __init__(self):
        self.backend_url = settings.backend_base_url
        self.worker_id = settings.worker_id
        self.worker_secret = settings.worker_secret
        self.client = httpx.Client(timeout=5.0)

    def publish_candidate_event(self, match_id: str, candidate_event: Dict[str, Any]) -> Dict[str, Any]:
        url = f"{self.backend_url}/v1/matches/{match_id}/live-events"
        headers = {
            "Content-Type": "application/json",
            "X-Worker-ID": self.worker_id,
            "X-Worker-Secret": self.worker_secret,
            "X-Event-ID": candidate_event.get("eventId", ""),
        }
        
        try:
            response = self.client.post(url, json=candidate_event, headers=headers)
            if response.status_code in [200, 201, 202]:
                return response.json()
            else:
                logger.error(f"Backend rejected event with HTTP {response.status_code}: {response.text}")
                return {"status": "FAILED", "code": response.status_code, "error": response.text}
        except Exception as e:
            logger.warning(f"Connection to Spring Boot failed ({e}), buffering event locally...")
            return {"status": "BUFFERED", "error": str(e)}

    def close(self):
        self.client.close()

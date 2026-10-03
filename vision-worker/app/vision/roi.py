from typing import Tuple, Dict, Any
import numpy as np

class NormalizedROI:
    def __init__(self, id: str, name: str, x: float, y: float, width: float, height: float):
        self.id = id
        self.name = name
        self.x = max(0.0, min(1.0, float(x)))
        self.y = max(0.0, min(1.0, float(y)))
        self.width = max(0.01, min(1.0 - self.x, float(width)))
        self.height = max(0.01, min(1.0 - self.y, float(height)))

    def to_pixel_box(self, frame_width: int, frame_height: int) -> Tuple[int, int, int, int]:
        px = int(self.x * frame_width)
        py = int(self.y * frame_height)
        pw = int(self.width * frame_width)
        ph = int(self.height * frame_height)
        return (px, py, pw, ph)

    def extract_crop(self, frame: np.ndarray) -> np.ndarray:
        h, w = frame.shape[:2]
        px, py, pw, ph = self.to_pixel_box(w, h)
        return frame[py : py + ph, px : px + pw]

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "x": round(self.x, 4),
            "y": round(self.y, 4),
            "width": round(self.width, 4),
            "height": round(self.height, 4),
        }

import cv2
import numpy as np

class VisionPreprocessor:
    """Configurable OpenCV preprocessing pipeline tailored for esports combat text & HUD elements."""
    
    @staticmethod
    def preprocess_kill_feed(crop: np.ndarray, upscale_factor: float = 2.0) -> np.ndarray:
        if crop is None or crop.size == 0:
            return crop

        # 1. Upscale for OCR character clarity
        if upscale_factor > 1.0:
            crop = cv2.resize(
                crop, 
                (0, 0), 
                fx=upscale_factor, 
                fy=upscale_factor, 
                interpolation=cv2.INTER_CUBIC
            )

        # 2. Convert to Grayscale
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)

        # 3. Contrast enhancement via CLAHE (Contrast Limited Adaptive Histogram Equalization)
        clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
        contrast_boost = clahe.apply(gray)

        # 4. Bilateral filtering for edge-preserving denoising
        denoised = cv2.bilateralFilter(contrast_boost, d=7, sigmaColor=75, sigmaSpace=75)

        # 5. Adaptive thresholding for white game text against dynamic 3D backgrounds
        thresh = cv2.adaptiveThreshold(
            denoised, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2
        )

        return thresh

    @staticmethod
    def preprocess_clean_grayscale(crop: np.ndarray) -> np.ndarray:
        if crop is None or crop.size == 0:
            return crop
        gray = cv2.cvtColor(crop, cv2.COLOR_BGR2GRAY)
        return cv2.normalize(gray, None, 0, 255, cv2.NORM_MINMAX)

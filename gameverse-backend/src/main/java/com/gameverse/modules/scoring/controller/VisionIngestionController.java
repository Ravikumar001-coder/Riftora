package com.gameverse.modules.scoring.controller;

import com.gameverse.modules.scoring.dto.VisionEventRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/v1/matches")
public class VisionIngestionController {
    
    private static final Logger logger = LoggerFactory.getLogger(VisionIngestionController.class);
    
    private final com.gameverse.modules.scoring.service.LiveMatchEngine liveMatchEngine;
    
    public VisionIngestionController(com.gameverse.modules.scoring.service.LiveMatchEngine liveMatchEngine) {
        this.liveMatchEngine = liveMatchEngine;
    }

    @PostMapping("/{matchId}/live-events")
    public ResponseEntity<String> ingestCandidateEvent(
            @PathVariable String matchId,
            @RequestBody VisionEventRequest request, 
            @RequestHeader(value = "X-Worker-Secret", required = false) String secret,
            @RequestHeader(value = "X-Worker-ID", required = false) String workerId) {
        
        logger.info("Received candidate event from Python Vision Worker: ID={}, Type={}, Match={}, Confidence={}", 
            request.getEventId(), request.getEventType(), request.getMatchId(), request.getConfidence());
        
        // Push event to fast-path Redis Live Match Engine
        liveMatchEngine.processVisionEvent(request);
        
        // TODO: Enqueue to slow-path Leaderboard Engine later if needed.
        return ResponseEntity.accepted().body("Candidate Event Accepted for Processing");
    }
}

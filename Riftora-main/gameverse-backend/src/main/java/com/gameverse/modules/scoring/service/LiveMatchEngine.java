package com.gameverse.modules.scoring.service;

import com.gameverse.modules.scoring.dto.LiveTeamUpdate;
import com.gameverse.modules.scoring.dto.VisionEventRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class LiveMatchEngine {
    private static final Logger logger = LoggerFactory.getLogger(LiveMatchEngine.class);
    private static final int POINTS_PER_KILL = 1;

    private final StringRedisTemplate redisTemplate;
    private final SimpMessagingTemplate messagingTemplate;

    @Autowired
    public LiveMatchEngine(StringRedisTemplate redisTemplate, SimpMessagingTemplate messagingTemplate) {
        this.redisTemplate = redisTemplate;
        this.messagingTemplate = messagingTemplate;
    }

    public void processVisionEvent(VisionEventRequest request) {
        if (!"PLAYER_KILL".equals(request.getEventType())) {
            return;
        }

        String matchId = request.getMatchId();
        Map<String, Object> killer = request.getKiller();
        if (killer == null || !killer.containsKey("slot")) {
            logger.warn("Killer slot missing from event");
            return;
        }

        int killerSlot;
        try {
            killerSlot = Integer.parseInt(killer.get("slot").toString());
        } catch (NumberFormatException e) {
            logger.error("Invalid slot format", e);
            return;
        }

        String redisKey = "match:" + matchId + ":kills";
        String hashKey = String.valueOf(killerSlot);
        
        // Atomically increment kills in Redis
        Long totalKills = redisTemplate.opsForHash().increment(redisKey, hashKey, 1);
        
        // Assuming simple 1 point per kill for the live tally
        int livePoints = totalKills.intValue() * POINTS_PER_KILL;

        logger.info("Fast Path: Team in slot {} now has {} kills ({} points) for match {}", 
            killerSlot, totalKills, livePoints, matchId);

        // Emit fast delta to broadcast overlay
        LiveTeamUpdate update = new LiveTeamUpdate(matchId, killerSlot, totalKills.intValue(), livePoints);
        messagingTemplate.convertAndSend("/topic/matches." + matchId + ".live-stats", update);
    }
}

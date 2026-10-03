package com.gameverse.modules.broadcast.service;

import com.gameverse.modules.broadcast.entity.StreamConfig;
import com.gameverse.modules.broadcast.entity.StreamMetric;
import com.gameverse.modules.broadcast.repository.StreamConfigRepository;
import com.gameverse.modules.broadcast.repository.StreamMetricRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

@Service
@RequiredArgsConstructor
@Slf4j
public class StreamMetricsPollerService {

    private final StreamConfigRepository streamConfigRepository;
    private final StreamMetricRepository streamMetricRepository;
    private final SimpMessagingTemplate messagingTemplate;
    
    // Simulate API calls for now.
    private final Random random = new Random();

    /**
     * FR-12-010: The system shall track platform-side viewership — pulling viewer count data 
     * from YouTube/Twitch APIs every 60 seconds and storing it as time-series data for analytics.
     */
    @Scheduled(fixedRate = 60000)
    @Transactional
    public void pollStreamMetrics() {
        List<StreamConfig> liveStreams = streamConfigRepository.findByIsLiveTrue();
        if (liveStreams.isEmpty()) {
            return;
        }

        log.debug("Polling stream metrics for {} live streams...", liveStreams.size());

        for (StreamConfig config : liveStreams) {
            try {
                // Mock fetching from YouTube/Twitch API
                int mockViewerCount = fetchPlatformViewerCountMock(config);

                // Create metric entry
                StreamMetric metric = new StreamMetric();
                metric.setTournament(config.getTournament());
                metric.setRecordedAt(LocalDateTime.now());
                metric.setViewerCount(mockViewerCount);
                
                // Add mocked health metrics (FR-12-012)
                metric.setBitrateKbps(6000 + random.nextInt(1000) - 500); // ~6000 kbps
                metric.setFps(60);
                metric.setDroppedFramesPct(java.math.BigDecimal.valueOf(random.nextDouble() * 0.5)); // 0-0.5%
                metric.setCpuUsagePct(java.math.BigDecimal.valueOf(10 + random.nextDouble() * 20)); // 10-30%

                streamMetricRepository.save(metric);

                // Publish real-time viewer count to tournament specific topic
                String topicViewers = String.format("/topic/tournament.%s.viewers", config.getTournament().getTournamentId());
                messagingTemplate.convertAndSend(topicViewers, new ViewerCountPayload(mockViewerCount));

                // Publish stream health metrics
                String topicHealth = String.format("/topic/tournament.%s.stream-health", config.getTournament().getTournamentId());
                messagingTemplate.convertAndSend(topicHealth, new StreamHealthPayload(
                        metric.getBitrateKbps(),
                        metric.getFps(),
                        metric.getDroppedFramesPct(),
                        metric.getCpuUsagePct(),
                        "Excellent"
                ));

            } catch (Exception e) {
                log.error("Failed to poll metrics for stream config {}: {}", config.getConfigId(), e.getMessage());
            }
        }
    }

    private int fetchPlatformViewerCountMock(StreamConfig config) {
        // Base viewer count logic based on platform to make it feel slightly realistic
        int base = 5000;
        if (config.getPlatform() == StreamConfig.StreamPlatform.youtube) base = 12000;
        if (config.getPlatform() == StreamConfig.StreamPlatform.twitch) base = 8000;

        // Add some random jitter
        return base + random.nextInt(2000) - 1000;
    }

    public record ViewerCountPayload(int viewers) {}
    public record StreamHealthPayload(
            int bitrateKbps, 
            int fps, 
            java.math.BigDecimal droppedFramesPct, 
            java.math.BigDecimal cpuUsagePct,
            String ingestionStatus
    ) {}
}

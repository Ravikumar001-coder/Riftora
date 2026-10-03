package com.gameverse.modules.broadcast.service;

import com.gameverse.modules.broadcast.dto.OverlayConfigDto;
import com.gameverse.modules.broadcast.entity.OverlayConfig;
import com.gameverse.modules.broadcast.entity.StreamConfig;
import com.gameverse.modules.broadcast.repository.OverlayConfigRepository;
import com.gameverse.modules.broadcast.repository.StreamConfigRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import com.gameverse.core.websocket.WebSocketEventPublisher;

@Service
@RequiredArgsConstructor
public class OverlayConfigService {

    private final OverlayConfigRepository overlayConfigRepository;
    private final StreamConfigRepository streamConfigRepository;
    private final TournamentRepository tournamentRepository;
    private final WebSocketEventPublisher webSocketEventPublisher;

    @Value("${app.frontend.url:https://gameverse.gg}")
    private String frontendUrl;

    @Transactional
    public List<OverlayConfigDto> initializeOverlays(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        
        StreamConfig config = streamConfigRepository.findByTournament_TournamentId(tournamentId).stream().findFirst().orElseGet(() -> {
            StreamConfig newConfig = new StreamConfig();
            newConfig.setTournament(tournament);
            newConfig.setConfiguredBy(tournament.getCreatedBy()); // or system user
            newConfig.setPlatform(StreamConfig.StreamPlatform.custom);
            return streamConfigRepository.save(newConfig);
        });

        List<OverlayConfig> existing = overlayConfigRepository.findByTournament_TournamentId(tournamentId);

        for (OverlayConfig.OverlayType type : OverlayConfig.OverlayType.values()) {
            boolean exists = existing.stream().anyMatch(e -> e.getOverlayType() == type);
            if (!exists) {
                OverlayConfig newConfig = new OverlayConfig();
                newConfig.setTournament(tournament);
                newConfig.setStreamConfig(config);
                newConfig.setOverlayType(type);
                
                String token = generateToken();
                newConfig.setToken(token);
                newConfig.setOverlayUrl(buildOverlayUrl(tournamentId, type.name(), token));
                
                overlayConfigRepository.save(newConfig);
                existing.add(newConfig);
            }
        }

        return existing.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<OverlayConfigDto> getOverlaysByTournament(String tournamentId) {
        return overlayConfigRepository.findByTournament_TournamentId(tournamentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public OverlayConfigDto regenerateToken(String overlayId) {
        OverlayConfig config = overlayConfigRepository.findById(overlayId)
                .orElseThrow(() -> new IllegalArgumentException("Overlay config not found"));

        String token = generateToken();
        config.setToken(token);
        config.setOverlayUrl(buildOverlayUrl(config.getTournament().getTournamentId(), config.getOverlayType().name(), token));

        OverlayConfig saved = overlayConfigRepository.save(config);
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public OverlayConfigDto getOverlayByToken(String tournamentId, String overlayTypeStr, String token) {
        OverlayConfig.OverlayType type = OverlayConfig.OverlayType.valueOf(overlayTypeStr.toUpperCase());
        
        OverlayConfig overlay = overlayConfigRepository.findByTournament_TournamentId(tournamentId).stream()
                .filter(o -> o.getOverlayType() == type && o.getToken().equals(token))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Invalid overlay or token"));

        if (overlay.getTournament().getEndDate() != null) {
            java.time.LocalDate expiryDate = overlay.getTournament().getEndDate().plusDays(30);
            if (java.time.LocalDate.now().isAfter(expiryDate)) {
                throw new IllegalArgumentException("OVERLAY_EXPIRED");
            }
        }

        return mapToDto(overlay);
    }

    @Transactional
    public OverlayConfigDto updateOverlayConfig(String overlayId, com.gameverse.modules.broadcast.dto.UpdateOverlayConfigRequest request) {
        OverlayConfig config = overlayConfigRepository.findById(overlayId)
                .orElseThrow(() -> new IllegalArgumentException("Overlay config not found"));

        if (request.getIsVisible() != null) config.setIsVisible(request.getIsVisible());
        if (request.getPositionCfg() != null) config.setPositionCfg(request.getPositionCfg());
        if (request.getStyleCfg() != null) config.setStyleCfg(request.getStyleCfg());

        OverlayConfig saved = overlayConfigRepository.save(config);
        
        webSocketEventPublisher.broadcastOverlayUpdate(saved.getTournament().getTournamentId(), "OVERLAY_UPDATED:" + saved.getOverlayType().name());
        return mapToDto(saved);
    }

    private String generateToken() {
        return UUID.randomUUID().toString().replace("-", ""); // 32 character token
    }

    private String buildOverlayUrl(String tournamentId, String overlayType, String token) {
        return frontendUrl + "/overlay/" + tournamentId + "/" + overlayType + "/" + token;
    }

    private OverlayConfigDto mapToDto(OverlayConfig e) {
        return OverlayConfigDto.builder()
                .overlayId(e.getOverlayId())
                .tournamentId(e.getTournament().getTournamentId())
                .configId(e.getStreamConfig().getConfigId())
                .overlayType(e.getOverlayType())
                .overlayUrl(e.getOverlayUrl())
                .token(e.getToken())
                .isVisible(e.getIsVisible())
                .positionCfg(e.getPositionCfg())
                .styleCfg(e.getStyleCfg())
                .isActive(e.getIsActive())
                .createdAt(e.getCreatedAt())
                .updatedAt(e.getUpdatedAt())
                .build();
    }
}

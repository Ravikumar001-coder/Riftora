package com.gameverse.modules.broadcast.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.broadcast.dto.CreateStreamConfigRequest;
import com.gameverse.modules.broadcast.dto.StreamConfigDto;
import com.gameverse.modules.broadcast.entity.StreamConfig;
import com.gameverse.modules.broadcast.repository.StreamConfigRepository;
import com.gameverse.modules.credential.service.EncryptionService;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreamConfigService {

    private final StreamConfigRepository streamConfigRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;
    private final EncryptionService encryptionService;

    @Transactional
    public StreamConfigDto createStreamConfig(String userId, CreateStreamConfigRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        if (request.getIsPrimary() != null && request.getIsPrimary()) {
            // Check if primary already exists
            streamConfigRepository.findByTournament_TournamentIdAndIsPrimaryTrue(request.getTournamentId())
                    .ifPresent(c -> {
                        throw new RuntimeException("Primary stream config already exists for this tournament");
                    });
        }

        StreamConfig config = new StreamConfig();
        config.setTournament(tournament);
        config.setConfiguredBy(user);
        config.setPlatform(request.getPlatform());
        config.setChannelId(request.getChannelId());
        config.setStreamUrl(request.getStreamUrl());
        config.setRtmpUrl(request.getRtmpUrl());
        config.setObsWsUrl(request.getObsWsUrl());
        
        if (request.getIsPrimary() != null) {
            config.setIsPrimary(request.getIsPrimary());
        }
        if (request.getLanguage() != null) {
            config.setLanguage(request.getLanguage());
        }
        
        if (request.getStreamKey() != null && !request.getStreamKey().isBlank()) {
            config.setStreamKeyEnc(encryptionService.encrypt(request.getStreamKey()));
        }
        if (request.getObsWsPass() != null && !request.getObsWsPass().isBlank()) {
            config.setObsWsPassEnc(encryptionService.encrypt(request.getObsWsPass()));
        }

        config = streamConfigRepository.save(config);
        return mapToDto(config);
    }
    
    @Transactional(readOnly = true)
    public List<StreamConfigDto> getTournamentStreams(String tournamentId) {
        List<StreamConfig> configs = streamConfigRepository.findByTournament_TournamentId(tournamentId);
        return configs.stream().map(this::mapToDto).collect(Collectors.toList());
    }

    private StreamConfigDto mapToDto(StreamConfig c) {
        return StreamConfigDto.builder()
                .configId(c.getConfigId())
                .tournamentId(c.getTournament().getTournamentId())
                .configuredByUserId(c.getConfiguredBy().getUserId())
                .platform(c.getPlatform())
                .channelId(c.getChannelId())
                .streamUrl(c.getStreamUrl())
                .rtmpUrl(c.getRtmpUrl())
                .obsWsUrl(c.getObsWsUrl())
                .obsConnected(c.getObsConnected())
                .isLive(c.getIsLive())
                .streamStartedAt(c.getStreamStartedAt())
                .isPrimary(c.getIsPrimary())
                .language(c.getLanguage())
                .hasStreamKey(c.getStreamKeyEnc() != null && c.getStreamKeyEnc().length > 0)
                .maskedStreamKey(c.getStreamKeyEnc() != null && c.getStreamKeyEnc().length > 0 ? "XXXX" : null)
                .build();
    }
}

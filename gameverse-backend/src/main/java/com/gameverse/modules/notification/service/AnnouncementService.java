package com.gameverse.modules.notification.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.notification.dto.AnnouncementDto;
import com.gameverse.modules.notification.dto.CreateAnnouncementRequest;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.entity.TournamentMessage;
import com.gameverse.modules.tournament.repository.TournamentMessageRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.core.websocket.WebSocketEventPublisher;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AnnouncementService {

    private final TournamentMessageRepository messageRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;
    private final WebSocketEventPublisher eventPublisher;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Transactional
    public AnnouncementDto createAnnouncement(String tournamentId, String userId, CreateAnnouncementRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        User user = userRepository.findById(userId).orElseThrow();

        TournamentMessage message = new TournamentMessage();
        message.setTournament(tournament);
        message.setCreatedBy(user);
        message.setMessageType(TournamentMessage.MessageType.announcement);
        message.setTitle(request.getTitle());
        message.setBody(request.getBody());
        
        message.setRecipientScope(request.getRecipientScope());
        message.setScopeTargetId(request.getScopeTargetId());
        
        try {
            if (request.getScopeTeams() != null) {
                message.setScopeTeamsJson(objectMapper.writeValueAsString(request.getScopeTeams()));
            }
            if (request.getChannels() != null) {
                message.setChannelsJson(objectMapper.writeValueAsString(request.getChannels()));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse JSON arrays", e);
        }
        
        message.setIsScheduled(request.getIsScheduled());
        message.setScheduledAt(request.getScheduledAt());
        
        if (Boolean.TRUE.equals(request.getIsScheduled())) {
            message.setStatus(TournamentMessage.MessageStatus.scheduled);
        } else {
            message.setStatus(TournamentMessage.MessageStatus.sending);
            message.setSentAt(LocalDateTime.now());
            // Mock delivery process
            message.setStatus(TournamentMessage.MessageStatus.sent);
            message.setRecipientCount(1);
            message.setDeliveredCount(1);
        }
        
        message = messageRepository.save(message);
        
        AnnouncementDto dto = mapToDto(message);
        
        // Push announcement to all online users subscribed to tournament topic
        if (TournamentMessage.MessageStatus.sent.equals(message.getStatus())) {
            eventPublisher.sendToTournament(tournamentId, "announcement", dto);
        }
        
        return dto;
    }

    @Transactional(readOnly = true)
    public List<AnnouncementDto> getAnnouncements(String tournamentId) {
        return messageRepository.findByTournament_TournamentIdOrderByCreatedAtDesc(tournamentId)
                .stream()
                .filter(m -> m.getMessageType() == TournamentMessage.MessageType.announcement)
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private AnnouncementDto mapToDto(TournamentMessage entity) {
        AnnouncementDto.AnnouncementDtoBuilder builder = AnnouncementDto.builder()
                .msgId(entity.getMsgId())
                .tournamentId(entity.getTournament().getTournamentId())
                .createdBy(entity.getCreatedBy().getUserId())
                .title(entity.getTitle())
                .body(entity.getBody())
                .recipientScope(entity.getRecipientScope())
                .scopeTargetId(entity.getScopeTargetId())
                .isScheduled(entity.getIsScheduled())
                .scheduledAt(entity.getScheduledAt())
                .status(entity.getStatus())
                .recipientCount(entity.getRecipientCount())
                .deliveredCount(entity.getDeliveredCount())
                .failedCount(entity.getFailedCount())
                .sentAt(entity.getSentAt())
                .createdAt(entity.getCreatedAt());
                
        try {
            if (entity.getScopeTeamsJson() != null) {
                builder.scopeTeams(objectMapper.readValue(entity.getScopeTeamsJson(), List.class));
            }
            if (entity.getChannelsJson() != null) {
                builder.channels(objectMapper.readValue(entity.getChannelsJson(), List.class));
            }
        } catch (Exception e) {
            // Log and ignore
        }
        
        return builder.build();
    }
}

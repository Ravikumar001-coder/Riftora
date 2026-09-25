package com.gameverse.modules.notification.dto;

import com.gameverse.modules.tournament.entity.TournamentMessage;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class AnnouncementDto {
    private String msgId;
    private String tournamentId;
    private String createdBy;
    private String title;
    private String body;
    
    private TournamentMessage.RecipientScope recipientScope;
    private String scopeTargetId;
    private List<String> scopeTeams;
    private List<String> channels;
    
    private Boolean isScheduled;
    private LocalDateTime scheduledAt;
    private TournamentMessage.MessageStatus status;
    
    private Integer recipientCount;
    private Integer deliveredCount;
    private Integer failedCount;
    
    private LocalDateTime sentAt;
    private LocalDateTime createdAt;
}

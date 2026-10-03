package com.gameverse.modules.notification.dto;

import com.gameverse.modules.tournament.entity.TournamentMessage;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class CreateAnnouncementRequest {

    @NotBlank
    @Size(max = 100)
    private String title;

    @NotBlank
    @Size(max = 1000)
    private String body;

    @NotNull
    private TournamentMessage.RecipientScope recipientScope;

    private String scopeTargetId;

    private List<String> scopeTeams;

    private List<String> channels;

    private Boolean isScheduled;

    private LocalDateTime scheduledAt;
}

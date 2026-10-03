package com.gameverse.modules.dispute.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class DisputeDto {
    private String disputeId;
    private String referenceNumber;
    private String matchId;
    private String tournamentId;
    private String teamId;
    private String teamName;
    private String submittedByUserId;
    private String category;
    private String description;
    private String requestedResolution;
    private Object evidenceUrls;
    private String status;
    private String priorityLevel;
    private String resolutionNote;
    private Boolean isEscalated;
    private LocalDateTime escalatedAt;
    private Boolean isAppealed;
    private Boolean superAdminOverride;
    private String superAdminNotes;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}

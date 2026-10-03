package com.gameverse.modules.match.dto;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TechnicalPauseDto {
    private String pauseId;
    private String matchId;
    private String declaredByUserId;
    private String declaredByUserName;
    private String reason;
    private String reasonNotes;
    private LocalDateTime pausedAt;
    private LocalDateTime estResumeAt;
    private LocalDateTime resumedAt;
    private String resolution;
    private String resolvedByUserId;
}

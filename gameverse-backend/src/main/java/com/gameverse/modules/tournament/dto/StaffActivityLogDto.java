package com.gameverse.modules.tournament.dto;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StaffActivityLogDto {
    private String logId;
    private String entityType;
    private String actionCode;
    private String actionDetails;
    private String matchId;
    private LocalDateTime createdAt;
}

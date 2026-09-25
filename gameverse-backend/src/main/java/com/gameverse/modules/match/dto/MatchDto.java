package com.gameverse.modules.match.dto;

import com.gameverse.modules.match.entity.Match;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class MatchDto {
    private String matchId;
    private String tournamentId;
    private String assignedRefereeId;
    private Integer matchNumber;
    private Integer roundNumber;
    private String matchLabel;
    private LocalDateTime scheduledStart;
    private LocalDateTime actualStart;
    private LocalDateTime actualEnd;
    private Match.MatchStatus status;
    private java.util.List<MatchSlotDto> slots;
    private String vodUrl;
    private Integer vodTimestampSeconds;
}

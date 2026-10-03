package com.gameverse.modules.result.dto;

import com.gameverse.modules.result.entity.MatchResult;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class MatchResultDto {
    private String resultId;
    private String matchId;
    private String submittedByUserId;
    private MatchResult.ResultStatus status;
    private String verifiedByUserId;
    private LocalDateTime verifiedAt;
}

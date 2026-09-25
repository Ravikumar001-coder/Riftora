package com.gameverse.modules.tournament.dto;

import com.gameverse.modules.tournament.entity.Tournament.TournamentStatus;
import lombok.Data;

@Data
public class ChangeTournamentStatusRequest {
    private TournamentStatus status;
    private String cancellationReason;
}

package com.gameverse.modules.match.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class BatchScheduleMatchesRequest {
    @NotEmpty(message = "Matches list cannot be empty")
    @Valid
    private List<UpdateMatchScheduleRequest> matches;
}

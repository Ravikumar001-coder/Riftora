package com.gameverse.modules.match.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class UpdateMatchStatusRequest {
    @NotNull(message = "Status cannot be null")
    private String status;
}

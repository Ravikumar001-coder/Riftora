package com.gameverse.modules.registration.dto;

import com.gameverse.modules.registration.entity.Registration;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RegistrationStatusUpdateRequest {
    @NotNull(message = "Status is required")
    private Registration.RegistrationStatus status;
    private String notes; // Used for rejectionReason or correctionNotes depending on status
}

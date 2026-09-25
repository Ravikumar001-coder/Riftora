package com.gameverse.modules.organization.dto;

import jakarta.validation.constraints.Size;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

@Data
public class OrganizationBrandKitDto {

    @Size(max = 500)
    private String logoUrl;

    @Size(max = 500)
    private String secondaryLogoUrl;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Invalid hex color format")
    private String primaryColor;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Invalid hex color format")
    private String secondaryColor;

    @Pattern(regexp = "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$", message = "Invalid hex color format")
    private String accentColor;

    @Size(max = 100)
    private String primaryFont;

    @Size(max = 100)
    private String secondaryFont;

    @Size(max = 60)
    private String brandTagline;
}

package com.gameverse.modules.organization.dto.dashboard;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardActionRequiredDto {
    private String id;
    private String type;
    private String priority; // 'critical', 'high', 'medium', 'info'
    private String message;
    private String context;
    private String actionLabel;
    private String link;
}

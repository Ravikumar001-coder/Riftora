package com.gameverse.modules.analytics.dto;

import lombok.Data;
import java.util.Map;

@Data
public class PlatformHealthDto {
    private int activeOrganizations;
    private Map<String, Integer> tournamentsByState;
    private int totalRegisteredUsers;
    private double userGrowthRate;
    private double totalGmv;
    private double platformFeeRevenue;
    private int activeWebSockets;
    private double systemUptimePercentage;
    private Map<String, Integer> averageApiResponseTimes; // in ms
}

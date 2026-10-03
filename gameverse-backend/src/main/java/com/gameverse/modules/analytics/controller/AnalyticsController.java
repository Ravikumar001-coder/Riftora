package com.gameverse.modules.analytics.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.analytics.dto.OrgAnalyticsDashboardDto;
import com.gameverse.modules.analytics.dto.TimeSeriesChartsDto;
import com.gameverse.modules.analytics.dto.TournamentPerformanceDto;
import com.gameverse.modules.analytics.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/org/{orgId}/dashboard")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<OrgAnalyticsDashboardDto>> getOrgDashboardMetrics(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getOrgDashboardMetrics(orgId)));
    }

    @GetMapping("/org/{orgId}/charts")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<TimeSeriesChartsDto>> getOrgTimeSeriesCharts(
            @PathVariable String orgId,
            @RequestParam(defaultValue = "all_time") String dateRange) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getOrgTimeSeriesCharts(orgId, dateRange)));
    }

    @GetMapping("/org/{orgId}/tournaments/performance")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<List<TournamentPerformanceDto>>> getTournamentPerformanceTable(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTournamentPerformanceTable(orgId)));
    }

    @GetMapping("/org/{orgId}/game-mix")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.GameMixDto>> getGameMixAnalysis(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getGameMixAnalysis(orgId)));
    }

    @GetMapping("/org/{orgId}/retention")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.PlayerRetentionDto>> getPlayerRetentionAnalysis(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getPlayerRetentionAnalysis(orgId)));
    }

    @GetMapping("/org/{orgId}/optimization/entry-fee")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.analytics.dto.EntryFeeOptimizationDto>>> getEntryFeeOptimizationData(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getEntryFeeOptimizationData(orgId)));
    }

    @GetMapping("/tournaments/{tournamentId}/report")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIRECTOR')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.PostTournamentReportDto>> getPostTournamentReport(
            @PathVariable String tournamentId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getPostTournamentReport(tournamentId)));
    }

    @GetMapping("/players/{userId}/career")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.PlayerCareerDashboardDto>> getPlayerCareerDashboard(
            @PathVariable String userId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getPlayerCareerDashboard(userId)));
    }

    @GetMapping("/teams/{teamId}/analytics")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.TeamAnalyticsDashboardDto>> getTeamAnalyticsDashboard(
            @PathVariable String teamId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTeamAnalyticsDashboard(teamId)));
    }

    @GetMapping("/players/compare")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.HeadToHeadComparisonDto>> getHeadToHeadComparison(
            @RequestParam String player1Id,
            @RequestParam String player2Id) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getHeadToHeadComparison(player1Id, player2Id)));
    }

    @GetMapping("/tournaments/{tournamentId}/stream-analytics")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'BROADCASTER')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.TournamentStreamAnalyticsDto>> getTournamentStreamAnalytics(
            @PathVariable String tournamentId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getTournamentStreamAnalytics(tournamentId)));
    }

    @GetMapping("/organizations/{orgId}/stream-performance")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.OrganizationStreamPerformanceDto>> getOrganizationStreamPerformance(
            @PathVariable String orgId) {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getOrganizationStreamPerformance(orgId)));
    }

    @GetMapping("/platform/health")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.PlatformHealthDto>> getPlatformHealth() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getPlatformHealth()));
    }

    @GetMapping("/platform/funnel")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.UserAcquisitionFunnelDto>> getUserAcquisitionFunnel() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getUserAcquisitionFunnel()));
    }

    @GetMapping("/platform/revenue")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<ApiResponse<com.gameverse.modules.analytics.dto.PlatformRevenueDashboardDto>> getPlatformRevenue() {
        return ResponseEntity.ok(ApiResponse.success(analyticsService.getPlatformRevenue()));
    }
}

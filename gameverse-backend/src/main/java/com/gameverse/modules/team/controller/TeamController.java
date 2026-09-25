package com.gameverse.modules.team.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.team.dto.CreateTeamRequest;
import com.gameverse.modules.team.dto.TeamDto;
import com.gameverse.modules.team.dto.InvitePlayerRequest;
import com.gameverse.modules.team.dto.TeamInvitationDto;
import com.gameverse.modules.team.service.TeamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/v1/teams")
@RequiredArgsConstructor
public class TeamController {

    private final TeamService teamService;
    private final com.gameverse.modules.team.service.TeamRankingService teamRankingService;

    @PostMapping
    public ResponseEntity<ApiResponse<TeamDto>> createTeam(
            @Valid @RequestBody CreateTeamRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        TeamDto response = teamService.createTeam(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<TeamDto>>> getUserTeams(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int limit,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        Page<TeamDto> teamPage = teamService.getUserTeams(userId, PageRequest.of(page, limit));
        
        return ResponseEntity.ok(ApiResponse.success(
                teamPage.getContent(),
                Map.of(
                        "pagination", Map.of(
                                "page", teamPage.getNumber(),
                                "limit", teamPage.getSize(),
                                "total", teamPage.getTotalElements(),
                                "total_pages", teamPage.getTotalPages()
                        )
                )
        ));
    }

    @GetMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeam(@PathVariable String teamId) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeam(teamId)));
    }

    @PostMapping("/{teamId}/invites")
    public ResponseEntity<ApiResponse<TeamInvitationDto>> invitePlayer(
            @PathVariable String teamId,
            @Valid @RequestBody InvitePlayerRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.invitePlayer(teamId, userId, request)));
    }

    @GetMapping("/invites/me")
    public ResponseEntity<ApiResponse<List<TeamInvitationDto>>> getMyInvitations(
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.getUserInvitations(userId)));
    }

    @PostMapping("/invites/{inviteId}/accept")
    public ResponseEntity<ApiResponse<TeamDto>> acceptInvitation(
            @PathVariable String inviteId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.acceptInvitation(userId, inviteId)));
    }

    @DeleteMapping("/{teamId}/members/{memberId}")
    public ResponseEntity<ApiResponse<Void>> removePlayer(
            @PathVariable String teamId,
            @PathVariable String memberId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        teamService.removePlayer(teamId, userId, memberId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/invites/{inviteId}/decline")
    public ResponseEntity<ApiResponse<Void>> declineInvitation(
            @PathVariable String inviteId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        teamService.declineInvitation(userId, inviteId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PostMapping("/{teamId}/leave")
    public ResponseEntity<ApiResponse<Void>> leaveTeam(
            @PathVariable String teamId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        teamService.leaveTeam(teamId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @GetMapping("/slug/{teamSlug}")
    public ResponseEntity<ApiResponse<TeamDto>> getTeamBySlug(@PathVariable String teamSlug) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamBySlug(teamSlug)));
    }

    @PutMapping("/{teamId}")
    public ResponseEntity<ApiResponse<TeamDto>> updateTeam(
            @PathVariable String teamId,
            @Valid @RequestBody com.gameverse.modules.team.dto.UpdateTeamRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.updateTeam(teamId, userId, request)));
    }

    @DeleteMapping("/{teamId}")
    public ResponseEntity<ApiResponse<Void>> disbandTeam(
            @PathVariable String teamId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        teamService.disbandTeam(teamId, userId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }

    @PutMapping("/{teamId}/captaincy/{memberId}")
    public ResponseEntity<ApiResponse<TeamDto>> transferCaptaincy(
            @PathVariable String teamId,
            @PathVariable String memberId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.transferCaptaincy(teamId, userId, memberId)));
    }

    @PutMapping("/{teamId}/members/{memberId}/role")
    public ResponseEntity<ApiResponse<TeamDto>> updateMemberRole(
            @PathVariable String teamId,
            @PathVariable String memberId,
            @Valid @RequestBody com.gameverse.modules.team.dto.UpdateRoleRequest request,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.updateMemberRole(teamId, userId, memberId, request)));
    }

    @PostMapping("/{teamId}/invite-code/regenerate")
    public ResponseEntity<ApiResponse<Map<String, String>>> regenerateInviteCode(
            @PathVariable String teamId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        String newCode = teamService.regenerateInviteCode(teamId, userId);
        return ResponseEntity.ok(ApiResponse.success(Map.of("inviteCode", newCode)));
    }

    @PostMapping("/join-code/{inviteCode}")
    public ResponseEntity<ApiResponse<TeamDto>> joinByInviteCode(
            @PathVariable String inviteCode,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.joinByInviteCode(inviteCode, userId)));
    }

    @GetMapping("/{teamId}/tournaments")
    public ResponseEntity<ApiResponse<List<Object>>> getTeamTournaments(@PathVariable String teamId) {
        return ResponseEntity.ok(ApiResponse.success(teamService.getTeamTournaments(teamId)));
    }

    @GetMapping("/{teamId}/roster-history")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.team.dto.TeamMemberDto>>> getRosterHistory(
            @PathVariable String teamId,
            Authentication authentication) {
        String userId = (String) authentication.getPrincipal();
        return ResponseEntity.ok(ApiResponse.success(teamService.getRosterHistory(teamId, userId)));
    }

    @GetMapping("/rankings")
    public ResponseEntity<ApiResponse<List<com.gameverse.modules.team.dto.TeamRankingDto>>> getRankings(
            @RequestParam String gameId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int limit) {
        Page<com.gameverse.modules.team.dto.TeamRankingDto> rankingPage = teamRankingService.getTopTeamsByGame(gameId, PageRequest.of(page, limit));
        return ResponseEntity.ok(ApiResponse.success(
                rankingPage.getContent(),
                Map.of(
                        "pagination", Map.of(
                                "page", rankingPage.getNumber(),
                                "limit", rankingPage.getSize(),
                                "total", rankingPage.getTotalElements(),
                                "total_pages", rankingPage.getTotalPages()
                        )
                )
        ));
    }

    @GetMapping("/{teamId}/statistics")
    public ResponseEntity<ApiResponse<com.gameverse.modules.team.dto.TeamStatisticDto>> getTeamStatistics(
            @PathVariable String teamId,
            @RequestParam(defaultValue = "all") String range) {
        // FR-04-024: For now we return the aggregated statistics from the team service.
        // Once Match Results exist, dynamic querying by date range will be implemented here.
        com.gameverse.modules.team.dto.TeamDto team = teamService.getTeam(teamId);
        return ResponseEntity.ok(ApiResponse.success(team.getStatistics()));
    }
}

package com.gameverse.modules.team.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.team.dto.CreateTeamRequest;
import com.gameverse.modules.team.dto.TeamDto;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.team.entity.TeamMember;
import com.gameverse.modules.team.repository.TeamMemberRepository;
import com.gameverse.modules.team.repository.TeamRepository;
import com.gameverse.modules.game.entity.LinkedGameAccount;
import com.gameverse.modules.game.repository.LinkedGameAccountRepository;
import com.gameverse.modules.team.dto.InvitePlayerRequest;
import com.gameverse.modules.team.dto.TeamInvitationDto;
import com.gameverse.modules.team.entity.TeamInvitation;
import com.gameverse.modules.team.repository.TeamInvitationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.gameverse.modules.team.dto.UpdateTeamRequest;
import com.gameverse.modules.team.dto.UpdateRoleRequest;
import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;
import com.gameverse.modules.team.dto.TeamMemberDto;

@Service
@RequiredArgsConstructor
public class TeamService {

    private final TeamRepository teamRepository;
    private final TeamMemberRepository teamMemberRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final TeamInvitationRepository teamInvitationRepository;
    private final LinkedGameAccountRepository linkedGameAccountRepository;
    private final com.gameverse.modules.team.repository.TeamStatisticRepository teamStatisticRepository;

    @Transactional
    public TeamDto createTeam(String captainUserId, CreateTeamRequest request) {
        User captain = userRepository.findById(captainUserId)
                .orElseThrow(() -> new RuntimeException("Captain not found"));

        // FR-04-001: Max 3 active teams per captain
        long activeTeamsCount = teamRepository.findByCaptain_UserId(captainUserId, Pageable.unpaged())
                .stream()
                .filter(Team::getIsActive)
                .count();
        if (activeTeamsCount >= 3) {
            throw new RuntimeException("User can only be captain of a maximum of 3 active teams");
        }

        Game game = gameRepository.findById(request.getGameId())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        // FR-04-004: Unique Team Tags per game
        if (teamRepository.existsByGame_GameIdAndTeamTagIgnoreCase(game.getGameId(), request.getTeamTag())) {
            throw new RuntimeException("Team Tag is already in use for this game");
        }

        String baseSlug = request.getTeamName().toLowerCase().replaceAll("[^a-z0-9]+", "-");
        String finalSlug = baseSlug;
        int count = 1;
        while (teamRepository.findByTeamSlug(finalSlug).isPresent()) {
            finalSlug = baseSlug + "-" + count++;
        }

        Team team = new Team();
        team.setCaptain(captain);
        team.setGame(game);
        team.setTeamName(request.getTeamName());
        team.setTeamTag(request.getTeamTag());
        team.setTeamSlug(finalSlug);
        team.setLogoUrl(request.getLogoUrl());
        team.setBannerUrl(request.getBannerUrl());
        team.setDescription(request.getDescription());
        team.setSocialInstagram(request.getSocialInstagram());
        team.setSocialYoutube(request.getSocialYoutube());
        team.setCountry(request.getCountry());
        team.setInviteCode(UUID.randomUUID().toString());

        team = teamRepository.save(team);

        TeamMember captainMember = new TeamMember();
        captainMember.setTeam(team);
        captainMember.setUser(captain);
        captainMember.setGame(game);
        captainMember.setRole(TeamMember.TeamRole.captain);
        captainMember.setInGameUid(request.getCaptainInGameUid());
        captainMember.setInGameName(request.getCaptainInGameName());
        
        return mapToDto(team, false);
    }

    @Transactional(readOnly = true)
    public Page<TeamDto> getUserTeams(String userId, Pageable pageable) {
        return teamRepository.findByCaptain_UserId(userId, pageable)
                .map(team -> mapToDto(team, false));
    }

    @Transactional(readOnly = true)
    public TeamDto getTeam(String teamId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return mapToDto(team, true);
    }

    private TeamDto mapToDto(Team team, boolean includeDetails) {
        TeamDto dto = TeamDto.builder()
                .teamId(team.getTeamId())
                .captainUserId(team.getCaptain().getUserId())
                .gameId(team.getGame().getGameId())
                .teamName(team.getTeamName())
                .teamTag(team.getTeamTag())
                .teamSlug(team.getTeamSlug())
                .logoUrl(team.getLogoUrl())
                .bannerUrl(team.getBannerUrl())
                .description(team.getDescription())
                .socialInstagram(team.getSocialInstagram())
                .socialYoutube(team.getSocialYoutube())
                .country(team.getCountry())
                .totalMatches(team.getTotalMatches())
                .totalWins(team.getTotalWins())
                .isActive(team.getIsActive())
                .inviteCode(team.getInviteCode())
                .build();
                
        if (includeDetails) {
            List<TeamMemberDto> roster = teamMemberRepository.findByTeam_TeamId(team.getTeamId())
                    .stream()
                    .map(m -> TeamMemberDto.builder()
                            .id(m.getMemberId())
                            .userId(m.getUser().getUserId())
                            .username(m.getUser().getUsername())
                            .role(m.getRole().name())
                            .inGameUid(m.getInGameUid())
                            .inGameName(m.getInGameName())
                            .isActive(m.getIsActive())
                            .joinedAt(m.getJoinedAt())
                            .leftAt(m.getLeftAt())
                            .build())
                    .toList();
            dto.setRoster(roster);
            
            List<TeamInvitationDto> invites = teamInvitationRepository.findByTeam_TeamId(team.getTeamId())
                    .stream()
                    .map(this::mapInviteToDto)
                    .toList();
            dto.setInvitations(invites);
            
            teamStatisticRepository.findByTeam_TeamIdAndGame_GameId(team.getTeamId(), team.getGame().getGameId())
                .ifPresent(stat -> {
                    dto.setStatistics(com.gameverse.modules.team.dto.TeamStatisticDto.builder()
                        .statId(stat.getStatId())
                        .teamId(stat.getTeam().getTeamId())
                        .gameId(stat.getGame().getGameId())
                        .totalTournaments(stat.getTotalTournaments())
                        .totalMatchesPlayed(stat.getTotalMatchesPlayed())
                        .totalKills(stat.getTotalKills())
                        .chickenDinnerCount(stat.getChickenDinnerCount())
                        .averagePlacement(stat.getAveragePlacement())
                        .averageKillsPerMatch(stat.getAverageKillsPerMatch())
                        .winRate(stat.getWinRate())
                        .eloRating(stat.getEloRating())
                        .build());
                });
        }
        
        return dto;
    }

    @Transactional
    public TeamInvitationDto invitePlayer(String teamId, String captainUserId, InvitePlayerRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can invite players");
        }

        // FR-04-007: check max team size
        long currentMembers = teamMemberRepository.countByTeam_TeamIdAndIsActiveTrue(teamId);
        if (currentMembers >= team.getGame().getMaxTeamSize()) {
            throw new RuntimeException("Team is full");
        }

        User invitee = userRepository.findByUsername(request.getInvitee())
                .orElseGet(() -> userRepository.findByEmail(request.getInvitee())
                        .orElseThrow(() -> new RuntimeException("Invitee not found")));

        if (teamMemberRepository.existsByTeam_TeamIdAndUser_UserIdAndIsActiveTrue(teamId, invitee.getUserId())) {
            throw new RuntimeException("User is already in the team");
        }

        TeamInvitation invite = new TeamInvitation();
        invite.setTeam(team);
        invite.setInvitedBy(team.getCaptain());
        invite.setInvitedEmail(invitee.getEmail());
        invite.setInvitedUser(invitee);
        invite.setRole(request.getRole());
        invite.setTokenHash(UUID.randomUUID().toString());
        invite.setExpiresAt(LocalDateTime.now().plusDays(7));

        teamInvitationRepository.save(invite);

        return mapInviteToDto(invite);
    }

    @Transactional
    public TeamDto acceptInvitation(String userId, String inviteId) {
        TeamInvitation invite = teamInvitationRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getInvitedUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (invite.getStatus() != TeamInvitation.InviteStatus.pending || invite.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invite expired or invalid");
        }

        Team team = invite.getTeam();

        long currentMembers = teamMemberRepository.countByTeam_TeamIdAndIsActiveTrue(team.getTeamId());
        if (currentMembers >= team.getGame().getMaxTeamSize()) {
            throw new RuntimeException("Team is full");
        }

        // FR-04-009: pull linked in-game account
        LinkedGameAccount linkedAccount = linkedGameAccountRepository
                .findByUser_UserIdAndGame_GameId(userId, team.getGame().getGameId())
                .orElse(null);

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(invite.getInvitedUser());
        member.setGame(team.getGame());
        member.setRole(invite.getRole());
        
        if (linkedAccount != null) {
            member.setInGameUid(linkedAccount.getInGameUid());
            member.setInGameName(linkedAccount.getInGameName());
        } else {
            member.setInGameUid("PENDING-" + UUID.randomUUID().toString().substring(0, 8));
        }

        teamMemberRepository.save(member);

        invite.setStatus(TeamInvitation.InviteStatus.accepted);
        teamInvitationRepository.save(invite);

        return mapToDto(team, false);
    }

    @Transactional
    public void removePlayer(String teamId, String captainUserId, String memberId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can remove players");
        }

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (member.getRole() == TeamMember.TeamRole.captain) {
            throw new RuntimeException("Cannot remove captain");
        }

        member.setIsActive(false);
        member.setLeftAt(LocalDateTime.now());
        teamMemberRepository.save(member);
    }

    private TeamInvitationDto mapInviteToDto(TeamInvitation invite) {
        return TeamInvitationDto.builder()
                .inviteId(invite.getInviteId())
                .teamId(invite.getTeam().getTeamId())
                .teamName(invite.getTeam().getTeamName())
                .teamTag(invite.getTeam().getTeamTag())
                .gameCode(invite.getTeam().getGame().getGameCode())
                .invitedBy(invite.getInvitedBy().getUserId())
                .invitedByName(invite.getInvitedBy().getDisplayName() != null ? invite.getInvitedBy().getDisplayName() : invite.getInvitedBy().getUsername())
                .invitedEmail(invite.getInvitedEmail())
                .invitedUserId(invite.getInvitedUser() != null ? invite.getInvitedUser().getUserId() : null)
                .role(invite.getRole())
                .status(invite.getStatus().name())
                .expiresAt(invite.getExpiresAt())
                .createdAt(invite.getCreatedAt())
                .build();
    }

    @Transactional(readOnly = true)
    public List<TeamInvitationDto> getUserInvitations(String userId) {
        return teamInvitationRepository.findByInvitedUser_UserIdAndStatus(userId, TeamInvitation.InviteStatus.pending)
                .stream()
                .filter(inv -> inv.getExpiresAt().isAfter(LocalDateTime.now()))
                .map(this::mapInviteToDto)
                .toList();
    }

    @Transactional
    public void declineInvitation(String userId, String inviteId) {
        TeamInvitation invite = teamInvitationRepository.findById(inviteId)
                .orElseThrow(() -> new RuntimeException("Invite not found"));

        if (!invite.getInvitedUser().getUserId().equals(userId)) {
            throw new RuntimeException("Unauthorized");
        }

        if (invite.getStatus() != TeamInvitation.InviteStatus.pending) {
            throw new RuntimeException("Invite is not pending");
        }

        invite.setStatus(TeamInvitation.InviteStatus.declined);
        teamInvitationRepository.save(invite);
    }

    @Transactional
    public void leaveTeam(String teamId, String userId) {
        teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
                
        TeamMember member = teamMemberRepository.findByTeam_TeamId(teamId).stream()
                .filter(m -> m.getUser().getUserId().equals(userId) && m.getIsActive())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (member.getRole() == TeamMember.TeamRole.captain) {
            throw new RuntimeException("Captain cannot leave team. Transfer captaincy or disband.");
        }

        member.setIsActive(false);
        member.setLeftAt(LocalDateTime.now());
        teamMemberRepository.save(member);
    }

    @Transactional(readOnly = true)
    public TeamDto getTeamBySlug(String teamSlug) {
        Team team = teamRepository.findByTeamSlug(teamSlug)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return mapToDto(team, true);
    }

    @Transactional
    public TeamDto updateTeam(String teamId, String captainUserId, UpdateTeamRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can update team");
        }

        team.setTeamName(request.getName());
        team.setTeamTag(request.getTag());
        team.setDescription(request.getDescription());
        team.setCountry(request.getCountry());
        team.setSocialInstagram(request.getInstagram());
        team.setSocialYoutube(request.getYoutube());
        team.setLogoUrl(request.getLogoUrl());
        team.setBannerUrl(request.getBannerUrl());
        
        teamRepository.save(team);
        return mapToDto(team, true);
    }

    @Transactional
    public void disbandTeam(String teamId, String captainUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can disband team");
        }
        
        team.setIsActive(false);
        teamRepository.save(team);
        
        List<TeamMember> members = teamMemberRepository.findByTeam_TeamId(teamId);
        for (TeamMember m : members) {
            m.setIsActive(false);
            m.setLeftAt(LocalDateTime.now());
            teamMemberRepository.save(m);
        }
    }

    @Transactional
    public TeamDto transferCaptaincy(String teamId, String currentCaptainId, String newCaptainMemberId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getCaptain().getUserId().equals(currentCaptainId)) {
            throw new RuntimeException("Only captain can transfer captaincy");
        }

        TeamMember newCaptainMember = teamMemberRepository.findById(newCaptainMemberId)
                .orElseThrow(() -> new RuntimeException("New captain member not found"));

        if (!newCaptainMember.getIsActive()) {
            throw new RuntimeException("New captain must be an active member");
        }

        // Demote current captain
        TeamMember currentCaptainMember = teamMemberRepository.findByTeam_TeamId(teamId).stream()
                .filter(m -> m.getUser().getUserId().equals(currentCaptainId) && m.getIsActive())
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Current captain member not found"));
        
        currentCaptainMember.setRole(TeamMember.TeamRole.player);
        teamMemberRepository.save(currentCaptainMember);

        // Promote new captain
        newCaptainMember.setRole(TeamMember.TeamRole.captain);
        teamMemberRepository.save(newCaptainMember);

        team.setCaptain(newCaptainMember.getUser());
        teamRepository.save(team);

        return mapToDto(team, true);
    }

    @Transactional
    public TeamDto updateMemberRole(String teamId, String captainUserId, String memberId, UpdateRoleRequest request) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can update member roles");
        }

        TeamMember member = teamMemberRepository.findById(memberId)
                .orElseThrow(() -> new RuntimeException("Member not found"));

        if (!member.getIsActive()) {
            throw new RuntimeException("Cannot update inactive member");
        }

        if (member.getRole() == TeamMember.TeamRole.captain) {
            throw new RuntimeException("Cannot change captain's role directly. Transfer captaincy instead.");
        }

        if (request.getRole() != null) {
            if (request.getRole() == TeamMember.TeamRole.substitute) {
                long currentSubs = teamMemberRepository.findByTeam_TeamId(teamId).stream()
                        .filter(m -> m.getIsActive() && m.getRole() == TeamMember.TeamRole.substitute)
                        .count();
                if (currentSubs >= team.getGame().getMaxSubstitutes()) {
                    throw new RuntimeException("Team has reached the maximum number of substitutes for this game");
                }
            }
            member.setRole(request.getRole());
        }
        
        teamMemberRepository.save(member);
        return mapToDto(team, true);
    }

    @Transactional
    public String regenerateInviteCode(String teamId, String captainUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can regenerate invite code");
        }
        String newCode = UUID.randomUUID().toString();
        team.setInviteCode(newCode);
        teamRepository.save(team);
        return newCode;
    }

    @Transactional
    public TeamDto joinByInviteCode(String inviteCode, String userId) {
        Team team = teamRepository.findByInviteCode(inviteCode)
                .orElseThrow(() -> new RuntimeException("Invalid invite code"));

        if (!team.getIsActive()) {
            throw new RuntimeException("Team is not active");
        }

        long currentMembers = teamMemberRepository.countByTeam_TeamIdAndIsActiveTrue(team.getTeamId());
        if (currentMembers >= team.getGame().getMaxTeamSize()) {
            throw new RuntimeException("Team is full");
        }

        if (teamMemberRepository.existsByTeam_TeamIdAndUser_UserIdAndIsActiveTrue(team.getTeamId(), userId)) {
            throw new RuntimeException("You are already in this team");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LinkedGameAccount linkedAccount = linkedGameAccountRepository
                .findByUser_UserIdAndGame_GameId(userId, team.getGame().getGameId())
                .orElse(null);

        TeamMember member = new TeamMember();
        member.setTeam(team);
        member.setUser(user);
        member.setGame(team.getGame());
        member.setRole(TeamMember.TeamRole.player);
        
        if (linkedAccount != null) {
            member.setInGameUid(linkedAccount.getInGameUid());
            member.setInGameName(linkedAccount.getInGameName());
        } else {
            member.setInGameUid("PENDING-" + UUID.randomUUID().toString().substring(0, 8));
        }

        teamMemberRepository.save(member);
        return mapToDto(team, false);
    }

    @Transactional(readOnly = true)
    public List<Object> getTeamTournaments(String teamId) {
        // Return an empty list for now since Tournament module doesn't fully link to Teams yet.
        // Once tournament registrations exist, we will query them.
        return List.of();
    }

    @Transactional(readOnly = true)
    public List<TeamMemberDto> getRosterHistory(String teamId, String captainUserId) {
        Team team = teamRepository.findById(teamId)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        
        if (!team.getCaptain().getUserId().equals(captainUserId)) {
            throw new RuntimeException("Only captain can view roster history");
        }
        
        return teamMemberRepository.findByTeam_TeamId(teamId)
                .stream()
                .map(m -> TeamMemberDto.builder()
                        .id(m.getMemberId())
                        .userId(m.getUser().getUserId())
                        .username(m.getUser().getUsername())
                        .role(m.getRole().name())
                        .inGameUid(m.getInGameUid())
                        .inGameName(m.getInGameName())
                        .isActive(m.getIsActive())
                        .joinedAt(m.getJoinedAt())
                        .leftAt(m.getLeftAt())
                        .build())
                .toList();
    }
}

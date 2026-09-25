package com.gameverse.modules.dispute.service;

import com.gameverse.modules.dispute.dto.CreateDisputeRequest;
import com.gameverse.modules.dispute.dto.DisputeDto;
import com.gameverse.modules.dispute.entity.Dispute;
import com.gameverse.modules.dispute.repository.DisputeRepository;
import com.gameverse.modules.dispute.repository.DisputeResolutionRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.modules.team.entity.Team;
import com.gameverse.modules.team.repository.TeamRepository;
import com.gameverse.modules.result.entity.TeamMatchScore;
import com.gameverse.modules.result.repository.TeamMatchScoreRepository;
import com.gameverse.modules.audit.service.AuditLogService;
import com.gameverse.modules.notification.service.NotificationService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class DisputeServiceTest {

    @Mock
    private DisputeRepository disputeRepository;
    @Mock
    private TournamentRepository tournamentRepository;
    @Mock
    private TeamRepository teamRepository;
    @Mock
    private TeamMatchScoreRepository scoreRepository;
    @Mock
    private DisputeResolutionRepository resolutionRepository;
    @Mock
    private AuditLogService auditLogService;
    @Mock
    private NotificationService notificationService;
    @Mock
    private com.gameverse.modules.auth.repository.UserRepository userRepository;

    @InjectMocks
    private DisputeService disputeService;

    private Tournament tournament;
    private Team team;

    @BeforeEach
    void setUp() {
        tournament = new Tournament();
        tournament.setTournamentId("t1");
        tournament.setSlug("tournament-slug");

        team = new Team();
        team.setTeamId("team1");
        team.setTeamName("Test Team");
    }

    @Test
    void testCreateDQAppealAutoEscalates() {
        CreateDisputeRequest request = new CreateDisputeRequest();
        request.setCategory("Disqualification Appeal");
        request.setDescription("We were wrongly DQ'd");

        when(tournamentRepository.findById("t1")).thenReturn(Optional.of(tournament));
        when(teamRepository.findById("team1")).thenReturn(Optional.of(team));
        com.gameverse.modules.auth.entity.User user = new com.gameverse.modules.auth.entity.User();
        user.setUserId("user1");
        when(userRepository.findById("user1")).thenReturn(Optional.of(user));
        when(disputeRepository.countByTeam_TeamIdAndTournament_TournamentId("team1", "t1")).thenReturn(0);

        when(disputeRepository.save(any(Dispute.class))).thenAnswer(invocation -> {
            Dispute d = invocation.getArgument(0);
            d.setDisputeId("d1");
            return d;
        });

        DisputeDto result = disputeService.createDispute("user1", "t1", "team1", request);

        assertNotNull(result);
        assertEquals("OPEN", result.getStatus());
        assertTrue(result.getIsEscalated());
        assertTrue(result.getIsAppealed());
        assertNotNull(result.getEscalatedAt());
    }
}

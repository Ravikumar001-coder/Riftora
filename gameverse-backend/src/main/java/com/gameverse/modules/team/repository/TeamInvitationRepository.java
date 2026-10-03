package com.gameverse.modules.team.repository;

import com.gameverse.modules.team.entity.TeamInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.List;

@Repository
public interface TeamInvitationRepository extends JpaRepository<TeamInvitation, String> {
    Optional<TeamInvitation> findByTokenHash(String tokenHash);
    List<TeamInvitation> findByTeam_TeamId(String teamId);
    List<TeamInvitation> findByInvitedUser_UserIdAndStatus(String userId, TeamInvitation.InviteStatus status);
}

package com.gameverse.modules.team.repository;

import com.gameverse.modules.team.entity.Team;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TeamRepository extends JpaRepository<Team, String> {
    Optional<Team> findByTeamSlug(String teamSlug);
    Page<Team> findByCaptain_UserId(String captainUserId, Pageable pageable);
    boolean existsByGame_GameIdAndTeamTagIgnoreCase(String gameId, String teamTag);
    Optional<Team> findByInviteCode(String inviteCode);
}

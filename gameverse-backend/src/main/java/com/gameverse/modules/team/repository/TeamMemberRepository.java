package com.gameverse.modules.team.repository;

import com.gameverse.modules.team.entity.TeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamMemberRepository extends JpaRepository<TeamMember, String> {
    List<TeamMember> findByTeam_TeamId(String teamId);
    List<TeamMember> findByUser_UserId(String userId);
    long countByTeam_TeamIdAndIsActiveTrue(String teamId);
    boolean existsByTeam_TeamIdAndUser_UserIdAndIsActiveTrue(String teamId, String userId);
}

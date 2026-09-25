package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.TeamPayoutMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TeamPayoutMethodRepository extends JpaRepository<TeamPayoutMethod, String> {
    List<TeamPayoutMethod> findByTeamTeamId(String teamId);
    Optional<TeamPayoutMethod> findByTeamTeamIdAndIsVerifiedTrue(String teamId);
}

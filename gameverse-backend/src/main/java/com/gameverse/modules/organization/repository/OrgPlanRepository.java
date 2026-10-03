package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrgPlanRepository extends JpaRepository<OrgPlan, String> {
    Optional<OrgPlan> findByPlanCode(OrgPlan.PlanCode planCode);
}

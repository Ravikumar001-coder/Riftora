package com.gameverse.modules.scoring.repository;

import com.gameverse.modules.scoring.model.ScoringTemplate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ScoringTemplateRepository extends JpaRepository<ScoringTemplate, String> {
    List<ScoringTemplate> findByOrganization_OrgIdOrIsSystemTemplateTrue(String orgId);
    Optional<ScoringTemplate> findByIdAndOrganization_OrgId(String id, String orgId);
    List<ScoringTemplate> findByGame_GameIdAndIsSystemTemplateTrue(String gameId);
}

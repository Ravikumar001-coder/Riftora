package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.entity.GameConfigurationTemplate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GameConfigurationTemplateRepository extends JpaRepository<GameConfigurationTemplate, String> {
    
    Page<GameConfigurationTemplate> findByOrganizationOrgId(String orgId, Pageable pageable);
    
    Page<GameConfigurationTemplate> findByOrganizationOrgIdAndGameGameId(String orgId, String gameId, Pageable pageable);
    
    Optional<GameConfigurationTemplate> findByTemplateIdAndOrganizationOrgId(String templateId, String orgId);
    
    boolean existsByNameAndOrganizationOrgId(String name, String orgId);
}

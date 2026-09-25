package com.gameverse.modules.broadcast.repository;

import com.gameverse.modules.broadcast.entity.YoutubeIntegration;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface YoutubeIntegrationRepository extends JpaRepository<YoutubeIntegration, String> {
    Optional<YoutubeIntegration> findByOrganization_OrgId(String orgId);
}

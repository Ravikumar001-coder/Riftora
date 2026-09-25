package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgFollower;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrgFollowerRepository extends JpaRepository<OrgFollower, String> {
    long countByOrganization_OrgId(String orgId);
    boolean existsByOrganization_OrgIdAndUser_UserId(String orgId, String userId);
    Optional<OrgFollower> findByOrganization_OrgIdAndUser_UserId(String orgId, String userId);
}

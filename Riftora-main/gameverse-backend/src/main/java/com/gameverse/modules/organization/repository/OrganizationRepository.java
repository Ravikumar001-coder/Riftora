package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, String> {
    boolean existsByOrgSlug(String orgSlug);
    java.util.Optional<Organization> findByOrgSlug(String orgSlug);
    java.util.Optional<Organization> findByCustomSubdomain(String customSubdomain);
    long countByOwner_UserId(String ownerUserId);
    java.util.List<Organization> findAllByOwner_UserId(String ownerUserId);
    Page<Organization> findByOwner_UserId(String ownerUserId, Pageable pageable);
}

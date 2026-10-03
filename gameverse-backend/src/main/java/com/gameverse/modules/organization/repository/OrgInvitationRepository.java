package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgInvitation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrgInvitationRepository extends JpaRepository<OrgInvitation, String> {
    Optional<OrgInvitation> findByToken(String token);
    java.util.List<OrgInvitation> findByOrganization_OrgId(String orgId);
}

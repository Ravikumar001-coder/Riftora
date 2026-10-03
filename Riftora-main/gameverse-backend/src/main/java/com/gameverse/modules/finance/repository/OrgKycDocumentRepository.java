package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.OrgKycDocument;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrgKycDocumentRepository extends JpaRepository<OrgKycDocument, String> {
    List<OrgKycDocument> findByOrganizationOrgIdOrderBySubmittedAtDesc(String orgId);
    long countByOrganizationOrgIdAndStatus(String orgId, String status);
}

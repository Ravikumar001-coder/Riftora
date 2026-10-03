package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.OrgPayoutMethod;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrgPayoutMethodRepository extends JpaRepository<OrgPayoutMethod, String> {
    List<OrgPayoutMethod> findByOrganizationOrgId(String orgId);
    Optional<OrgPayoutMethod> findByOrganizationOrgIdAndIsVerifiedTrue(String orgId);
}

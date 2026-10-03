package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrgMemberRepository extends JpaRepository<OrgMember, String> {
    List<OrgMember> findByOrganization_OrgId(String orgId);
    List<OrgMember> findByUser_UserId(String userId);
    Optional<OrgMember> findByOrganization_OrgIdAndUser_UserId(String orgId, String userId);
    long countByOrganization_OrgId(String orgId);
}

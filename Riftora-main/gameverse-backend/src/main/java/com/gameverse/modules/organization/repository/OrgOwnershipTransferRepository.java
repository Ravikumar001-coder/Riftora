package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgOwnershipTransfer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrgOwnershipTransferRepository extends JpaRepository<OrgOwnershipTransfer, String> {
    
    Optional<OrgOwnershipTransfer> findByOrganization_OrgIdAndStatus(String orgId, OrgOwnershipTransfer.TransferStatus status);
    
    List<OrgOwnershipTransfer> findByToUser_UserIdAndStatus(String toUserId, OrgOwnershipTransfer.TransferStatus status);
}

package com.gameverse.modules.organization.service;

import com.gameverse.core.security.OrgSecurityService;
import com.gameverse.modules.organization.entity.OrgMember;
import com.gameverse.modules.organization.entity.OrgAuditLog;
import com.gameverse.modules.organization.repository.OrgMemberRepository;
import com.gameverse.modules.organization.dto.OrgAuditLogResponse;
import lombok.RequiredArgsConstructor;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.stream.Collectors;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class OrgMemberService {

    private final OrgMemberRepository orgMemberRepository;
    private final OrgSecurityService orgSecurityService;
    private final OrgAuditService orgAuditService;
    private final com.gameverse.modules.organization.repository.OrgInvitationRepository orgInvitationRepository;
    private final com.gameverse.modules.organization.repository.OrganizationRepository organizationRepository;
    private final com.gameverse.modules.organization.repository.OrgOwnershipTransferRepository orgOwnershipTransferRepository;

    @Transactional
    public void updateMemberRole(String orgId, String targetUserId, OrgMember.OrgRole newRole, String customRoleName) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        OrgMember requester = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, requesterId)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this organization"));

        OrgMember target = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user is not a member of this organization"));

        // FR-01-024: A user cannot modify the roles of users at their own level or above.
        if (!orgSecurityService.isRoleHigher(requester.getRole(), target.getRole())) {
            throw new AccessDeniedException("You cannot modify the role of a user at your level or higher.");
        }

        // FR-01-024: A user cannot assign a role equal to or higher than their own.
        if (!orgSecurityService.isRoleHigher(requester.getRole(), newRole)) {
            throw new AccessDeniedException("You cannot assign a role equal to or higher than your own.");
        }

        Map<String, Object> metadata = new HashMap<>();
        metadata.put("old_role", target.getRole());
        metadata.put("new_role", newRole);
        metadata.put("old_custom_role_name", target.getCustomRoleName());
        metadata.put("new_custom_role_name", customRoleName);

        orgAuditService.logEvent(target.getOrganization(), requester.getUser(), target.getUser(), OrgAuditLog.EventType.ROLE_CHANGED, metadata);

        target.setRole(newRole);
        target.setCustomRoleName(customRoleName);
        orgMemberRepository.save(target);
    }

    @Transactional
    public void removeMember(String orgId, String targetUserId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        // A user can remove themselves
        if (requesterId.equals(targetUserId)) {
            OrgMember target = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, targetUserId)
                    .orElseThrow(() -> new RuntimeException("Target user is not a member of this organization"));
            
            // Owner cannot remove themselves unless they transfer ownership (this logic might need refinement later)
            if (target.getRole() == OrgMember.OrgRole.org_owner) {
                throw new RuntimeException("Organization owner cannot leave the organization without transferring ownership.");
            }
            
            orgAuditService.logEvent(target.getOrganization(), target.getUser(), target.getUser(), OrgAuditLog.EventType.MEMBER_LEFT, new HashMap<>());
            
            orgMemberRepository.delete(target);
            return;
        }

        OrgMember requester = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, requesterId)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this organization"));

        OrgMember target = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user is not a member of this organization"));

        // FR-01-024 / FR-02-015 check
        if (!orgSecurityService.isRoleHigher(requester.getRole(), target.getRole())) {
            throw new AccessDeniedException("You cannot remove a user at your level or higher.");
        }

        orgAuditService.logEvent(target.getOrganization(), requester.getUser(), target.getUser(), OrgAuditLog.EventType.MEMBER_REMOVED, new HashMap<>());
        orgMemberRepository.delete(target);
    }

    @Transactional(readOnly = true)
    public List<OrgAuditLogResponse> getAuditLogs(String orgId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        // Must be a member to view logs (could restrict to admin/owner later)
        orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, requesterId)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this organization"));

        return orgAuditService.getAuditLogsForOrganization(orgId).stream()
                .map(log -> OrgAuditLogResponse.builder()
                        .logId(log.getLogId())
                        .targetUserId(log.getTargetUser() != null ? log.getTargetUser().getUserId() : null)
                        .targetUsername(log.getTargetUser() != null ? log.getTargetUser().getUsername() : null)
                        .actorUserId(log.getActor().getUserId())
                        .actorUsername(log.getActor().getUsername())
                        .eventType(log.getEventType())
                        .metadata(log.getMetadata())
                        .changedAt(log.getCreatedAt())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<com.gameverse.modules.organization.dto.OrgMemberResponse> getOrganizationMembers(String orgId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        // Must be a member to view members
        orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, requesterId)
                .orElseThrow(() -> new AccessDeniedException("Not a member of this organization"));

        List<com.gameverse.modules.organization.dto.OrgMemberResponse> response = new java.util.ArrayList<>();

        // Fetch active members
        orgMemberRepository.findByOrganization_OrgId(orgId).forEach(member -> {
            response.add(com.gameverse.modules.organization.dto.OrgMemberResponse.builder()
                    .id(member.getUser().getUserId())
                    .userId(member.getUser().getUserId())
                    .avatarUrl(member.getUser().getAvatarUrl())
                    .displayName(member.getUser().getDisplayName())
                    .username(member.getUser().getUsername())
                    .email(member.getUser().getEmail())
                    .role(member.getRole().name())
                    .customRoleName(member.getCustomRoleName())
                    .status("ACTIVE")
                    .joinedAt(member.getJoinedAt())
                    .build());
        });

        // Fetch pending invitations
        orgInvitationRepository.findByOrganization_OrgId(orgId).forEach(invite -> {
            if (invite.getStatus() == com.gameverse.modules.organization.entity.OrgInvitation.InviteStatus.pending) {
                response.add(com.gameverse.modules.organization.dto.OrgMemberResponse.builder()
                        .id(invite.getInviteId())
                        .userId(invite.getTargetUser() != null ? invite.getTargetUser().getUserId() : null)
                        .avatarUrl(invite.getTargetUser() != null ? invite.getTargetUser().getAvatarUrl() : null)
                        .displayName(invite.getTargetUser() != null ? invite.getTargetUser().getDisplayName() : invite.getEmail())
                        .username(invite.getTargetUser() != null ? invite.getTargetUser().getUsername() : null)
                        .email(invite.getTargetUser() != null ? invite.getTargetUser().getEmail() : invite.getEmail())
                        .role(invite.getRole().name())
                        .status("PENDING")
                        .joinedAt(invite.getCreatedAt())
                        .build());
            }
        });

        return response;
    }
    @Transactional
    public void initiateOwnershipTransfer(String orgId, String toUserId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        com.gameverse.modules.organization.entity.Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (!org.getOwner().getUserId().equals(requesterId)) {
            throw new AccessDeniedException("Only the organization owner can transfer ownership");
        }

        OrgMember targetMember = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, toUserId)
                .orElseThrow(() -> new RuntimeException("Target user is not a member of this organization"));

        // Cancel any pending transfer
        orgOwnershipTransferRepository.findByOrganization_OrgIdAndStatus(orgId, com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.pending)
                .ifPresent(transfer -> {
                    transfer.setStatus(com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.cancelled);
                    orgOwnershipTransferRepository.save(transfer);
                });

        com.gameverse.modules.organization.entity.OrgOwnershipTransfer transfer = com.gameverse.modules.organization.entity.OrgOwnershipTransfer.builder()
                .organization(org)
                .fromUser(org.getOwner())
                .toUser(targetMember.getUser())
                .status(com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.pending)
                .build();

        orgOwnershipTransferRepository.save(transfer);
    }

    @Transactional
    public void acceptOwnershipTransfer(String orgId, String transferId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        com.gameverse.modules.organization.entity.OrgOwnershipTransfer transfer = orgOwnershipTransferRepository.findById(transferId)
                .orElseThrow(() -> new RuntimeException("Transfer request not found"));

        if (!transfer.getOrganization().getOrgId().equals(orgId)) {
            throw new RuntimeException("Invalid organization");
        }

        if (!transfer.getToUser().getUserId().equals(requesterId)) {
            throw new AccessDeniedException("Only the target user can accept this transfer");
        }

        if (transfer.getStatus() != com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.pending) {
            throw new RuntimeException("Transfer is not pending");
        }

        transfer.setStatus(com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.accepted);
        orgOwnershipTransferRepository.save(transfer);

        com.gameverse.modules.organization.entity.Organization org = transfer.getOrganization();
        
        // Update old owner role to admin
        OrgMember oldOwner = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, transfer.getFromUser().getUserId())
                .orElseThrow(() -> new RuntimeException("Old owner member not found"));
        oldOwner.setRole(OrgMember.OrgRole.org_admin);
        orgMemberRepository.save(oldOwner);

        // Update new owner role to owner
        OrgMember newOwner = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, transfer.getToUser().getUserId())
                .orElseThrow(() -> new RuntimeException("New owner member not found"));
        newOwner.setRole(OrgMember.OrgRole.org_owner);
        orgMemberRepository.save(newOwner);

        org.setOwner(transfer.getToUser());
        organizationRepository.save(org);

        orgAuditService.logEvent(org, transfer.getToUser(), transfer.getFromUser(), OrgAuditLog.EventType.OWNERSHIP_TRANSFERRED, new HashMap<>());
    }

    @Transactional
    public void cancelOwnershipTransfer(String orgId, String transferId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        com.gameverse.modules.organization.entity.OrgOwnershipTransfer transfer = orgOwnershipTransferRepository.findById(transferId)
                .orElseThrow(() -> new RuntimeException("Transfer request not found"));

        if (!transfer.getOrganization().getOrgId().equals(orgId)) {
            throw new RuntimeException("Invalid organization");
        }

        if (!transfer.getFromUser().getUserId().equals(requesterId)) {
            throw new AccessDeniedException("Only the organization owner can cancel this transfer");
        }

        if (transfer.getStatus() != com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.pending) {
            throw new RuntimeException("Transfer is not pending");
        }

        transfer.setStatus(com.gameverse.modules.organization.entity.OrgOwnershipTransfer.TransferStatus.cancelled);
        orgOwnershipTransferRepository.save(transfer);
    }

    @Transactional
    public void leaveOrganization(String orgId) {
        String requesterId = SecurityContextHolder.getContext().getAuthentication().getName();

        com.gameverse.modules.organization.entity.Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (org.getOwner().getUserId().equals(requesterId)) {
            throw new RuntimeException("Organization owner cannot leave. Transfer ownership or delete the organization first.");
        }

        OrgMember member = orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, requesterId)
                .orElseThrow(() -> new RuntimeException("You are not a member of this organization"));

        orgMemberRepository.delete(member);
    }
}

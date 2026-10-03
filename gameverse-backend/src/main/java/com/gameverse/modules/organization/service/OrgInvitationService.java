package com.gameverse.modules.organization.service;

import com.gameverse.core.notification.service.EmailNotificationService;
import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.organization.entity.OrgInvitation;
import com.gameverse.modules.organization.entity.OrgJoinLink;
import com.gameverse.modules.organization.entity.OrgMember;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrgInvitationRepository;
import com.gameverse.modules.organization.repository.OrgJoinLinkRepository;
import com.gameverse.modules.organization.repository.OrgMemberRepository;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class OrgInvitationService {

    private final OrgInvitationRepository orgInvitationRepository;
    private final OrgJoinLinkRepository orgJoinLinkRepository;
    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final OrgMemberRepository orgMemberRepository;
    private final OrgAuditService orgAuditService;
    private final EmailNotificationService emailNotificationService;

    @Transactional
    public OrgInvitation inviteByEmail(String orgId, String email, OrgMember.OrgRole role) {
        String inviterId = SecurityContextHolder.getContext().getAuthentication().getName();
        User inviter = userRepository.findById(inviterId).orElseThrow();
        Organization org = organizationRepository.findById(orgId).orElseThrow();
        
        checkMemberLimit(org);

        OrgInvitation invitation = new OrgInvitation();
        invitation.setOrganization(org);
        invitation.setEmail(email);
        invitation.setRole(role);
        invitation.setInvitedBy(inviter);
        invitation.setToken(UUID.randomUUID().toString());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(7));
        
        OrgInvitation savedInvite = orgInvitationRepository.save(invitation);
        
        java.util.Map<String, Object> metadata = new java.util.HashMap<>();
        metadata.put("invite_id", savedInvite.getInviteId());
        metadata.put("role", role);
        metadata.put("email", email);
        orgAuditService.logEvent(org, inviter, null, com.gameverse.modules.organization.entity.OrgAuditLog.EventType.INVITATION_SENT, metadata);
        
        return savedInvite;
    }

    @Transactional
    public OrgInvitation inviteByUsername(String orgId, String username, OrgMember.OrgRole role) {
        String inviterId = SecurityContextHolder.getContext().getAuthentication().getName();
        User inviter = userRepository.findById(inviterId).orElseThrow();
        Organization org = organizationRepository.findById(orgId).orElseThrow();
        
        checkMemberLimit(org);
        
        User target = userRepository.findByUsername(username).orElseThrow(() -> new RuntimeException("Target user not found"));

        if (orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(orgId, target.getUserId()).isPresent()) {
            throw new RuntimeException("User is already a member of this organization");
        }

        OrgInvitation invitation = new OrgInvitation();
        invitation.setOrganization(org);
        invitation.setTargetUser(target);
        invitation.setRole(role);
        invitation.setInvitedBy(inviter);
        invitation.setToken(UUID.randomUUID().toString());
        invitation.setExpiresAt(LocalDateTime.now().plusDays(7));
        OrgInvitation savedInvite = orgInvitationRepository.save(invitation);
        
        java.util.Map<String, Object> metadata = new java.util.HashMap<>();
        metadata.put("invite_id", savedInvite.getInviteId());
        metadata.put("role", role);
        orgAuditService.logEvent(org, inviter, target, com.gameverse.modules.organization.entity.OrgAuditLog.EventType.INVITATION_SENT, metadata);
        
        return savedInvite;
    }

    @Transactional
    public OrgJoinLink createJoinLink(String orgId, OrgMember.OrgRole role, Integer maxUses, Integer expiryDays) {
        String creatorId = SecurityContextHolder.getContext().getAuthentication().getName();
        User creator = userRepository.findById(creatorId).orElseThrow();
        Organization org = organizationRepository.findById(orgId).orElseThrow();

        OrgJoinLink link = new OrgJoinLink();
        link.setOrganization(org);
        link.setRole(role);
        link.setCreatedBy(creator);
        link.setToken(UUID.randomUUID().toString());
        link.setMaxUses(maxUses != null && maxUses > 0 ? maxUses : null);
        if (expiryDays != null && expiryDays > 0) {
            link.setExpiresAt(LocalDateTime.now().plusDays(expiryDays));
        }
        return orgJoinLinkRepository.save(link);
    }

    @Transactional
    public void acceptInvitation(String token) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(userId).orElseThrow();

        OrgInvitation invitation = orgInvitationRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid invitation token"));

        if (invitation.getStatus() != OrgInvitation.InviteStatus.pending) {
            throw new RuntimeException("Invitation is no longer valid");
        }

        if (invitation.getExpiresAt().isBefore(LocalDateTime.now())) {
            invitation.setStatus(OrgInvitation.InviteStatus.expired);
            orgInvitationRepository.save(invitation);
            throw new RuntimeException("Invitation has expired");
        }

        if (invitation.getTargetUser() != null && !invitation.getTargetUser().getUserId().equals(userId)) {
            throw new RuntimeException("This invitation is not for you");
        }

        if (invitation.getEmail() != null && !invitation.getEmail().equalsIgnoreCase(user.getEmail())) {
            throw new RuntimeException("This invitation is not for your email address");
        }

        checkMemberLimit(invitation.getOrganization());

        addMember(invitation.getOrganization(), user, invitation.getRole());

        invitation.setStatus(OrgInvitation.InviteStatus.accepted);
        orgInvitationRepository.save(invitation);
        
        java.util.Map<String, Object> metadata = new java.util.HashMap<>();
        metadata.put("invite_id", invitation.getInviteId());
        metadata.put("role", invitation.getRole());
        orgAuditService.logEvent(invitation.getOrganization(), user, user, com.gameverse.modules.organization.entity.OrgAuditLog.EventType.INVITATION_ACCEPTED, metadata);
    }

    @Transactional
    public void acceptJoinLink(String token) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findById(userId).orElseThrow();

        OrgJoinLink link = orgJoinLinkRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid join link"));

        if (!link.isValid()) {
            throw new RuntimeException("Join link has expired or reached max uses");
        }

        if (orgMemberRepository.findByOrganization_OrgIdAndUser_UserId(link.getOrganization().getOrgId(), userId).isPresent()) {
            throw new RuntimeException("You are already a member of this organization");
        }
        
        checkMemberLimit(link.getOrganization());

        addMember(link.getOrganization(), user, link.getRole());

        link.setCurrentUses(link.getCurrentUses() + 1);
        orgJoinLinkRepository.save(link);
        
        java.util.Map<String, Object> metadata = new java.util.HashMap<>();
        metadata.put("link_id", link.getLinkId());
        metadata.put("role", link.getRole());
        orgAuditService.logEvent(link.getOrganization(), user, user, com.gameverse.modules.organization.entity.OrgAuditLog.EventType.INVITATION_ACCEPTED, metadata);
    }

    private void addMember(Organization org, User user, OrgMember.OrgRole role) {
        OrgMember member = new OrgMember();
        member.setOrganization(org);
        member.setUser(user);
        member.setRole(role);
        member.setJoinedAt(LocalDateTime.now());
        orgMemberRepository.save(member);
    }
    
    private void checkMemberLimit(Organization org) {
        if (org.getPlan() != null && org.getPlan().getMaxActiveMembers() != null) {
            long currentMembers = orgMemberRepository.findByOrganization_OrgId(org.getOrgId()).size();
            int max = org.getPlan().getMaxActiveMembers();
            if (currentMembers >= max) {
                emailNotificationService.sendPlanLimitReached(org, "Members", max);
                throw new RuntimeException("PLAN_LIMIT_REACHED: Organization has reached the maximum number of members (" + max + ") for its current plan.");
            } else if (currentMembers == (int)(max * 0.8)) {
                emailNotificationService.sendPlanLimitWarning(org, "Members", (int)currentMembers, max);
            }
        }
    }
}

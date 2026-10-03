package com.gameverse.modules.organization.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import com.gameverse.modules.scoring.model.PlacementPoint;
import com.gameverse.modules.scoring.model.ScoringTemplate;
import com.gameverse.modules.scoring.repository.ScoringTemplateRepository;
import com.gameverse.modules.notification.entity.NotificationTemplate;
import com.gameverse.modules.notification.repository.NotificationTemplateRepository;
import com.gameverse.modules.organization.dto.CreateOrgRequest;
import com.gameverse.modules.organization.dto.UpdateOrgSettingsRequest;
import com.gameverse.modules.organization.dto.OrgResponse;
import com.gameverse.modules.organization.entity.OrgMember;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrgMemberRepository;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class OrgService {

    private final OrganizationRepository orgRepository;
    private final OrgMemberRepository orgMemberRepository;
    private final UserRepository userRepository;
    private final GameRepository gameRepository;
    private final ScoringTemplateRepository scoringTemplateRepository;
    private final NotificationTemplateRepository notificationTemplateRepository;

    @Transactional
    public OrgResponse createOrganization(String ownerUserId, CreateOrgRequest request) {
        User owner = userRepository.findById(ownerUserId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (orgRepository.countByOwner_UserId(ownerUserId) >= 3) {
            throw new RuntimeException("You can only own a maximum of 3 organizations under the Free plan.");
        }

        Game primaryGame = gameRepository.findById(request.getPrimaryGameId())
                .orElseThrow(() -> new RuntimeException("Primary game not found"));

        if (orgRepository.existsByOrgSlug(request.getOrgSlug())) {
            throw new RuntimeException("Organization slug already exists");
        }

        Organization org = new Organization();
        org.setOrgName(request.getOrgName());
        org.setOrgSlug(request.getOrgSlug());
        org.setPrimaryGame(primaryGame);
        org.setDescription(request.getDescription());
        org.setCountry(request.getCountry());
        org.setCity(request.getCity());
        org.setLogoUrl(request.getLogoUrl());
        org.setBannerUrl(request.getBannerUrl());
        org.setWebsiteUrl(request.getWebsiteUrl());
        org.setInstagramHandle(request.getInstagramHandle());
        org.setYoutubeUrl(request.getYoutubeUrl());
        org.setDiscordLink(request.getDiscordLink());
        org.setOwner(owner);

        org = orgRepository.save(org);

        OrgMember ownerMember = new OrgMember();
        ownerMember.setOrganization(org);
        ownerMember.setUser(owner);
        ownerMember.setRole(OrgMember.OrgRole.org_owner);
        orgMemberRepository.save(ownerMember);

        // Copy default system templates to this org
        copySystemTemplatesToOrg(primaryGame.getGameId(), org);

        return mapToResponse(org);
    }

    private void copySystemTemplatesToOrg(String gameId, Organization org) {
        List<ScoringTemplate> systemTemplates = scoringTemplateRepository.findByGame_GameIdAndIsSystemTemplateTrue(gameId);
        for (ScoringTemplate sysTmpl : systemTemplates) {
            ScoringTemplate orgTmpl = new ScoringTemplate();
            orgTmpl.setGame(sysTmpl.getGame());
            orgTmpl.setOrganization(org);
            orgTmpl.setTemplateName(sysTmpl.getTemplateName());
            orgTmpl.setTemplateCode(sysTmpl.getTemplateCode());
            orgTmpl.setKillCap(sysTmpl.getKillCap());
            orgTmpl.setKillPtsEach(sysTmpl.getKillPtsEach());
            orgTmpl.setTiebreakerSeq(sysTmpl.getTiebreakerSeq());
            orgTmpl.setSystemTemplate(false);
            
            List<PlacementPoint> sysPts = sysTmpl.getPlacementPoints();
            for (PlacementPoint sysPt : sysPts) {
                PlacementPoint orgPt = new PlacementPoint();
                orgPt.setScoringTemplate(orgTmpl);
                orgPt.setPlacement(sysPt.getPlacement());
                orgPt.setPoints(sysPt.getPoints());
                orgTmpl.getPlacementPoints().add(orgPt);
            }
            scoringTemplateRepository.save(orgTmpl);
        }
        
        List<NotificationTemplate> sysNotifTmpls = notificationTemplateRepository.findByIsSystemTmplTrue();
        for (NotificationTemplate sysNotif : sysNotifTmpls) {
            NotificationTemplate orgNotif = new NotificationTemplate();
            orgNotif.setOrganization(org);
            orgNotif.setTemplateCode(sysNotif.getTemplateCode());
            orgNotif.setTitleTemplate(sysNotif.getTitleTemplate());
            orgNotif.setBodyTemplate(sysNotif.getBodyTemplate());
            orgNotif.setChannels(sysNotif.getChannels());
            orgNotif.setPriority(sysNotif.getPriority());
            orgNotif.setIsSystemTmpl(false);
            notificationTemplateRepository.save(orgNotif);
        }
    }

    @Transactional(readOnly = true)
    public Page<OrgResponse> getUserOrganizations(String userId, Pageable pageable) {
        // Technically this should look at org_members, not just owner_user_id.
        // For simplicity right now we'll just map owner_user_id.
        // A robust implementation would use a custom query in OrgMemberRepository.
        return orgRepository.findByOwner_UserId(userId, pageable)
                .map(this::mapToResponse);
    }

    @Transactional(readOnly = true)
    public OrgResponse getOrganization(String orgId) {
        Organization org = orgRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        return mapToResponse(org);
    }

    @Transactional(readOnly = true)
    public OrgResponse getOrganizationBySlug(String orgSlug) {
        Organization org = orgRepository.findByOrgSlug(orgSlug)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        return mapToResponse(org);
    }

    @Transactional(readOnly = true)
    public OrgResponse getOrganizationByCustomSubdomain(String customSubdomain) {
        Organization org = orgRepository.findByCustomSubdomain(customSubdomain)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        return mapToResponse(org);
    }

    @Transactional
    public OrgResponse updateOrganizationSettings(String orgId, UpdateOrgSettingsRequest request) {
        Organization org = orgRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (request.getOrgName() != null) org.setOrgName(request.getOrgName());
        if (request.getDescription() != null) org.setDescription(request.getDescription());
        if (request.getLogoUrl() != null) org.setLogoUrl(request.getLogoUrl());
        if (request.getBannerUrl() != null) org.setBannerUrl(request.getBannerUrl());
        if (request.getContactEmail() != null) org.setContactEmail(request.getContactEmail());
        if (request.getWebsiteUrl() != null) org.setWebsiteUrl(request.getWebsiteUrl());
        if (request.getInstagramHandle() != null) org.setInstagramHandle(request.getInstagramHandle());
        if (request.getYoutubeUrl() != null) org.setYoutubeUrl(request.getYoutubeUrl());
        if (request.getDiscordLink() != null) org.setDiscordLink(request.getDiscordLink());
        
        if (request.getVisibility() != null) {
            org.setVisibility(Organization.Visibility.valueOf(request.getVisibility().toUpperCase()));
        }
        if (request.getCustomSubdomain() != null) {
            org.setCustomSubdomain(request.getCustomSubdomain());
        }
        if (request.getPreferredLanguage() != null) {
            org.setPreferredLanguage(Organization.PreferredLanguage.valueOf(request.getPreferredLanguage().toUpperCase()));
        }

        if (request.getPrimaryColor() != null) org.setPrimaryColor(request.getPrimaryColor());
        if (request.getSecondaryColor() != null) org.setSecondaryColor(request.getSecondaryColor());
        if (request.getPrimaryFont() != null) org.setPrimaryFont(request.getPrimaryFont());
        if (request.getSecondaryFont() != null) org.setSecondaryFont(request.getSecondaryFont());
        if (request.getHouseRules() != null) org.setHouseRules(request.getHouseRules());

        Organization saved = orgRepository.save(org);
        return mapToResponse(saved);
    }

    @Transactional
    public OrgResponse updateBrandKit(String orgId, com.gameverse.modules.organization.dto.OrganizationBrandKitDto dto) {
        Organization org = orgRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (dto.getLogoUrl() != null) org.setLogoUrl(dto.getLogoUrl());
        if (dto.getSecondaryLogoUrl() != null) org.setSecondaryLogoUrl(dto.getSecondaryLogoUrl());
        if (dto.getPrimaryColor() != null) org.setPrimaryColor(dto.getPrimaryColor());
        if (dto.getSecondaryColor() != null) org.setSecondaryColor(dto.getSecondaryColor());
        if (dto.getAccentColor() != null) org.setAccentColor(dto.getAccentColor());
        if (dto.getPrimaryFont() != null) org.setPrimaryFont(dto.getPrimaryFont());
        if (dto.getSecondaryFont() != null) org.setSecondaryFont(dto.getSecondaryFont());
        if (dto.getBrandTagline() != null) org.setBrandTagline(dto.getBrandTagline());

        Organization saved = orgRepository.save(org);
        return mapToResponse(saved);
    }

    private OrgResponse mapToResponse(Organization org) {
        return OrgResponse.builder()
                .orgId(org.getOrgId())
                .orgName(org.getOrgName())
                .orgSlug(org.getOrgSlug())
                .customSubdomain(org.getCustomSubdomain())
                .description(org.getDescription())
                .logoUrl(org.getLogoUrl())
                .secondaryLogoUrl(org.getSecondaryLogoUrl())
                .bannerUrl(org.getBannerUrl())
                .primaryColor(org.getPrimaryColor())
                .secondaryColor(org.getSecondaryColor())
                .accentColor(org.getAccentColor())
                .primaryFont(org.getPrimaryFont())
                .secondaryFont(org.getSecondaryFont())
                .brandTagline(org.getBrandTagline())
                .houseRules(org.getHouseRules())
                .country(org.getCountry())
                .city(org.getCity())
                .websiteUrl(org.getWebsiteUrl())
                .instagramHandle(org.getInstagramHandle())
                .youtubeUrl(org.getYoutubeUrl())
                .discordLink(org.getDiscordLink())
                .contactEmail(org.getContactEmail())
                .visibility(org.getVisibility() != null ? org.getVisibility().name() : null)
                .preferredLanguage(org.getPreferredLanguage() != null ? org.getPreferredLanguage().name() : null)
                .isVerified(org.getIsVerified())
                .kycStatus(org.getKycStatus().name())
                .ownerUserId(org.getOwner().getUserId())
                .createdAt(org.getCreatedAt())
                .build();
    }
}

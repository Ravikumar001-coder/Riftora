package com.gameverse.modules.organization.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.organization.entity.OrgFollower;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrgFollowerRepository;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PublicOrganizationService {

    private final OrganizationRepository organizationRepository;
    private final OrgFollowerRepository orgFollowerRepository;
    private final UserRepository userRepository;
    private final com.gameverse.modules.tournament.repository.TournamentRepository tournamentRepository;
    private final com.gameverse.modules.tournament.service.TournamentService tournamentService;

    @Transactional(readOnly = true)
    public List<java.util.Map<String, Object>> getPublicDirectory() {
        // Simple implementation for MVP. A real implementation would use Pagination and dynamic JPA Specs.
        return organizationRepository.findAll().stream()
                .filter(org -> org.getVisibility() == Organization.Visibility.PUBLIC)
                .map(this::mapToPublicDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public java.util.Map<String, Object> getPublicProfile(String slug) {
        Organization org = organizationRepository.findByOrgSlug(slug)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
                
        if (org.getVisibility() == Organization.Visibility.PRIVATE) {
            throw new RuntimeException("This organization is private");
        }
        
        return mapToPublicDto(org);
    }

    @Transactional
    public void toggleFollow(String orgId) {
        String userId = SecurityContextHolder.getContext().getAuthentication().getName();
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        orgFollowerRepository.findByOrganization_OrgIdAndUser_UserId(orgId, userId)
                .ifPresentOrElse(
                        orgFollowerRepository::delete,
                        () -> {
                            OrgFollower follower = new OrgFollower();
                            follower.setOrganization(org);
                            follower.setUser(user);
                            orgFollowerRepository.save(follower);
                        }
                );
    }
    
    @Transactional(readOnly = true)
    public boolean isFollowing(String orgId) {
        try {
            String userId = SecurityContextHolder.getContext().getAuthentication().getName();
            if (userId == null || userId.equals("anonymousUser")) return false;
            return orgFollowerRepository.existsByOrganization_OrgIdAndUser_UserId(orgId, userId);
        } catch (Exception e) {
            return false;
        }
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<com.gameverse.modules.tournament.dto.TournamentDto> getPublicTournaments(String slug, int page, int size) {
        Organization organizationEntity = organizationRepository.findByOrgSlug(slug)
                .orElseThrow(() -> new RuntimeException("Organization not found"));
        
        java.util.List<com.gameverse.modules.tournament.entity.Tournament.TournamentStatus> publicStatuses = java.util.List.of(
            com.gameverse.modules.tournament.entity.Tournament.TournamentStatus.published,
            com.gameverse.modules.tournament.entity.Tournament.TournamentStatus.registration_open,
            com.gameverse.modules.tournament.entity.Tournament.TournamentStatus.live,
            com.gameverse.modules.tournament.entity.Tournament.TournamentStatus.completed
        );
        
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page, size, org.springframework.data.domain.Sort.by(org.springframework.data.domain.Sort.Direction.DESC, "startDate"));
        return tournamentRepository.findAllByOrganization_OrgIdAndStatusIn(organizationEntity.getOrgId(), publicStatuses, pageable)
                .map(t -> {
                    // We need to map to DTO, we can use TournamentService if it has a public mapToDto, or just return basic info. 
                    // Let's use TournamentService's getTournament to get the DTO since mapToDto is private.
                    return tournamentService.getTournament(t.getTournamentId());
                });
    }

    private java.util.Map<String, Object> mapToPublicDto(Organization org) {
        java.util.Map<String, Object> dto = new java.util.HashMap<>();
        dto.put("orgId", org.getOrgId());
        dto.put("name", org.getOrgName());
        dto.put("slug", org.getOrgSlug());
        dto.put("description", org.getDescription());
        dto.put("logoUrl", org.getLogoUrl());
        dto.put("bannerUrl", org.getBannerUrl());
        dto.put("country", org.getCountry());
        dto.put("city", org.getCity());
        dto.put("primaryGame", org.getPrimaryGame() != null ? org.getPrimaryGame().getGameName() : null);
        dto.put("followerCount", orgFollowerRepository.countByOrganization_OrgId(org.getOrgId()));
        dto.put("isVerified", org.getIsVerified());
        dto.put("websiteUrl", org.getWebsiteUrl());
        dto.put("instagramHandle", org.getInstagramHandle());
        dto.put("youtubeUrl", org.getYoutubeUrl());
        dto.put("discordLink", org.getDiscordLink());
        dto.put("contactEmail", org.getContactEmail());
        dto.put("primaryColor", org.getPrimaryColor());
        dto.put("secondaryColor", org.getSecondaryColor());
        return dto;
    }
}

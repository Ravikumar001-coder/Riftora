package com.gameverse.modules.broadcast.service;

import com.gameverse.modules.broadcast.dto.ConnectYoutubeRequest;
import com.gameverse.modules.broadcast.dto.YoutubeIntegrationDto;
import com.gameverse.modules.broadcast.entity.YoutubeIntegration;
import com.gameverse.modules.broadcast.repository.YoutubeIntegrationRepository;
import com.gameverse.modules.credential.service.EncryptionService;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class YoutubeIntegrationService {

    private final YoutubeIntegrationRepository youtubeIntegrationRepository;
    private final OrganizationRepository organizationRepository;
    private final EncryptionService encryptionService;

    @Transactional
    public YoutubeIntegrationDto connectYoutube(String orgId, ConnectYoutubeRequest request) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        // Simulate OAuth exchange (in real implementation, call Google OAuth API)
        String mockAccessToken = "ya29." + UUID.randomUUID().toString();
        String mockRefreshToken = "1//04" + UUID.randomUUID().toString();
        String mockChannelId = "UC" + UUID.randomUUID().toString().substring(0, 10);
        String mockChannelName = "GameVerse Stream Channel";

        Optional<YoutubeIntegration> existingOpt = youtubeIntegrationRepository.findByOrganization_OrgId(orgId);
        YoutubeIntegration integration = existingOpt.orElseGet(YoutubeIntegration::new);

        integration.setOrganization(org);
        integration.setYoutubeChannelId(mockChannelId);
        integration.setYoutubeChannelName(mockChannelName);
        integration.setAccessTokenEnc(encryptionService.encrypt(mockAccessToken));
        integration.setRefreshTokenEnc(encryptionService.encrypt(mockRefreshToken));
        integration.setTokenExpiry(LocalDateTime.now().plusHours(1));

        integration = youtubeIntegrationRepository.save(integration);
        return mapToDto(integration);
    }

    @Transactional(readOnly = true)
    public YoutubeIntegrationDto getIntegration(String orgId) {
        return youtubeIntegrationRepository.findByOrganization_OrgId(orgId)
                .map(this::mapToDto)
                .orElse(null);
    }
    
    @Transactional
    public void disconnectYoutube(String orgId) {
        youtubeIntegrationRepository.findByOrganization_OrgId(orgId)
                .ifPresent(youtubeIntegrationRepository::delete);
    }

    public void updateStreamTitleForMatchStart(String orgId, String tournamentName, Integer matchNumber, Integer roundNumber) {
        Optional<YoutubeIntegration> integration = youtubeIntegrationRepository.findByOrganization_OrgId(orgId);
        if (integration.isPresent() && integration.get().getAccessTokenEnc() != null) {
            String roundStr = roundNumber != null ? " | Round " + roundNumber : "";
            String newTitle = String.format("%s | Match %d%s", tournamentName, matchNumber, roundStr);
            // Simulate YouTube API call to update live broadcast title
            System.out.println("[YouTube API Mock] Updating Live Stream Title for Org " + orgId + " to: " + newTitle);
        }
    }

    public void updateStreamTitleForTournamentEnd(String orgId, String tournamentName) {
        Optional<YoutubeIntegration> integration = youtubeIntegrationRepository.findByOrganization_OrgId(orgId);
        if (integration.isPresent() && integration.get().getAccessTokenEnc() != null) {
            String newTitle = String.format("%s | Grand Finale Highlights", tournamentName);
            // Simulate YouTube API call to update live broadcast title
            System.out.println("[YouTube API Mock] Updating Live Stream Title for Org " + orgId + " to: " + newTitle);
        }
    }

    private YoutubeIntegrationDto mapToDto(YoutubeIntegration integration) {
        boolean isExpired = integration.getTokenExpiry() != null && integration.getTokenExpiry().isBefore(LocalDateTime.now());
        
        return YoutubeIntegrationDto.builder()
                .integrationId(integration.getIntegrationId())
                .orgId(integration.getOrganization().getOrgId())
                .youtubeChannelId(integration.getYoutubeChannelId())
                .youtubeChannelName(integration.getYoutubeChannelName())
                .tokenExpired(isExpired)
                .connectedAt(integration.getCreatedAt())
                .build();
    }
}

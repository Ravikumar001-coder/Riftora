package com.gameverse.modules.sponsor.service;

import com.gameverse.modules.sponsor.dto.SponsorDto;
import com.gameverse.modules.sponsor.dto.TournamentSponsorDto;
import com.gameverse.modules.sponsor.dto.SponsorReportDto;
import com.gameverse.modules.sponsor.entity.Sponsor;
import com.gameverse.modules.sponsor.entity.TournamentSponsor;
import com.gameverse.modules.sponsor.repository.SponsorRepository;
import com.gameverse.modules.sponsor.repository.TournamentSponsorRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SponsorService {

    private final SponsorRepository sponsorRepository;
    private final TournamentSponsorRepository tournamentSponsorRepository;

    @Transactional(readOnly = true)
    public List<SponsorDto> getSponsorsByOrg(String orgId) {
        return sponsorRepository.findByOrgId(orgId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public SponsorDto createSponsor(String orgId, SponsorDto dto) {
        Sponsor sponsor = Sponsor.builder()
                .orgId(orgId)
                .name(dto.getName())
                .logoUrl(dto.getLogoUrl())
                .tier(dto.getTier())
                .websiteUrl(dto.getWebsiteUrl())
                .contactEmail(dto.getContactEmail())
                .build();
        return mapToDto(sponsorRepository.save(sponsor));
    }

    @Transactional(readOnly = true)
    public List<TournamentSponsorDto> getTournamentSponsors(String tournamentId) {
        return tournamentSponsorRepository.findByTournamentId(tournamentId).stream()
                .map(this::mapToTournamentSponsorDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TournamentSponsorDto assignSponsorToTournament(String tournamentId, String sponsorId, boolean optOutGraphics, boolean optOutStream) {
        Sponsor sponsor = sponsorRepository.findById(sponsorId)
                .orElseThrow(() -> new IllegalArgumentException("Sponsor not found"));

        TournamentSponsor ts = TournamentSponsor.builder()
                .tournamentId(tournamentId)
                .sponsor(sponsor)
                .optOutGraphics(optOutGraphics)
                .optOutStream(optOutStream)
                .impressionsPage(0)
                .impressionsStream(0)
                .build();
        
        return mapToTournamentSponsorDto(tournamentSponsorRepository.save(ts));
    }

    @Transactional(readOnly = true)
    public SponsorReportDto getSponsorReport(String tournamentId, String sponsorId) {
        TournamentSponsor ts = tournamentSponsorRepository.findByTournamentId(tournamentId).stream()
                .filter(s -> s.getSponsor().getId().equals(sponsorId))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Tournament Sponsor assignment not found"));

        SponsorReportDto report = new SponsorReportDto();
        report.setSponsorId(sponsorId);
        report.setSponsorName(ts.getSponsor().getName());
        report.setLogoUrl(ts.getSponsor().getLogoUrl());
        report.setTournamentId(tournamentId);
        report.setTournamentName("Sponsorship Tournament"); // Mocked name, in reality fetch from Tournament repo
        report.setImpressionsPage(ts.getImpressionsPage() + 4520); // Mocked data
        report.setImpressionsStream(ts.getImpressionsStream() + 12500); // Mocked data
        report.setStreamPeakViewers(1500);
        report.setStreamAverageViewers(850);
        report.setStreamDurationMinutes(180);
        report.setTotalTeams(64);
        report.setTotalUniquePlayers(256);
        
        return report;
    }

    private SponsorDto mapToDto(Sponsor entity) {
        SponsorDto dto = new SponsorDto();
        dto.setId(entity.getId());
        dto.setOrgId(entity.getOrgId());
        dto.setName(entity.getName());
        dto.setLogoUrl(entity.getLogoUrl());
        dto.setTier(entity.getTier());
        dto.setWebsiteUrl(entity.getWebsiteUrl());
        dto.setContactEmail(entity.getContactEmail());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    private TournamentSponsorDto mapToTournamentSponsorDto(TournamentSponsor entity) {
        TournamentSponsorDto dto = new TournamentSponsorDto();
        dto.setId(entity.getId());
        dto.setTournamentId(entity.getTournamentId());
        dto.setSponsor(mapToDto(entity.getSponsor()));
        dto.setOptOutGraphics(entity.isOptOutGraphics());
        dto.setOptOutStream(entity.isOptOutStream());
        dto.setImpressionsPage(entity.getImpressionsPage());
        dto.setImpressionsStream(entity.getImpressionsStream());
        return dto;
    }
}

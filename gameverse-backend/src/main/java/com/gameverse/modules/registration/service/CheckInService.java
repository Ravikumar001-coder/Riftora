package com.gameverse.modules.registration.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.registration.dto.CheckInDto;
import com.gameverse.modules.registration.dto.CheckInRequest;
import com.gameverse.modules.registration.dto.CheckInStatsDto;
import com.gameverse.modules.registration.entity.CheckIn;
import com.gameverse.modules.registration.entity.CheckIn.CheckinType;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.CheckInRepository;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CheckInService {

    private final CheckInRepository checkInRepository;
    private final RegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    @Transactional
    public CheckInDto performCheckIn(CheckInRequest request, String userId, CheckinType checkinType, String ipAddress) {
        Registration registration = registrationRepository.findById(request.getRegistrationId())
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));

        if (!registration.getStatus().equals(Registration.RegistrationStatus.approved)) {
            throw new IllegalStateException("Registration is not approved");
        }

        Tournament tournament = tournamentRepository.findById(request.getTournamentId())
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        if (!tournament.getStatus().equals(Tournament.TournamentStatus.check_in)) {
            throw new IllegalStateException("Check-in window is not open for this tournament");
        }

        if (checkInRepository.findByRegistration_RegistrationId(registration.getRegistrationId()).isPresent()) {
            throw new IllegalStateException("Team is already checked in");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        CheckIn checkIn = new CheckIn();
        checkIn.setRegistration(registration);
        checkIn.setTournament(tournament);
        checkIn.setCheckedInBy(user);
        checkIn.setCheckinType(checkinType);
        checkIn.setIpAddress(ipAddress);
        
        CheckIn saved = checkInRepository.save(checkIn);
        
        return mapToDto(saved);
    }

    @Transactional(readOnly = true)
    public CheckInStatsDto getCheckInStats(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        List<Registration> allApproved = registrationRepository.findByTournament_TournamentId(tournamentId, org.springframework.data.domain.Pageable.unpaged()).getContent().stream()
                .filter(r -> r.getStatus() == Registration.RegistrationStatus.approved)
                .collect(Collectors.toList());

        List<CheckIn> checkIns = checkInRepository.findByTournament_TournamentId(tournamentId);

        int totalConfirmed = allApproved.size();
        int checkedInCount = checkIns.size();
        
        long noShowCount = 0; // Requires MatchSlot implementation which we will do in match ops
        
        boolean isOpen = tournament.getStatus() == Tournament.TournamentStatus.check_in;
        Long minsToDeadline = null;
        if (isOpen && tournament.getCheckinCloseMins() != null) {
            LocalDateTime closeTime = tournament.getStartDate()
                    .minusMinutes(tournament.getCheckinCloseMins());
            minsToDeadline = ChronoUnit.MINUTES.between(LocalDateTime.now(), closeTime);
        }

        return CheckInStatsDto.builder()
                .totalConfirmedTeams(totalConfirmed)
                .checkedInCount(checkedInCount)
                .notCheckedInCount(totalConfirmed - checkedInCount)
                .noShowCount((int) noShowCount)
                .checkInWindowOpen(isOpen)
                .minutesToDeadline(minsToDeadline)
                .build();
    }

    private CheckInDto mapToDto(CheckIn checkIn) {
        return CheckInDto.builder()
                .checkinId(checkIn.getCheckinId())
                .registrationId(checkIn.getRegistration().getRegistrationId())
                .tournamentId(checkIn.getTournament().getTournamentId())
                .teamName(checkIn.getRegistration().getTeam().getTeamName())
                .checkedInByUserId(checkIn.getCheckedInBy().getUserId())
                .checkedInByUserName(checkIn.getCheckedInBy().getDisplayName())
                .checkinType(checkIn.getCheckinType())
                .checkinAt(checkIn.getCheckinAt())
                .ipAddress(checkIn.getIpAddress())
                .build();
    }

    @Transactional
    public void markNoShow(String tournamentId, String registrationId, String action, String actorId) {
        // FR-09-006 & FR-09-007 implementation
        
        Registration registration = registrationRepository.findById(registrationId)
                .orElseThrow(() -> new IllegalArgumentException("Registration not found"));
        
        if (!registration.getTournament().getTournamentId().equals(tournamentId)) {
            throw new IllegalArgumentException("Registration doesn't belong to this tournament");
        }

        // Normally, this would interact with a MatchOpsService or MatchScheduleGeneratorService
        // to find all MatchSlots for this registration, update their noShow = true,
        // and optionally promote a waitlisted team or mark as bye.
        
        // For demonstration of the API side-effects we will update the registration status
        // to essentially drop them from the tournament
        registration.setStatus(Registration.RegistrationStatus.withdrawn);
        registrationRepository.save(registration);
        
        // In reality, this communicates with the match slots
        // matchSlotRepository.findByRegistration(registration).forEach(slot -> {
        //     slot.setNoShow(true);
        //     slot.setNoShowAt(LocalDateTime.now());
        // });
        
        if ("PROMOTE_WAITLIST".equalsIgnoreCase(action)) {
            // Find next waitlisted team and change to approved
            registrationRepository.findByTournament_TournamentId(tournamentId, org.springframework.data.domain.Pageable.unpaged())
                .getContent().stream()
                .filter(r -> r.getStatus() == Registration.RegistrationStatus.waitlisted)
                .min((r1, r2) -> r1.getCreatedAt().compareTo(r2.getCreatedAt()))
                .ifPresent(promoted -> {
                    promoted.setStatus(Registration.RegistrationStatus.approved);
                    registrationRepository.save(promoted);
                });
        }
    }
}

package com.gameverse.modules.match.service;

import com.gameverse.modules.match.entity.Match;
import com.gameverse.modules.match.entity.MatchSlot;
import com.gameverse.modules.match.repository.MatchRepository;
import com.gameverse.modules.match.repository.MatchSlotRepository;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MatchScheduleGeneratorService {

    private final MatchRepository matchRepository;
    private final MatchSlotRepository matchSlotRepository;
    private final RegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;

    @Transactional
    public List<Match> generateSchedule(String tournamentId, int teamsPerMatch, int totalRounds, int matchesPerRound, String format, int bufferMinutes, int avgMatchDurationMinutes, LocalDateTime startTime, boolean randomizeSlotsEachRound) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        List<Registration> confirmedTeams = registrationRepository.findByTournament_TournamentId(
            tournamentId, org.springframework.data.domain.Pageable.unpaged()
        ).getContent().stream()
         .filter(r -> r.getStatus() == Registration.RegistrationStatus.approved)
         .toList();

        int totalTeams = confirmedTeams.size();
        if (totalTeams > totalRounds * matchesPerRound * teamsPerMatch) {
            throw new RuntimeException("Not enough matches to accommodate all teams");
        }

        List<Match> generatedMatches = new ArrayList<>();
        List<Registration> shuffledTeams = new ArrayList<>(confirmedTeams);
        
        if ("RANDOM".equalsIgnoreCase(format)) {
            Collections.shuffle(shuffledTeams);
        }
        
        int teamIndex = 0;
        int matchCount = 1;
        LocalDateTime currentMatchTime = startTime;

        for (int round = 1; round <= totalRounds; round++) {
            if (randomizeSlotsEachRound && round > 1) {
                Collections.shuffle(shuffledTeams);
            }
            teamIndex = 0; // Reset for each round if we are repeating matches? Wait, if we shuffle and reset teamIndex to 0 for EACH round, they play multiple rounds against the same/different teams. But in a multi-round setup without groups, this acts as assigning ALL teams across the round's matches.
            
            for (int matchNum = 1; matchNum <= matchesPerRound; matchNum++) {
                Match match = new Match();
                match.setTournament(tournament);
                match.setMatchNumber(matchCount++);
                match.setRoundNumber(round);
                match.setMatchLabel("Round " + round + " - Match " + matchNum);
                match.setScheduledStart(currentMatchTime);
                match.setStatus(Match.MatchStatus.scheduled);
                match = matchRepository.save(match);
                generatedMatches.add(match);
                
                currentMatchTime = currentMatchTime.plusMinutes(avgMatchDurationMinutes + bufferMinutes);

                // Assign slots for this match
                for (int slotNum = 1; slotNum <= teamsPerMatch; slotNum++) {
                    if (teamIndex < shuffledTeams.size()) {
                        MatchSlot slot = new MatchSlot();
                        slot.setMatch(match);
                        slot.setTeam(shuffledTeams.get(teamIndex).getTeam());
                        slot.setSlotNumber(slotNum);
                        matchSlotRepository.save(slot);
                        teamIndex++;
                    } else if ("LEAGUE".equalsIgnoreCase(format)) {
                        // Insert BYE if needed, omitted for now since we just leave it empty
                    }
                }
            }
        }
        
        // For Group Stage we would do something different, this is basic Random allocation
        return generatedMatches;
    }
}

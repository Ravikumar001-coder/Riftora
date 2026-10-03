package com.gameverse.modules.leaderboard.service;

import com.gameverse.core.websocket.WebSocketEventPublisher;
import com.gameverse.modules.leaderboard.dto.LeaderboardDto;
import com.gameverse.modules.leaderboard.entity.LeaderboardEntry;
import com.gameverse.modules.leaderboard.repository.LeaderboardEntryRepository;
import com.gameverse.modules.registration.entity.Registration;
import com.gameverse.modules.registration.repository.RegistrationRepository;
import com.gameverse.modules.result.entity.PlayerMatchScore;
import com.gameverse.modules.result.entity.TeamMatchScore;
import com.gameverse.modules.result.repository.TeamMatchScoreRepository;
import com.gameverse.modules.tournament.repository.TournamentGroupRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import com.gameverse.core.events.LeaderboardRecalculationEvent;
import org.springframework.context.event.EventListener;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;
import java.util.stream.Collectors;
import com.gameverse.modules.leaderboard.dto.LeaderboardSimulationRequestDto;
import com.gameverse.modules.leaderboard.repository.LeaderboardSnapshotRepository;
import com.gameverse.modules.leaderboard.entity.LeaderboardSnapshot;
import com.gameverse.modules.tournament.entity.LeaderboardConfig;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final LeaderboardEntryRepository leaderboardEntryRepository;
    private final WebSocketEventPublisher webSocketEventPublisher;
    private final TeamMatchScoreRepository teamMatchScoreRepository;
    private final RegistrationRepository registrationRepository;
    private final TournamentRepository tournamentRepository;
    private final TournamentGroupRepository tournamentGroupRepository;
    private final LeaderboardSnapshotRepository leaderboardSnapshotRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @EventListener
    public void handleLeaderboardRecalculation(LeaderboardRecalculationEvent event) {
        calculateLeaderboard(event.getTournamentId());
    }

    @Transactional
    @CacheEvict(value = "leaderboard", key = "#tournamentId")
    public void calculateLeaderboard(String tournamentId) {
        var tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        // 1. Fetch old entries to calculate rank change
        List<LeaderboardEntry> oldEntries = leaderboardEntryRepository.findByTournament_TournamentIdOrderByCurrentRankAsc(tournamentId);
        Map<String, Integer> oldRankMap = oldEntries.stream()
                .collect(Collectors.toMap(e -> e.getTeam().getTeamId(), LeaderboardEntry::getCurrentRank));

        // 2. Fetch approved registrations
        List<Registration> registrations = registrationRepository.findByTournament_TournamentIdAndStatus(tournamentId, Registration.RegistrationStatus.approved);

        // 3. Fetch verified match scores
        List<TeamMatchScore> scores = teamMatchScoreRepository.findVerifiedScoresByTournamentId(tournamentId);

        // Group by teamId
        Map<String, List<TeamMatchScore>> scoresByTeam = scores.stream()
                .collect(Collectors.groupingBy(s -> s.getTeam().getTeamId()));

        List<LeaderboardEntry> newEntries = buildTransientEntries(tournament, registrations, scoresByTeam, oldRankMap);

        for (LeaderboardEntry current : newEntries) {
            LeaderboardEntry dbEntry = oldEntries.stream()
                    .filter(e -> e.getTeam().getTeamId().equals(current.getTeam().getTeamId()))
                    .findFirst()
                    .orElse(new LeaderboardEntry());
            
            dbEntry.setTournament(current.getTournament());
            dbEntry.setRegistration(current.getRegistration());
            dbEntry.setTeam(current.getTeam());
            dbEntry.setTotalPoints(current.getTotalPoints());
            dbEntry.setTotalKills(current.getTotalKills());
            dbEntry.setChickenDinners(current.getChickenDinners());
            dbEntry.setTotalMatches(current.getTotalMatches());
            dbEntry.setHighestKillGame(current.getHighestKillGame());
            dbEntry.setBestSingleMatchPoints(current.getBestSingleMatchPoints());
            dbEntry.setTotalDamage(current.getTotalDamage());
            dbEntry.setBestSingleMatchRank(current.getBestSingleMatchRank());
            dbEntry.setLastPlaceFinishes(current.getLastPlaceFinishes());
            dbEntry.setAvgPlacement(current.getAvgPlacement());
            dbEntry.setCurrentRank(current.getCurrentRank());
            dbEntry.setPreviousRank(current.getPreviousRank());
            dbEntry.setRankChange(current.getRankChange());
            
            leaderboardEntryRepository.save(dbEntry);
        }
        
        publishLeaderboard(tournamentId);
    }

    private List<LeaderboardEntry> buildTransientEntries(
            com.gameverse.modules.tournament.entity.Tournament tournament,
            List<Registration> registrations,
            Map<String, List<TeamMatchScore>> scoresByTeam,
            Map<String, Integer> oldRankMap) {
        
        List<LeaderboardEntry> newEntries = new ArrayList<>();

        for (Registration reg : registrations) {
            String teamId = reg.getTeam().getTeamId();
            List<TeamMatchScore> teamScores = scoresByTeam.getOrDefault(teamId, new ArrayList<>());

            LeaderboardEntry entry = new LeaderboardEntry();

            if (entry.getEntryId() == null) {
                entry.setTournament(tournament);
                entry.setRegistration(reg);
                entry.setTeam(reg.getTeam());
            }

            // Calculate aggregations
            BigDecimal totalPoints = teamScores.stream()
                    .map(TeamMatchScore::getTotalPoints)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
                    
            int totalKills = teamScores.stream()
                    .mapToInt(TeamMatchScore::getEffectiveKills)
                    .sum();
                    
            int chickenDinners = (int) teamScores.stream()
                    .filter(TeamMatchScore::getIsChickenDinner)
                    .count();
                    
            int highestKillGame = teamScores.stream()
                    .mapToInt(TeamMatchScore::getEffectiveKills)
                    .max().orElse(0);

            BigDecimal bestSingleMatchPoints = teamScores.stream()
                    .map(TeamMatchScore::getTotalPoints)
                    .max(Comparator.naturalOrder()).orElse(BigDecimal.ZERO);

            BigDecimal totalDamage = teamScores.stream()
                    .flatMap(s -> s.getPlayerScores().stream())
                    .filter(Objects::nonNull)
                    .map(PlayerMatchScore::getDamage)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            Integer bestSingleMatchRank = teamScores.stream()
                    .map(TeamMatchScore::getPlacement)
                    .min(Comparator.naturalOrder())
                    .orElse(null);

            Integer teamsPerMatch = tournament.getTeamsPerMatch();
            int lastPlaceFinishes = 0;
            if (teamsPerMatch != null) {
                lastPlaceFinishes = (int) teamScores.stream()
                        .filter(s -> s.getPlacement() != null && s.getPlacement() >= teamsPerMatch)
                        .count();
            }

            BigDecimal avgPlacement = BigDecimal.ZERO;
            if (!teamScores.isEmpty()) {
                double avg = teamScores.stream().mapToInt(TeamMatchScore::getPlacement).average().orElse(0);
                avgPlacement = new BigDecimal(avg).setScale(2, RoundingMode.HALF_UP);
            }

            entry.setTotalPoints(totalPoints);
            entry.setTotalKills(totalKills);
            entry.setChickenDinners(chickenDinners);
            entry.setTotalMatches(teamScores.size());
            entry.setHighestKillGame(highestKillGame);
            entry.setBestSingleMatchPoints(bestSingleMatchPoints);
            entry.setTotalDamage(totalDamage);
            entry.setBestSingleMatchRank(bestSingleMatchRank);
            entry.setAvgPlacement(avgPlacement);
            entry.setLastPlaceFinishes(lastPlaceFinishes);
            
            // Build match breakdowns
            List<LeaderboardDto.MatchScoreBreakdownDto> breakdowns = teamScores.stream()
                    .map(s -> LeaderboardDto.MatchScoreBreakdownDto.builder()
                            .matchId(s.getMatchResult().getMatch().getMatchId())
                            .matchNumber(s.getMatchResult().getMatch().getMatchNumber())
                            .roundNumber(s.getMatchResult().getMatch().getRoundNumber())
                            .placement(s.getPlacement())
                            .kills(s.getEffectiveKills())
                            .pointsEarned(s.getTotalPoints())
                            .build())
                    .collect(Collectors.toList());
            entry.setMatchBreakdowns(breakdowns);

            newEntries.add(entry);
        }

        // 4. Sort entries using Tiebreaker logic
        List<com.gameverse.modules.tournament.entity.Tournament.TiebreakerRule> rules = tournament.getTiebreakerSequence();
        if (rules == null || rules.isEmpty()) {
            rules = Arrays.asList(
                    com.gameverse.modules.tournament.entity.Tournament.TiebreakerRule.CHICKEN_DINNERS,
                    com.gameverse.modules.tournament.entity.Tournament.TiebreakerRule.TOTAL_KILLS,
                    com.gameverse.modules.tournament.entity.Tournament.TiebreakerRule.BEST_SINGLE_MATCH_POINTS
            );
        }

        Comparator<LeaderboardEntry> tiebreaker = Comparator.comparing(LeaderboardEntry::getTotalPoints).reversed();
        
        for (var rule : rules) {
            switch (rule) {
                case TOTAL_POINTS:
                    // Handled as primary sort by default
                    break;
                case CHICKEN_DINNERS:
                    tiebreaker = tiebreaker.thenComparing(LeaderboardEntry::getChickenDinners).reversed();
                    break;
                case TOTAL_KILLS:
                    tiebreaker = tiebreaker.thenComparing(LeaderboardEntry::getTotalKills).reversed();
                    break;
                case TOTAL_DAMAGE:
                    tiebreaker = tiebreaker.thenComparing(LeaderboardEntry::getTotalDamage).reversed();
                    break;
                case BEST_SINGLE_MATCH_RANK:
                    tiebreaker = tiebreaker.thenComparing(LeaderboardEntry::getBestSingleMatchRank, Comparator.nullsLast(Comparator.naturalOrder()));
                    break;
                case BEST_SINGLE_MATCH_POINTS:
                    tiebreaker = tiebreaker.thenComparing(LeaderboardEntry::getBestSingleMatchPoints).reversed();
                    break;
                case FEWEST_LAST_PLACE_FINISHES:
                    tiebreaker = tiebreaker.thenComparing(LeaderboardEntry::getLastPlaceFinishes);
                    break;
                case HEAD_TO_HEAD:
                    // Head to head compares average placement in matches where both teams played.
                    tiebreaker = tiebreaker.thenComparing((e1, e2) -> {
                        String t1 = e1.getTeam().getTeamId();
                        String t2 = e2.getTeam().getTeamId();
                        List<TeamMatchScore> s1 = scoresByTeam.getOrDefault(t1, new ArrayList<>());
                        List<TeamMatchScore> s2 = scoresByTeam.getOrDefault(t2, new ArrayList<>());
                        
                        Set<String> commonMatches = s1.stream().map(s -> s.getMatchResult().getResultId()).collect(Collectors.toSet());
                        commonMatches.retainAll(s2.stream().map(s -> s.getMatchResult().getResultId()).collect(Collectors.toSet()));
                        
                        if (commonMatches.isEmpty()) return 0;
                        
                        double avg1 = s1.stream().filter(s -> commonMatches.contains(s.getMatchResult().getResultId())).mapToInt(TeamMatchScore::getPlacement).average().orElse(0);
                        double avg2 = s2.stream().filter(s -> commonMatches.contains(s.getMatchResult().getResultId())).mapToInt(TeamMatchScore::getPlacement).average().orElse(0);
                        
                        return Double.compare(avg1, avg2); // Lower placement is better
                    });
                    break;
            }
        }
        tiebreaker = tiebreaker.thenComparing(e -> e.getTeam().getTeamName()); // Alphabetical fallback

        newEntries.sort(tiebreaker);

        // 5. Assign ranks with tie handling
        int currentRank = 1;
        int tieCount = 0;
        LeaderboardEntry prev = null;
        
        for (LeaderboardEntry current : newEntries) {
            // A "true tie" occurs if tiebreaker evaluates to 0 (excluding the alphabetical fallback)
            boolean isTied = false;
            if (prev != null) {
                // We create a comparator identical to tiebreaker but WITHOUT the alphabetical fallback
                Comparator<LeaderboardEntry> strictTiebreaker = Comparator.comparing(LeaderboardEntry::getTotalPoints).reversed();
                for (var rule : rules) {
                    switch (rule) {
                        case TOTAL_POINTS: break;
                        case CHICKEN_DINNERS: strictTiebreaker = strictTiebreaker.thenComparing(LeaderboardEntry::getChickenDinners).reversed(); break;
                        case TOTAL_KILLS: strictTiebreaker = strictTiebreaker.thenComparing(LeaderboardEntry::getTotalKills).reversed(); break;
                        case TOTAL_DAMAGE: strictTiebreaker = strictTiebreaker.thenComparing(LeaderboardEntry::getTotalDamage).reversed(); break;
                        case BEST_SINGLE_MATCH_RANK: strictTiebreaker = strictTiebreaker.thenComparing(LeaderboardEntry::getBestSingleMatchRank, Comparator.nullsLast(Comparator.naturalOrder())); break;
                        case BEST_SINGLE_MATCH_POINTS: strictTiebreaker = strictTiebreaker.thenComparing(LeaderboardEntry::getBestSingleMatchPoints).reversed(); break;
                        case FEWEST_LAST_PLACE_FINISHES: strictTiebreaker = strictTiebreaker.thenComparing(LeaderboardEntry::getLastPlaceFinishes); break;
                        case HEAD_TO_HEAD:
                            strictTiebreaker = strictTiebreaker.thenComparing((e1, e2) -> {
                                String t1 = e1.getTeam().getTeamId();
                                String t2 = e2.getTeam().getTeamId();
                                List<TeamMatchScore> s1 = scoresByTeam.getOrDefault(t1, new ArrayList<>());
                                List<TeamMatchScore> s2 = scoresByTeam.getOrDefault(t2, new ArrayList<>());
                                Set<String> commonMatches = s1.stream().map(s -> s.getMatchResult().getResultId()).collect(Collectors.toSet());
                                commonMatches.retainAll(s2.stream().map(s -> s.getMatchResult().getResultId()).collect(Collectors.toSet()));
                                if (commonMatches.isEmpty()) return 0;
                                double avg1 = s1.stream().filter(s -> commonMatches.contains(s.getMatchResult().getResultId())).mapToInt(TeamMatchScore::getPlacement).average().orElse(0);
                                double avg2 = s2.stream().filter(s -> commonMatches.contains(s.getMatchResult().getResultId())).mapToInt(TeamMatchScore::getPlacement).average().orElse(0);
                                return Double.compare(avg1, avg2);
                            });
                            break;
                    }
                }
                isTied = strictTiebreaker.compare(prev, current) == 0;
            }
            
            if (isTied) {
                current.setCurrentRank(prev.getCurrentRank());
                tieCount++;
            } else {
                currentRank += tieCount;
                current.setCurrentRank(currentRank);
                tieCount = 1;
            }
            
            Integer oldRank = oldRankMap.get(current.getTeam().getTeamId());
            if (oldRank != null) {
                current.setPreviousRank(oldRank);
                current.setRankChange(oldRank - current.getCurrentRank());
            } else {
                current.setPreviousRank(null);
                current.setRankChange(0);
            }
            
            prev = current;
        }

        return newEntries;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = "leaderboard", key = "#tournamentId")
    public LeaderboardDto getLeaderboard(String tournamentId) {
        List<LeaderboardEntry> entries = leaderboardEntryRepository.findByTournament_TournamentIdOrderByCurrentRankAsc(tournamentId);
        
        List<LeaderboardDto.LeaderboardEntryDto> entryDtos = entries.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
                
        return LeaderboardDto.builder()
                .tournamentId(tournamentId)
                .entries(entryDtos)
                .build();
    }

    @Transactional(readOnly = true)
    public LeaderboardDto getRoundLeaderboard(String tournamentId, String roundIdStr) {
        Integer roundId = Integer.parseInt(roundIdStr);
        return getFilteredLeaderboard(tournamentId, s -> s.getMatchResult().getMatch().getRoundNumber().equals(roundId));
    }

    @Transactional(readOnly = true)
    public LeaderboardDto getGroupLeaderboard(String tournamentId, String groupId) {
        LeaderboardDto dto = getFilteredLeaderboard(tournamentId, s -> s.getMatchResult().getMatch().getTournamentGroup() != null && s.getMatchResult().getMatch().getTournamentGroup().getGroupId().equals(groupId));
        
        tournamentGroupRepository.findById(groupId)
                .ifPresent(g -> dto.setAdvancementSpots(g.getAdvancementSpots()));
                
        return dto;
    }

    @Transactional(readOnly = true)
    public LeaderboardDto getMatchLeaderboard(String tournamentId, String matchId) {
        return getFilteredLeaderboard(tournamentId, s -> s.getMatchResult().getMatch().getMatchId().equals(matchId));
    }

    private LeaderboardDto getFilteredLeaderboard(String tournamentId, java.util.function.Predicate<TeamMatchScore> filter) {
        var tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        List<Registration> registrations = registrationRepository.findByTournament_TournamentIdAndStatus(tournamentId, Registration.RegistrationStatus.approved);
        List<TeamMatchScore> allScores = teamMatchScoreRepository.findVerifiedScoresByTournamentId(tournamentId);
        
        Map<String, List<TeamMatchScore>> filteredScoresByTeam = allScores.stream()
                .filter(filter)
                .collect(Collectors.groupingBy(s -> s.getTeam().getTeamId()));

        List<LeaderboardEntry> transientEntries = buildTransientEntries(tournament, registrations, filteredScoresByTeam, Collections.emptyMap());

        List<LeaderboardDto.LeaderboardEntryDto> entryDtos = transientEntries.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        return LeaderboardDto.builder()
                .tournamentId(tournamentId)
                .entries(entryDtos)
                .build();
    }

    @Transactional(readOnly = true)
    public void publishLeaderboard(String tournamentId) {
        LeaderboardDto leaderboard = getLeaderboard(tournamentId);
        
        Map<String, Object> payload = new HashMap<>();
        payload.put("event", "leaderboard_updated");
        payload.put("tournament_id", tournamentId);
        payload.put("leaderboard", leaderboard.getEntries());
        payload.put("advancementSpots", leaderboard.getAdvancementSpots());
        
        webSocketEventPublisher.broadcastLeaderboard(tournamentId, payload);
    }

    private LeaderboardDto.LeaderboardEntryDto mapToDto(LeaderboardEntry e) {
        return LeaderboardDto.LeaderboardEntryDto.builder()
                .teamId(e.getTeam().getTeamId())
                .teamName(e.getTeam().getTeamName())
                .currentRank(e.getCurrentRank())
                .previousRank(e.getPreviousRank())
                .rankChange(e.getRankChange())
                .totalPoints(e.getTotalPoints())
                .totalKills(e.getTotalKills())
                .totalMatches(e.getTotalMatches())
                .chickenDinners(e.getChickenDinners())
                .avgPlacement(e.getAvgPlacement())
                .highestKillGame(e.getHighestKillGame())
                .bestSingleMatchPoints(e.getBestSingleMatchPoints())
                .totalDamage(e.getTotalDamage())
                .bestSingleMatchRank(e.getBestSingleMatchRank())
                .lastPlaceFinishes(e.getLastPlaceFinishes())
                .isEliminated(e.getIsEliminated())
                .teamTag(e.getTeam().getTeamTag())
                .logoUrl(e.getTeam().getLogoUrl())
                .matchBreakdowns(e.getMatchBreakdowns())
                .build();
    }

    @Transactional(readOnly = true)
    public LeaderboardDto simulateLeaderboard(String tournamentId, LeaderboardSimulationRequestDto request) {
        com.gameverse.modules.tournament.entity.Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));

        List<Registration> registrations = registrationRepository.findByTournament_TournamentIdAndStatus(tournamentId, Registration.RegistrationStatus.approved);

        List<TeamMatchScore> rawScores = teamMatchScoreRepository.findVerifiedScoresByTournamentId(tournamentId);

        // Group into a modifiable list
        Map<String, List<TeamMatchScore>> scoresByTeam = rawScores.stream()
                .collect(Collectors.groupingBy(s -> s.getTeam().getTeamId(), Collectors.toList()));

        com.gameverse.modules.scoring.model.ScoringTemplate scoring = tournament.getScoringTemplate();
        Map<Integer, BigDecimal> placementPointsMap = scoring.getPlacementPoints().stream()
                .collect(Collectors.toMap(com.gameverse.modules.scoring.model.PlacementPoint::getPlacement, com.gameverse.modules.scoring.model.PlacementPoint::getPoints));
        BigDecimal killPoints = scoring.getKillPtsEach() != null ? scoring.getKillPtsEach() : BigDecimal.ONE;

        // Create a mock match
        com.gameverse.modules.match.entity.Match mockMatch = new com.gameverse.modules.match.entity.Match();
        mockMatch.setMatchId("simulated");
        mockMatch.setMatchNumber(999);
        mockMatch.setRoundNumber(999);
        mockMatch.setTournament(tournament);

        com.gameverse.modules.result.entity.MatchResult mockResult = new com.gameverse.modules.result.entity.MatchResult();
        mockResult.setResultId("simulated-result");
        mockResult.setMatch(mockMatch);

        // Add simulated scores
        if (request != null && request.getScores() != null) {
            for (var simScore : request.getScores()) {
                Registration reg = registrations.stream().filter(r -> r.getTeam().getTeamId().equals(simScore.getTeamId())).findFirst().orElse(null);
                if (reg != null) {
                    TeamMatchScore score = new TeamMatchScore();
                    score.setTeam(reg.getTeam());
                    score.setMatchResult(mockResult);
                    score.setPlacement(simScore.getPlacement());
                    score.setEffectiveKills(simScore.getKills());
                    score.setRawKills(simScore.getKills());

                    BigDecimal pp = placementPointsMap.getOrDefault(simScore.getPlacement(), BigDecimal.ZERO);
                    BigDecimal kp = BigDecimal.valueOf(simScore.getKills()).multiply(killPoints);
                    score.setPlacementPoints(pp);
                    score.setKillPoints(kp);
                    score.setTotalPoints(pp.add(kp));
                    score.setIsChickenDinner(simScore.getPlacement() != null && simScore.getPlacement() == 1);

                    List<TeamMatchScore> teamList = scoresByTeam.computeIfAbsent(reg.getTeam().getTeamId(), k -> new ArrayList<>());
                    teamList.add(score);
                }
            }
        }

        Map<String, Integer> oldRankMap = leaderboardEntryRepository.findByTournament_TournamentIdOrderByCurrentRankAsc(tournamentId)
                .stream()
                .collect(Collectors.toMap(e -> e.getTeam().getTeamId(), LeaderboardEntry::getCurrentRank));

        List<LeaderboardEntry> simulatedEntries = buildTransientEntries(tournament, registrations, scoresByTeam, oldRankMap);

        return LeaderboardDto.builder()
                .tournamentId(tournamentId)
                .entries(simulatedEntries.stream().map(this::mapToDto).collect(Collectors.toList()))
                .advancementSpots(0)
                .build();
    }

    @Transactional
    public LeaderboardSnapshot createSnapshot(String tournamentId, Integer roundNumber, Integer matchNumber) {
        com.gameverse.modules.tournament.entity.Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        LeaderboardDto leaderboard = getLeaderboard(tournamentId);

        LeaderboardSnapshot snapshot = new LeaderboardSnapshot();
        snapshot.setTournament(tournament);
        snapshot.setRoundNumber(roundNumber);
        snapshot.setMatchNumber(matchNumber);

        try {
            snapshot.setSnapshotData(objectMapper.writeValueAsString(leaderboard));
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize leaderboard data for snapshot", e);
        }

        return leaderboardSnapshotRepository.save(snapshot);
    }

    @Transactional(readOnly = true)
    public Page<LeaderboardSnapshot> getSnapshots(String tournamentId, Pageable pageable) {
        return leaderboardSnapshotRepository.findByTournament_TournamentIdOrderBySnapshotAtDesc(tournamentId, pageable);
    }

    @Transactional
    public void lockLeaderboard(String tournamentId) {
        com.gameverse.modules.tournament.entity.Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        tournament.setIsLeaderboardLocked(true);
        if (tournament.getStatus() != com.gameverse.modules.tournament.entity.Tournament.TournamentStatus.completed) {
            tournament.setStatus(com.gameverse.modules.tournament.entity.Tournament.TournamentStatus.completed);
            tournament.setCompletedAt(java.time.LocalDateTime.now());
        }
        tournamentRepository.save(tournament);

        publishLeaderboard(tournamentId);
    }

    @Transactional
    public LeaderboardConfig updateLeaderboardConfig(String tournamentId, LeaderboardConfig config) {
        com.gameverse.modules.tournament.entity.Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        tournament.setLeaderboardConfig(config);
        tournamentRepository.save(tournament);

        publishLeaderboard(tournamentId);
        return tournament.getLeaderboardConfig();
    }
}

package com.gameverse.modules.tournament.repository;

import com.gameverse.modules.tournament.dto.TournamentSearchRequest;
import com.gameverse.modules.tournament.entity.Tournament;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class TournamentSpecification {

    public static Specification<Tournament> getTournamentsByCriteria(TournamentSearchRequest request) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.getGameIds() != null && !request.getGameIds().isEmpty()) {
                predicates.add(root.get("game").get("gameId").in(request.getGameIds()));
            }

            if (request.getTiers() != null && !request.getTiers().isEmpty()) {
                predicates.add(root.get("tournamentTier").in(request.getTiers()));
            }

            if (request.getStatuses() != null && !request.getStatuses().isEmpty()) {
                predicates.add(root.get("status").in(request.getStatuses()));
            }

            if (request.getMinEntryFee() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("entryFee"), request.getMinEntryFee()));
            }

            if (request.getMaxEntryFee() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("entryFee"), request.getMaxEntryFee()));
            }

            if (request.getMinPrizePool() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("prizePoolTotal"), request.getMinPrizePool()));
            }

            if (request.getMaxPrizePool() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("prizePoolTotal"), request.getMaxPrizePool()));
            }

            if (request.getRegion() != null && !request.getRegion().isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("region"), request.getRegion()));
            }

            if (request.getStartDateAfter() != null) {
                predicates.add(criteriaBuilder.greaterThanOrEqualTo(root.get("startDate"), request.getStartDateAfter()));
            }

            if (request.getStartDateBefore() != null) {
                predicates.add(criteriaBuilder.lessThanOrEqualTo(root.get("startDate"), request.getStartDateBefore()));
            }
            
            predicates.add(criteriaBuilder.isFalse(root.get("isTemplate")));
            
            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

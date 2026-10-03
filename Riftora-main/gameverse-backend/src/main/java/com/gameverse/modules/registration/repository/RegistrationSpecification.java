package com.gameverse.modules.registration.repository;

import com.gameverse.modules.registration.entity.Registration;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.ArrayList;
import java.util.List;

public class RegistrationSpecification {

    public static Specification<Registration> getRegistrations(String tournamentId, 
                                                               String search, 
                                                               Registration.RegistrationStatus status, 
                                                               Registration.PaymentStatus paymentStatus) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            predicates.add(criteriaBuilder.equal(root.get("tournament").get("tournamentId"), tournamentId));

            if (status != null) {
                predicates.add(criteriaBuilder.equal(root.get("status"), status));
            }

            if (paymentStatus != null) {
                predicates.add(criteriaBuilder.equal(root.get("paymentStatus"), paymentStatus));
            }

            if (search != null && !search.trim().isEmpty()) {
                String likePattern = "%" + search.toLowerCase() + "%";
                Predicate teamNameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("team").get("teamName")), likePattern);
                Predicate captainNameMatch = criteriaBuilder.like(criteriaBuilder.lower(root.get("captain").get("username")), likePattern);
                predicates.add(criteriaBuilder.or(teamNameMatch, captainNameMatch));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }
}

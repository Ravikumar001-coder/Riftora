package com.gameverse.modules.dispute.repository;

import com.gameverse.modules.dispute.entity.DisputeResolution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DisputeResolutionRepository extends JpaRepository<DisputeResolution, String> {
    Optional<DisputeResolution> findByDispute_DisputeId(String disputeId);
}

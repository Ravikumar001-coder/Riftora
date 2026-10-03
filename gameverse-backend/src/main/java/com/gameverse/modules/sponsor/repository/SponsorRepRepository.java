package com.gameverse.modules.sponsor.repository;

import com.gameverse.modules.sponsor.entity.SponsorRep;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SponsorRepRepository extends JpaRepository<SponsorRep, String> {
    List<SponsorRep> findByUserId(String userId);
    List<SponsorRep> findBySponsorId(String sponsorId);
}

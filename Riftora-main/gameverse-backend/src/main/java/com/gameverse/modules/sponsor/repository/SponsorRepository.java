package com.gameverse.modules.sponsor.repository;

import com.gameverse.modules.sponsor.entity.Sponsor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SponsorRepository extends JpaRepository<Sponsor, String> {
    List<Sponsor> findByOrgId(String orgId);
}

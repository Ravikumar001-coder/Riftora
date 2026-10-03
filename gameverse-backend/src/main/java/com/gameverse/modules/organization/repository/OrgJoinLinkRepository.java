package com.gameverse.modules.organization.repository;

import com.gameverse.modules.organization.entity.OrgJoinLink;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OrgJoinLinkRepository extends JpaRepository<OrgJoinLink, String> {
    Optional<OrgJoinLink> findByToken(String token);
}

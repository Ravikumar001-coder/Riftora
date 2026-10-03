package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.DisposableEmailDomain;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DisposableEmailDomainRepository extends JpaRepository<DisposableEmailDomain, String> {
    boolean existsByDomainIgnoreCase(String domain);
}

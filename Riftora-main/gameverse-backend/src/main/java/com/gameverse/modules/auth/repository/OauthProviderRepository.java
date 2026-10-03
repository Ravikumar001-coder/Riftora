package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.OauthProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OauthProviderRepository extends JpaRepository<OauthProvider, String> {
    Optional<OauthProvider> findByProviderAndProviderId(OauthProvider.Provider provider, String providerId);
}

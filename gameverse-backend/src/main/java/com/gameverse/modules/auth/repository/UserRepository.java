package com.gameverse.modules.auth.repository;

import com.gameverse.modules.auth.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findByEmail(String email);
    List<User> findByEmailIn(List<String> emails);
    Optional<User> findByUsername(String username);
    Optional<User> findByMobileNumber(String mobileNumber);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    boolean existsByMobileNumber(String mobileNumber);
    boolean existsByUsernameIgnoreCase(String username);
}

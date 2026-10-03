package com.gameverse.modules.registration.repository;

import com.gameverse.modules.registration.entity.PaymentTransaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, String> {
    Optional<PaymentTransaction> findByGatewayOrderId(String gatewayOrderId);
}

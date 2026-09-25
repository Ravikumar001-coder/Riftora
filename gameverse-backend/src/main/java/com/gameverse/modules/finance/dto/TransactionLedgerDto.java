package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TransactionLedgerDto {
    private String transactionId;
    private String tournamentId;
    private String transactionType;
    private BigDecimal amount;
    private String currency;
    private String status;
    private String referenceId;
    private String targetType;
    private String targetId;
    private String description;
    private LocalDateTime createdAt;
}

package com.gameverse.modules.finance.dto;

import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/** FR-16-019/020: Non-Cash Prize DTO */
@Data
public class NonCashPrizeDto {
    private String prizeId;
    private String posId;
    private String tournamentId;
    private String itemName;
    private String itemDescription;
    private String itemCategory;   // merchandise, peripheral, ingame, voucher
    private Integer quantity;
    private BigDecimal estimatedValue;
    private Boolean requiresShipping;

    // Winner shipping details
    private String winnerName;
    private String winnerAddress;
    private String winnerPhone;
    private String winnerPincode;

    // Dispatch tracking
    private String dispatchStatus;  // pending, dispatched, delivered, failed
    private LocalDateTime dispatchDate;
    private String trackingNumber;
    private String courierName;
    private LocalDateTime deliveredAt;
    private String organizerNote;
}

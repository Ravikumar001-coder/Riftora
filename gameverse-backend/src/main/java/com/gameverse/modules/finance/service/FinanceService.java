package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.dto.TournamentFinancialSummaryDto;
import com.gameverse.modules.finance.dto.TransactionLedgerDto;
import com.gameverse.modules.finance.entity.TransactionLedger;
import com.gameverse.modules.finance.repository.TransactionLedgerRepository;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.PrizePositionRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private final TransactionLedgerRepository ledgerRepository;
    private final TournamentRepository tournamentRepository;
    private final PrizePositionRepository prizePositionRepository;

    @Transactional(readOnly = true)
    public TournamentFinancialSummaryDto getTournamentFinancialSummary(String tournamentId) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));

        List<TransactionLedger> transactions = ledgerRepository.findByTournamentTournamentIdOrderByCreatedAtDesc(tournamentId);

        BigDecimal totalCollected = transactions.stream()
                .filter(t -> "entry_fee".equals(t.getTransactionType()) && "completed".equals(t.getStatus()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal totalRefunded = transactions.stream()
                .filter(t -> "refund".equals(t.getTransactionType()) && "completed".equals(t.getStatus()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal platformFee = transactions.stream()
                .filter(t -> "platform_fee".equals(t.getTransactionType()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal prizePoolDistributed = transactions.stream()
                .filter(t -> "prize_payout".equals(t.getTransactionType()) && ("completed".equals(t.getStatus()) || "processing".equals(t.getStatus())))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal organizerPayout = transactions.stream()
                .filter(t -> "organizer_payout".equals(t.getTransactionType()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        BigDecimal escrowBalance = totalCollected.subtract(totalRefunded).subtract(platformFee).subtract(prizePoolDistributed).subtract(organizerPayout);

        TournamentFinancialSummaryDto dto = new TournamentFinancialSummaryDto();
        dto.setTournamentId(tournamentId);
        dto.setTotalCollected(totalCollected);
        dto.setTotalRefunded(totalRefunded);
        dto.setPlatformFee(platformFee);
        dto.setPrizePool(prizePoolDistributed);
        dto.setOrganizerPayout(organizerPayout);
        dto.setEscrowBalance(escrowBalance);
        return dto;
    }

    @Transactional(readOnly = true)
    public List<TransactionLedgerDto> getTournamentLedger(String tournamentId) {
        return ledgerRepository.findByTournamentTournamentIdOrderByCreatedAtDesc(tournamentId).stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private TransactionLedgerDto mapToDto(TransactionLedger entity) {
        TransactionLedgerDto dto = new TransactionLedgerDto();
        dto.setTransactionId(entity.getTransactionId());
        dto.setTournamentId(entity.getTournament().getTournamentId());
        dto.setTransactionType(entity.getTransactionType());
        dto.setAmount(entity.getAmount());
        dto.setCurrency(entity.getCurrency());
        dto.setStatus(entity.getStatus());
        dto.setReferenceId(entity.getReferenceId());
        dto.setTargetType(entity.getTargetType());
        dto.setTargetId(entity.getTargetId());
        dto.setDescription(entity.getDescription());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }

    @Transactional
    public void recordEntryFeePayment(Tournament tournament, String teamId, BigDecimal entryFeePaid, String paymentTxnId) {
        // Record Entry Fee
        TransactionLedger entryLedger = new TransactionLedger();
        entryLedger.setTournament(tournament);
        entryLedger.setTransactionType("entry_fee");
        entryLedger.setAmount(entryFeePaid);
        entryLedger.setCurrency(tournament.getPrizeCurrency() != null ? tournament.getPrizeCurrency() : "INR");
        entryLedger.setStatus("completed");
        entryLedger.setReferenceId(paymentTxnId);
        entryLedger.setTargetType("team");
        entryLedger.setTargetId(teamId);
        entryLedger.setDescription("Entry fee payment for team " + teamId);
        ledgerRepository.save(entryLedger);

        // Calculate and Record Platform Service Fee (FR-16-003)
        BigDecimal feePercentage;
        switch (tournament.getOrganization().getPlan().getPlanCode()) {
            case free: feePercentage = new BigDecimal("0.08"); break;
            case starter: feePercentage = new BigDecimal("0.06"); break;
            case pro: feePercentage = new BigDecimal("0.05"); break;
            case elite: feePercentage = new BigDecimal("0.04"); break;
            case enterprise: feePercentage = new BigDecimal("0.02"); break;
            default: feePercentage = new BigDecimal("0.08"); break;
        }

        BigDecimal platformFeeAmount = entryFeePaid.multiply(feePercentage).setScale(2, java.math.RoundingMode.HALF_UP);

        if (platformFeeAmount.compareTo(BigDecimal.ZERO) > 0) {
            TransactionLedger feeLedger = new TransactionLedger();
            feeLedger.setTournament(tournament);
            feeLedger.setTransactionType("platform_fee");
            feeLedger.setAmount(platformFeeAmount);
            feeLedger.setCurrency(entryLedger.getCurrency());
            feeLedger.setStatus("completed");
            feeLedger.setReferenceId(entryLedger.getTransactionId()); // Link to entry fee
            feeLedger.setTargetType("platform");
            feeLedger.setTargetId("platform");
            feeLedger.setDescription("Platform service fee (" + feePercentage.multiply(new BigDecimal("100")).stripTrailingZeros() + "%)");
            ledgerRepository.save(feeLedger);
        }
    }
}

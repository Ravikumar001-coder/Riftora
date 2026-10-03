package com.gameverse.modules.finance.service;

import com.gameverse.modules.finance.dto.OrgFinancialDashboardDto;
import com.gameverse.modules.finance.dto.OrgKycDocumentDto;
import com.gameverse.modules.finance.dto.NonCashPrizeDto;
import com.gameverse.modules.finance.dto.MonthlyStatementDto;
import com.gameverse.modules.finance.entity.*;
import com.gameverse.modules.finance.repository.*;
import com.gameverse.modules.organization.entity.Organization;
import com.gameverse.modules.organization.repository.OrganizationRepository;
import com.gameverse.modules.tournament.entity.PrizePosition;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.PrizePositionRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * FR-16-017: Organization KYC.
 * FR-16-018: Tournament Financial Summary (accounting record).
 * FR-16-019/020: Non-Cash Prize Management.
 * FR-16-021: Org Financial Dashboard.
 * FR-16-022: CSV export of ledger.
 * FR-16-023: Monthly financial statements.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class OrgFinancialService {

    private final OrganizationRepository organizationRepository;
    private final TournamentRepository tournamentRepository;
    private final TransactionLedgerRepository ledgerRepository;
    private final OrgKycDocumentRepository kycDocumentRepository;
    private final NonCashPrizeRepository nonCashPrizeRepository;
    private final OrgMonthlyStatementRepository monthlyStatementRepository;
    private final PrizePositionRepository prizePositionRepository;

    // ── FR-16-017: KYC Management ─────────────────────────────────────────────

    @Transactional
    public OrgKycDocumentDto submitKycDocument(String orgId, OrgKycDocumentDto dto) {
        Organization org = organizationRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        OrgKycDocument doc = new OrgKycDocument();
        doc.setOrganization(org);
        doc.setDocType(dto.getDocType());
        doc.setDocNumber(dto.getDocNumber());
        doc.setDocUrl(dto.getDocUrl());
        doc.setStatus("pending");
        kycDocumentRepository.save(doc);

        log.info("KYC document {} submitted for org {}", dto.getDocType(), orgId);
        return mapKycDoc(doc);
    }

    @Transactional(readOnly = true)
    public List<OrgKycDocumentDto> getKycDocuments(String orgId) {
        return kycDocumentRepository.findByOrganizationOrgIdOrderBySubmittedAtDesc(orgId)
                .stream().map(this::mapKycDoc).collect(Collectors.toList());
    }

    @Transactional
    public OrgKycDocumentDto verifyKycDocument(String docId, String adminUserId, boolean approved, String rejectionReason) {
        OrgKycDocument doc = kycDocumentRepository.findById(docId)
                .orElseThrow(() -> new IllegalArgumentException("KYC document not found"));
        doc.setStatus(approved ? "verified" : "rejected");
        doc.setVerifiedBy(adminUserId);
        doc.setVerifiedAt(LocalDateTime.now());
        if (!approved) doc.setRejectionReason(rejectionReason);
        kycDocumentRepository.save(doc);

        // Check if all required docs are verified → update org kyc_status
        String orgId = doc.getOrganization().getOrgId();
        long pending = kycDocumentRepository.countByOrganizationOrgIdAndStatus(orgId, "pending");
        if (pending == 0) {
            long rejected = kycDocumentRepository.countByOrganizationOrgIdAndStatus(orgId, "rejected");
            Organization org = organizationRepository.findById(orgId).orElseThrow();
            org.setKycStatus(rejected > 0 ? Organization.KycStatus.rejected : Organization.KycStatus.approved);
            organizationRepository.save(org);
        }
        return mapKycDoc(doc);
    }

    // ── FR-16-018: Tournament Financial Summary ───────────────────────────────

    @Transactional(readOnly = true)
    public Map<String, Object> getTournamentFinancialSummaryDetailed(String tournamentId) {
        Tournament t = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        List<TransactionLedger> ledgers = ledgerRepository.findByTournamentTournamentIdOrderByCreatedAtDesc(tournamentId);
        List<PrizePosition> positions = prizePositionRepository.findByTournament_TournamentIdOrderByPositionAsc(tournamentId);

        BigDecimal totalCollected = sum(ledgers, "entry_fee", "completed");
        BigDecimal totalRefunded = sum(ledgers, "refund", "completed");
        BigDecimal platformFee = sumAny(ledgers, "platform_fee");
        BigDecimal prizesPaid = sumAny(ledgers, "prize_payout");
        BigDecimal organizerPayout = sumAny(ledgers, "organizer_payout");

        // Registration count from entry fees
        long regCount = ledgers.stream().filter(l -> "entry_fee".equals(l.getTransactionType()) && "completed".equals(l.getStatus())).count();

        List<Map<String, Object>> prizeBreakdown = positions.stream()
                .filter(p -> p.getAmount() != null && p.getAmount().signum() > 0)
                .map(p -> Map.<String, Object>of(
                        "position", p.getPosition(),
                        "label", p.getLabel() != null ? p.getLabel() : "Position " + p.getPosition(),
                        "amount", p.getAmount(),
                        "payoutStatus", p.getPayoutStatus() != null ? p.getPayoutStatus() : "pending",
                        "winnerTeam", p.getWinnerTeam() != null ? p.getWinnerTeam().getTeamName() : "TBD"
                )).collect(Collectors.toList());

        Map<String, Object> result = new java.util.LinkedHashMap<>();
        result.put("tournamentId", tournamentId);
        result.put("tournamentName", t.getName());
        result.put("startDate", t.getStartDate() != null ? t.getStartDate().toString() : "");
        result.put("endDate", t.getEndDate() != null ? t.getEndDate().toString() : "");
        result.put("registrationCount", regCount);
        result.put("totalCollected", totalCollected);
        result.put("totalRefunded", totalRefunded);
        result.put("platformFeeDeducted", platformFee);
        result.put("prizeAmountsDistributed", prizesPaid);
        result.put("organizerNetPayout", organizerPayout);
        result.put("escrowBalance", totalCollected.subtract(totalRefunded).subtract(platformFee).subtract(prizesPaid).subtract(organizerPayout));
        result.put("prizeBreakdown", prizeBreakdown);
        result.put("organizerPayoutReleased", Boolean.TRUE.equals(t.getOrganizerPayoutReleased()));
        return result;
    }

    // ── FR-16-019/020: Non-Cash Prize Management ──────────────────────────────

    @Transactional
    public NonCashPrizeDto addNonCashPrize(String tournamentId, String posId, NonCashPrizeDto dto) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
        PrizePosition pos = prizePositionRepository.findById(posId)
                .orElseThrow(() -> new IllegalArgumentException("Prize position not found"));

        NonCashPrize prize = new NonCashPrize();
        prize.setTournament(tournament);
        prize.setPrizePosition(pos);
        prize.setItemName(dto.getItemName());
        prize.setItemDescription(dto.getItemDescription());
        prize.setItemCategory(dto.getItemCategory());
        prize.setQuantity(dto.getQuantity() != null ? dto.getQuantity() : 1);
        prize.setEstimatedValue(dto.getEstimatedValue());
        prize.setRequiresShipping(Boolean.TRUE.equals(dto.getRequiresShipping()));
        nonCashPrizeRepository.save(prize);

        return mapNonCashPrize(prize);
    }

    @Transactional(readOnly = true)
    public List<NonCashPrizeDto> getNonCashPrizes(String tournamentId) {
        return nonCashPrizeRepository.findByTournamentTournamentIdOrderByCreatedAtDesc(tournamentId)
                .stream().map(this::mapNonCashPrize).collect(Collectors.toList());
    }

    /**
     * FR-16-020: Update shipping details and dispatch status.
     */
    @Transactional
    public NonCashPrizeDto updateDispatchStatus(String prizeId, NonCashPrizeDto dto) {
        NonCashPrize prize = nonCashPrizeRepository.findById(prizeId)
                .orElseThrow(() -> new IllegalArgumentException("Non-cash prize not found"));

        if (dto.getWinnerName() != null) prize.setWinnerName(dto.getWinnerName());
        if (dto.getWinnerAddress() != null) prize.setWinnerAddress(dto.getWinnerAddress());
        if (dto.getWinnerPhone() != null) prize.setWinnerPhone(dto.getWinnerPhone());
        if (dto.getWinnerPincode() != null) prize.setWinnerPincode(dto.getWinnerPincode());
        if (dto.getDispatchStatus() != null) {
            prize.setDispatchStatus(dto.getDispatchStatus());
            if ("dispatched".equals(dto.getDispatchStatus())) {
                prize.setDispatchDate(LocalDateTime.now());
            } else if ("delivered".equals(dto.getDispatchStatus())) {
                prize.setDeliveredAt(LocalDateTime.now());
            }
        }
        if (dto.getTrackingNumber() != null) prize.setTrackingNumber(dto.getTrackingNumber());
        if (dto.getCourierName() != null) prize.setCourierName(dto.getCourierName());
        if (dto.getOrganizerNote() != null) prize.setOrganizerNote(dto.getOrganizerNote());

        nonCashPrizeRepository.save(prize);
        return mapNonCashPrize(prize);
    }

    // ── FR-16-021: Org Financial Dashboard ───────────────────────────────────

    @Transactional(readOnly = true)
    public OrgFinancialDashboardDto getOrgFinancialDashboard(String orgId) {
        organizationRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        List<TransactionLedger> allLedgers = ledgerRepository.findByOrgId(orgId);

        BigDecimal totalRevenue = sum(allLedgers, "entry_fee", "completed");
        BigDecimal totalFeesPaid = sumAny(allLedgers, "platform_fee");
        BigDecimal totalPrizesDistributed = sumAny(allLedgers, "prize_payout");
        BigDecimal totalEarnings = sumAny(allLedgers, "organizer_payout");

        long tournamentCount = allLedgers.stream()
                .map(l -> l.getTournament().getTournamentId())
                .distinct().count();

        long regCount = allLedgers.stream()
                .filter(l -> "entry_fee".equals(l.getTransactionType()) && "completed".equals(l.getStatus()))
                .count();

        // Month-over-month trend (last 6 months)
        List<Map<String, Object>> monthlyTrend = buildMonthlyTrend(allLedgers);

        OrgFinancialDashboardDto dto = new OrgFinancialDashboardDto();
        dto.setOrgId(orgId);
        dto.setTotalRevenue(totalRevenue);
        dto.setTotalFeesPaid(totalFeesPaid);
        dto.setTotalPrizesDistributed(totalPrizesDistributed);
        dto.setTotalEarnings(totalEarnings);
        dto.setTournamentCount((int) tournamentCount);
        dto.setTotalRegistrations((int) regCount);
        dto.setMonthlyTrend(monthlyTrend);
        return dto;
    }

    // ── FR-16-022: CSV Export ─────────────────────────────────────────────────

    @Transactional(readOnly = true)
    public String exportLedgerAsCsv(String tournamentId) {
        List<TransactionLedger> ledgers = ledgerRepository.findByTournamentTournamentIdOrderByCreatedAtDesc(tournamentId);

        StringBuilder csv = new StringBuilder();
        csv.append("Transaction ID,Date,Type,Amount,Currency,Status,Reference ID,Target Type,Target ID,Description\n");
        for (TransactionLedger l : ledgers) {
            csv.append(String.join(",",
                    q(l.getTransactionId()),
                    q(l.getCreatedAt() != null ? l.getCreatedAt().toString() : ""),
                    q(l.getTransactionType()),
                    q(l.getAmount() != null ? l.getAmount().toPlainString() : "0"),
                    q(l.getCurrency() != null ? l.getCurrency() : "INR"),
                    q(l.getStatus()),
                    q(l.getReferenceId()),
                    q(l.getTargetType()),
                    q(l.getTargetId()),
                    q(l.getDescription())
            )).append("\n");
        }
        return csv.toString();
    }

    // ── FR-16-023: Monthly Statement ─────────────────────────────────────────

    @Transactional
    public MonthlyStatementDto generateMonthlyStatement(String orgId, int year, int month) {
        organizationRepository.findById(orgId)
                .orElseThrow(() -> new IllegalArgumentException("Organization not found"));

        List<TransactionLedger> ledgers = ledgerRepository.findByOrgIdAndYearAndMonth(orgId, year, month);

        BigDecimal revenue = sum(ledgers, "entry_fee", "completed");
        BigDecimal fees = sumAny(ledgers, "platform_fee");
        BigDecimal prizes = sumAny(ledgers, "prize_payout");
        BigDecimal earnings = sumAny(ledgers, "organizer_payout");

        long tournamentCount = ledgers.stream()
                .map(l -> l.getTournament().getTournamentId()).distinct().count();
        long regCount = ledgers.stream()
                .filter(l -> "entry_fee".equals(l.getTransactionType()) && "completed".equals(l.getStatus()))
                .count();

        // Upsert monthly statement record
        OrgMonthlyStatement stmt = monthlyStatementRepository
                .findByOrganizationOrgIdAndYearAndMonth(orgId, year, month)
                .orElseGet(OrgMonthlyStatement::new);
        stmt.setOrganization(organizationRepository.findById(orgId).orElseThrow());
        stmt.setYear(year);
        stmt.setMonth(month);
        stmt.setTotalRevenue(revenue);
        stmt.setTotalFeesPaid(fees);
        stmt.setTotalPrizes(prizes);
        stmt.setTotalEarnings(earnings);
        stmt.setTournamentCount((int) tournamentCount);
        stmt.setRegistrationCount((int) regCount);
        monthlyStatementRepository.save(stmt);

        MonthlyStatementDto dto = new MonthlyStatementDto();
        dto.setStatementId(stmt.getStatementId());
        dto.setOrgId(orgId);
        dto.setYear(year);
        dto.setMonth(month);
        dto.setTotalRevenue(revenue);
        dto.setTotalFeesPaid(fees);
        dto.setTotalPrizes(prizes);
        dto.setTotalEarnings(earnings);
        dto.setTournamentCount((int) tournamentCount);
        dto.setRegistrationCount((int) regCount);
        dto.setGeneratedAt(LocalDateTime.now());
        return dto;
    }

    @Transactional(readOnly = true)
    public List<MonthlyStatementDto> listMonthlyStatements(String orgId) {
        return monthlyStatementRepository.findByOrganizationOrgIdOrderByYearDescMonthDesc(orgId)
                .stream().map(s -> {
                    MonthlyStatementDto dto = new MonthlyStatementDto();
                    dto.setStatementId(s.getStatementId());
                    dto.setOrgId(orgId);
                    dto.setYear(s.getYear());
                    dto.setMonth(s.getMonth());
                    dto.setTotalRevenue(s.getTotalRevenue());
                    dto.setTotalFeesPaid(s.getTotalFeesPaid());
                    dto.setTotalPrizes(s.getTotalPrizes());
                    dto.setTotalEarnings(s.getTotalEarnings());
                    dto.setTournamentCount(s.getTournamentCount());
                    dto.setRegistrationCount(s.getRegistrationCount());
                    dto.setGeneratedAt(s.getGeneratedAt());
                    return dto;
                }).collect(Collectors.toList());
    }

    // ── Private Helpers ───────────────────────────────────────────────────────

    private List<Map<String, Object>> buildMonthlyTrend(List<TransactionLedger> ledgers) {
        return ledgers.stream()
                .filter(l -> l.getCreatedAt() != null && "entry_fee".equals(l.getTransactionType()))
                .collect(Collectors.groupingBy(l -> l.getCreatedAt().getYear() + "-" +
                        String.format("%02d", l.getCreatedAt().getMonthValue())))
                .entrySet().stream()
                .sorted(Map.Entry.comparingByKey())
                .map(e -> Map.<String, Object>of(
                        "month", e.getKey(),
                        "revenue", e.getValue().stream().map(TransactionLedger::getAmount).reduce(BigDecimal.ZERO, BigDecimal::add)
                ))
                .collect(Collectors.toList());
    }

    private BigDecimal sum(List<TransactionLedger> ledgers, String type, String status) {
        return ledgers.stream()
                .filter(t -> type.equals(t.getTransactionType()) && status.equals(t.getStatus()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private BigDecimal sumAny(List<TransactionLedger> ledgers, String type) {
        return ledgers.stream()
                .filter(t -> type.equals(t.getTransactionType()))
                .map(TransactionLedger::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    private String q(String s) {
        if (s == null) return "\"\"";
        return "\"" + s.replace("\"", "\"\"") + "\"";
    }

    private OrgKycDocumentDto mapKycDoc(OrgKycDocument doc) {
        OrgKycDocumentDto dto = new OrgKycDocumentDto();
        dto.setDocId(doc.getDocId());
        dto.setOrgId(doc.getOrganization().getOrgId());
        dto.setDocType(doc.getDocType());
        dto.setDocNumber(doc.getDocNumber());
        dto.setDocUrl(doc.getDocUrl());
        dto.setStatus(doc.getStatus());
        dto.setRejectionReason(doc.getRejectionReason());
        dto.setVerifiedAt(doc.getVerifiedAt());
        dto.setSubmittedAt(doc.getSubmittedAt());
        return dto;
    }

    private NonCashPrizeDto mapNonCashPrize(NonCashPrize p) {
        NonCashPrizeDto dto = new NonCashPrizeDto();
        dto.setPrizeId(p.getPrizeId());
        dto.setPosId(p.getPrizePosition().getPosId());
        dto.setTournamentId(p.getTournament().getTournamentId());
        dto.setItemName(p.getItemName());
        dto.setItemDescription(p.getItemDescription());
        dto.setItemCategory(p.getItemCategory());
        dto.setQuantity(p.getQuantity());
        dto.setEstimatedValue(p.getEstimatedValue());
        dto.setRequiresShipping(p.getRequiresShipping());
        dto.setWinnerName(p.getWinnerName());
        dto.setWinnerAddress(p.getWinnerAddress());
        dto.setWinnerPhone(p.getWinnerPhone());
        dto.setWinnerPincode(p.getWinnerPincode());
        dto.setDispatchStatus(p.getDispatchStatus());
        dto.setDispatchDate(p.getDispatchDate());
        dto.setTrackingNumber(p.getTrackingNumber());
        dto.setCourierName(p.getCourierName());
        dto.setDeliveredAt(p.getDeliveredAt());
        dto.setOrganizerNote(p.getOrganizerNote());
        return dto;
    }
}

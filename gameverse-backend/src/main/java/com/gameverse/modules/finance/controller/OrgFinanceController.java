package com.gameverse.modules.finance.controller;

import com.gameverse.modules.finance.dto.NonCashPrizeDto;
import com.gameverse.modules.finance.dto.OrgFinancialDashboardDto;
import com.gameverse.modules.finance.dto.OrgKycDocumentDto;
import com.gameverse.modules.finance.dto.MonthlyStatementDto;
import com.gameverse.modules.finance.service.OrgFinancialService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * FR-16-017: KYC
 * FR-16-018: Tournament Financial Summary
 * FR-16-019/020: Non-Cash Prizes
 * FR-16-021: Org Financial Dashboard
 * FR-16-022: CSV Export
 * FR-16-023: Monthly Statements
 */
@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
public class OrgFinanceController {

    private final OrgFinancialService orgFinancialService;

    // ── FR-16-017: KYC ────────────────────────────────────────────────────────

    @PostMapping("/organizations/{orgId}/kyc/documents")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN')")
    public ResponseEntity<OrgKycDocumentDto> submitKycDocument(
            @PathVariable String orgId,
            @RequestBody OrgKycDocumentDto dto) {
        return ResponseEntity.ok(orgFinancialService.submitKycDocument(orgId, dto));
    }

    @GetMapping("/organizations/{orgId}/kyc/documents")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<OrgKycDocumentDto>> getKycDocuments(@PathVariable String orgId) {
        return ResponseEntity.ok(orgFinancialService.getKycDocuments(orgId));
    }

    @PutMapping("/admin/kyc/documents/{docId}/verify")
    @PreAuthorize("hasRole('SUPER_ADMIN')")
    public ResponseEntity<OrgKycDocumentDto> verifyKycDocument(
            @PathVariable String docId,
            @RequestBody Map<String, Object> body,
            Authentication auth) {
        boolean approved = Boolean.TRUE.equals(body.get("approved"));
        String reason = (String) body.get("rejectionReason");
        return ResponseEntity.ok(orgFinancialService.verifyKycDocument(docId, auth.getName(), approved, reason));
    }

    // ── FR-16-018: Tournament Financial Summary ───────────────────────────────

    @GetMapping("/tournaments/{tournamentId}/finance/summary/detailed")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN', 'ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<Map<String, Object>> getDetailedFinancialSummary(@PathVariable String tournamentId) {
        return ResponseEntity.ok(orgFinancialService.getTournamentFinancialSummaryDetailed(tournamentId));
    }

    // ── FR-16-019/020: Non-Cash Prize Management ──────────────────────────────

    @PostMapping("/tournaments/{tournamentId}/prize-positions/{posId}/non-cash-prizes")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<NonCashPrizeDto> addNonCashPrize(
            @PathVariable String tournamentId,
            @PathVariable String posId,
            @RequestBody NonCashPrizeDto dto) {
        return ResponseEntity.ok(orgFinancialService.addNonCashPrize(tournamentId, posId, dto));
    }

    @GetMapping("/tournaments/{tournamentId}/non-cash-prizes")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<List<NonCashPrizeDto>> getNonCashPrizes(@PathVariable String tournamentId) {
        return ResponseEntity.ok(orgFinancialService.getNonCashPrizes(tournamentId));
    }

    @PutMapping("/non-cash-prizes/{prizeId}/dispatch")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR')")
    public ResponseEntity<NonCashPrizeDto> updateDispatch(
            @PathVariable String prizeId,
            @RequestBody NonCashPrizeDto dto) {
        return ResponseEntity.ok(orgFinancialService.updateDispatchStatus(prizeId, dto));
    }

    // ── FR-16-021: Org Financial Dashboard ───────────────────────────────────

    @GetMapping("/organizations/{orgId}/finance/dashboard")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<OrgFinancialDashboardDto> getFinancialDashboard(@PathVariable String orgId) {
        return ResponseEntity.ok(orgFinancialService.getOrgFinancialDashboard(orgId));
    }

    // ── FR-16-022: CSV Export ─────────────────────────────────────────────────

    @GetMapping("/tournaments/{tournamentId}/finance/ledger/export.csv")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'TOURNAMENT_DIR', 'SUPER_ADMIN')")
    public ResponseEntity<byte[]> exportLedgerCsv(@PathVariable String tournamentId) {
        String csv = orgFinancialService.exportLedgerAsCsv(tournamentId);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("text/csv"));
        headers.setContentDispositionFormData("attachment", "ledger-" + tournamentId + ".csv");
        return ResponseEntity.ok()
                .headers(headers)
                .body(csv.getBytes(java.nio.charset.StandardCharsets.UTF_8));
    }

    // ── FR-16-023: Monthly Statement ─────────────────────────────────────────

    @GetMapping("/organizations/{orgId}/finance/statements")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<List<MonthlyStatementDto>> listMonthlyStatements(@PathVariable String orgId) {
        return ResponseEntity.ok(orgFinancialService.listMonthlyStatements(orgId));
    }

    @PostMapping("/organizations/{orgId}/finance/statements/{year}/{month}")
    @PreAuthorize("hasAnyRole('ORG_OWNER', 'ORG_ADMIN', 'SUPER_ADMIN')")
    public ResponseEntity<MonthlyStatementDto> generateMonthlyStatement(
            @PathVariable String orgId,
            @PathVariable int year,
            @PathVariable int month) {
        return ResponseEntity.ok(orgFinancialService.generateMonthlyStatement(orgId, year, month));
    }
}

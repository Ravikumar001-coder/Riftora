package com.gameverse.modules.finance.repository;

import com.gameverse.modules.finance.entity.OrgMonthlyStatement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrgMonthlyStatementRepository extends JpaRepository<OrgMonthlyStatement, String> {
    List<OrgMonthlyStatement> findByOrganizationOrgIdOrderByYearDescMonthDesc(String orgId);
    Optional<OrgMonthlyStatement> findByOrganizationOrgIdAndYearAndMonth(String orgId, int year, int month);
}

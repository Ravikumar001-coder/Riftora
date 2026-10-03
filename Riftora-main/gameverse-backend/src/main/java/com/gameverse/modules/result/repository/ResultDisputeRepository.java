package com.gameverse.modules.result.repository;

import com.gameverse.modules.result.entity.ResultDispute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResultDisputeRepository extends JpaRepository<ResultDispute, String> {
    List<ResultDispute> findByMatchResult_ResultId(String resultId);
}

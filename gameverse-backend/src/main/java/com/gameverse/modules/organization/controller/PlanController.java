package com.gameverse.modules.organization.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.organization.entity.OrgPlan;
import com.gameverse.modules.organization.service.OrgPlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/plans")
@RequiredArgsConstructor
public class PlanController {

    private final OrgPlanService orgPlanService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<OrgPlan>>> getPlans() {
        return ResponseEntity.ok(ApiResponse.success(orgPlanService.getAllPlans()));
    }
}

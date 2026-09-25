package com.gameverse.modules.broadcast.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.broadcast.dto.CreateStreamConfigRequest;
import com.gameverse.modules.broadcast.dto.StreamConfigDto;
import com.gameverse.modules.broadcast.service.StreamConfigService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/broadcast/configs")
@RequiredArgsConstructor
public class StreamConfigController {

    private final StreamConfigService streamConfigService;

    @PostMapping
    public ResponseEntity<ApiResponse<StreamConfigDto>> createConfig(
            @Valid @RequestBody CreateStreamConfigRequest request,
            Authentication authentication) {
        
        String userId = (String) authentication.getPrincipal();
        StreamConfigDto response = streamConfigService.createStreamConfig(userId, request);
        
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(response));
    }

    @GetMapping("/tournament/{tournamentId}")
    public ResponseEntity<ApiResponse<java.util.List<StreamConfigDto>>> getTournamentStreams(
            @PathVariable String tournamentId) {
        
        java.util.List<StreamConfigDto> response = streamConfigService.getTournamentStreams(tournamentId);
        
        return ResponseEntity.ok(ApiResponse.success(response));
    }
}

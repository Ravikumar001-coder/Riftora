package com.gameverse.modules.broadcast.controller;

import com.gameverse.modules.broadcast.dto.CreateStreamAnnotationRequest;
import com.gameverse.modules.broadcast.dto.StreamAnnotationDto;
import com.gameverse.modules.broadcast.service.StreamAnnotationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tournaments/{tournamentId}/broadcast/annotations")
@RequiredArgsConstructor
public class StreamAnnotationController {

    private final StreamAnnotationService annotationService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ORGANIZER', 'DIRECTOR', 'BROADCAST_PRODUCER')")
    public ResponseEntity<StreamAnnotationDto> createAnnotation(
            @PathVariable String tournamentId,
            @RequestBody CreateStreamAnnotationRequest request,
            Principal principal) {
        // Here we just use the principal's name as the user id. 
        // Real implementation would extract the user ID from JWT claims.
        return ResponseEntity.ok(annotationService.createAnnotation(tournamentId, principal.getName(), request));
    }

    @GetMapping
    public ResponseEntity<List<StreamAnnotationDto>> getAnnotations(@PathVariable String tournamentId) {
        return ResponseEntity.ok(annotationService.getAnnotations(tournamentId));
    }
}

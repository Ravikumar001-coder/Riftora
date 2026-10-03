package com.gameverse.modules.game.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.service.AdminGameService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/v1/admin/games")
@RequiredArgsConstructor
public class AdminGameController {

    private final AdminGameService adminGameService;

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @GetMapping
    public ResponseEntity<ApiResponse<List<Game>>> getAllGames() {
        return ResponseEntity.ok(ApiResponse.success(adminGameService.getAllGames()));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PostMapping
    public ResponseEntity<ApiResponse<Game>> createGame(@RequestBody Game game) {
        return ResponseEntity.ok(ApiResponse.success(adminGameService.createGame(game)));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PutMapping("/{gameId}")
    public ResponseEntity<ApiResponse<Game>> updateGame(@PathVariable String gameId, @RequestBody Game gameDetails) {
        return ResponseEntity.ok(ApiResponse.success(adminGameService.updateGame(gameId, gameDetails)));
    }

    @PreAuthorize("hasRole('SUPER_ADMIN')")
    @PatchMapping("/{gameId}/toggle-status")
    public ResponseEntity<ApiResponse<Void>> toggleGameStatus(@PathVariable String gameId) {
        adminGameService.toggleActiveStatus(gameId);
        return ResponseEntity.ok(ApiResponse.success(null));
    }
}

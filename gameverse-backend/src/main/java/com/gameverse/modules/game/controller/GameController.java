package com.gameverse.modules.game.controller;

import com.gameverse.core.dto.ApiResponse;
import com.gameverse.modules.game.dto.GameDto;
import com.gameverse.modules.game.service.GameService;
import com.gameverse.modules.scoring.dto.ScoringTemplateDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/v1/games")
@RequiredArgsConstructor
public class GameController {

    private final GameService gameService;

    @GetMapping
    public ResponseEntity<ApiResponse<List<GameDto>>> getAllGames() {
        return ResponseEntity.ok(ApiResponse.success(gameService.getAllGames()));
    }

    @GetMapping("/{gameId}/templates")
    public ResponseEntity<ApiResponse<List<ScoringTemplateDto>>> getSystemTemplates(@PathVariable String gameId) {
        return ResponseEntity.ok(ApiResponse.success(gameService.getSystemTemplates(gameId)));
    }
}

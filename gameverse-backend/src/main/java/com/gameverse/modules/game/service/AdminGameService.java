package com.gameverse.modules.game.service;

import com.gameverse.modules.game.entity.Game;
import com.gameverse.modules.game.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminGameService {

    private final GameRepository gameRepository;

    @Transactional(readOnly = true)
    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    @Transactional
    public Game createGame(Game game) {
        return gameRepository.save(game);
    }

    @Transactional
    public Game updateGame(String gameId, Game gameDetails) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        
        game.setGameName(gameDetails.getGameName());
        game.setGameCode(gameDetails.getGameCode());
        game.setIconUrl(gameDetails.getIconUrl());
        game.setCoverUrl(gameDetails.getCoverUrl());
        game.setUidLabel(gameDetails.getUidLabel());
        game.setUidRegex(gameDetails.getUidRegex());
        game.setUidExample(gameDetails.getUidExample());
        game.setMaxTeamSize(gameDetails.getMaxTeamSize());
        game.setMinTeamSize(gameDetails.getMinTeamSize());
        game.setMaxSubstitutes(gameDetails.getMaxSubstitutes());
        game.setIsActive(gameDetails.getIsActive());
        game.setPlatform(gameDetails.getPlatform());
        game.setGenre(gameDetails.getGenre());
        game.setPublisher(gameDetails.getPublisher());
        game.setFormat(gameDetails.getFormat());
        
        return gameRepository.save(game);
    }

    @Transactional
    public void toggleActiveStatus(String gameId) {
        Game game = gameRepository.findById(gameId)
                .orElseThrow(() -> new RuntimeException("Game not found"));
        game.setIsActive(!game.getIsActive());
        gameRepository.save(game);
    }
}

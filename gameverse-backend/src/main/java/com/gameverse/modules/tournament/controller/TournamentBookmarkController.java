package com.gameverse.modules.tournament.controller;

import com.gameverse.modules.tournament.dto.TournamentDto;
import com.gameverse.modules.tournament.entity.TournamentBookmark;
import com.gameverse.modules.tournament.repository.TournamentBookmarkRepository;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/v1/tournaments")
@RequiredArgsConstructor
public class TournamentBookmarkController {

    private final TournamentBookmarkRepository bookmarkRepository;
    private final TournamentRepository tournamentRepository;

    @PostMapping("/{tournamentId}/bookmark")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Void> bookmarkTournament(
            @PathVariable String tournamentId,
            Authentication auth) {
        
        String userId = (String) auth.getPrincipal();

        if (!bookmarkRepository.existsByUserUserIdAndTournamentTournamentId(userId, tournamentId)) {
            var tournament = tournamentRepository.findById(tournamentId)
                    .orElseThrow(() -> new IllegalArgumentException("Tournament not found"));
            
            var user = new com.gameverse.modules.auth.entity.User();
            user.setUserId(userId);

            var bookmark = new TournamentBookmark();
            bookmark.setTournament(tournament);
            bookmark.setUser(user);

            bookmarkRepository.save(bookmark);
        }

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{tournamentId}/bookmark")
    @PreAuthorize("isAuthenticated()")
    @Transactional
    public ResponseEntity<Void> removeBookmark(
            @PathVariable String tournamentId,
            Authentication auth) {
        
        String userId = (String) auth.getPrincipal();
        bookmarkRepository.deleteByUserUserIdAndTournamentTournamentId(userId, tournamentId);

        return ResponseEntity.ok().build();
    }

    @GetMapping("/bookmarks")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<TournamentDto>> getBookmarkedTournaments(
            Authentication auth,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size) {
        
        String userId = (String) auth.getPrincipal();
        
        Page<TournamentBookmark> bookmarks = bookmarkRepository.findByUserUserIdOrderByCreatedAtDesc(
                userId, PageRequest.of(page, size));
                
        // Convert to DTO
        Page<TournamentDto> dtos = bookmarks.map(b -> {
            var t = b.getTournament();
            return TournamentDto.builder()
                .tournamentId(t.getTournamentId())
                .name(t.getName())
                .slug(t.getSlug())
                .description(t.getDescription())
                .bannerUrl(t.getBannerUrl())
                .status(t.getStatus())
                .startDate(t.getStartDate())
                .endDate(t.getEndDate())
                .registrationOpen(t.getRegistrationOpen())
                .registrationClose(t.getRegistrationClose())
                .prizePoolTotal(t.getPrizePoolTotal())
                .entryFee(t.getEntryFee())
                .isBookmarked(true)
                .build();
        });

        return ResponseEntity.ok(dtos);
    }
}

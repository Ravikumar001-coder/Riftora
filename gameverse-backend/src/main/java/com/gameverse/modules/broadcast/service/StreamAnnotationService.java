package com.gameverse.modules.broadcast.service;

import com.gameverse.modules.auth.entity.User;
import com.gameverse.modules.auth.repository.UserRepository;
import com.gameverse.modules.broadcast.dto.CreateStreamAnnotationRequest;
import com.gameverse.modules.broadcast.dto.StreamAnnotationDto;
import com.gameverse.modules.broadcast.entity.StreamAnnotation;
import com.gameverse.modules.broadcast.repository.StreamAnnotationRepository;
import com.gameverse.modules.tournament.entity.Tournament;
import com.gameverse.modules.tournament.repository.TournamentRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StreamAnnotationService {

    private final StreamAnnotationRepository annotationRepository;
    private final TournamentRepository tournamentRepository;
    private final UserRepository userRepository;

    @Transactional
    public StreamAnnotationDto createAnnotation(String tournamentId, String userId, CreateStreamAnnotationRequest request) {
        Tournament tournament = tournamentRepository.findById(tournamentId)
                .orElseThrow(() -> new RuntimeException("Tournament not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        StreamAnnotation annotation = new StreamAnnotation();
        annotation.setTournament(tournament);
        annotation.setCreatedBy(user);
        annotation.setLabel(request.getLabel());
        annotation.setCustomLabel(request.getCustomLabel());
        annotation.setStreamTimestamp(request.getStreamTimestamp());

        annotation = annotationRepository.save(annotation);
        return mapToDto(annotation);
    }

    @Transactional(readOnly = true)
    public List<StreamAnnotationDto> getAnnotations(String tournamentId) {
        return annotationRepository.findByTournament_TournamentIdOrderByCreatedAtDesc(tournamentId)
                .stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    private StreamAnnotationDto mapToDto(StreamAnnotation annotation) {
        StreamAnnotationDto dto = new StreamAnnotationDto();
        dto.setAnnotationId(annotation.getAnnotationId());
        dto.setTournamentId(annotation.getTournament().getTournamentId());
        dto.setCreatedBy(annotation.getCreatedBy().getUserId());
        dto.setCreatedByName(annotation.getCreatedBy().getDisplayName()); // assuming getDisplayName exists or using getEmail
        dto.setLabel(annotation.getLabel());
        dto.setCustomLabel(annotation.getCustomLabel());
        dto.setStreamTimestamp(annotation.getStreamTimestamp());
        dto.setCreatedAt(annotation.getCreatedAt());
        return dto;
    }
}

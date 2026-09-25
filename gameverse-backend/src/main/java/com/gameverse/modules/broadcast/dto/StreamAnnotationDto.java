package com.gameverse.modules.broadcast.dto;

import com.gameverse.modules.broadcast.entity.StreamAnnotation.AnnotationLabel;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StreamAnnotationDto {
    private String annotationId;
    private String tournamentId;
    private String createdBy;
    private String createdByName;
    private AnnotationLabel label;
    private String customLabel;
    private String streamTimestamp;
    private LocalDateTime createdAt;
}

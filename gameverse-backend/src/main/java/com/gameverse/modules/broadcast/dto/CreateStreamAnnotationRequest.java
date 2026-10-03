package com.gameverse.modules.broadcast.dto;

import com.gameverse.modules.broadcast.entity.StreamAnnotation.AnnotationLabel;
import lombok.Data;

@Data
public class CreateStreamAnnotationRequest {
    private AnnotationLabel label;
    private String customLabel;
    private String streamTimestamp;
}

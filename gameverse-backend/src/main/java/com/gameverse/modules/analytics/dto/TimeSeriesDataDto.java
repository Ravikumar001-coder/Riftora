package com.gameverse.modules.analytics.dto;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class TimeSeriesDataDto {
    private LocalDate date;
    private int value;
    private BigDecimal value2;
}

package com.chidoscode.ems.dto;

import com.chidoscode.ems.entity.HealthMetrics;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class MetricResponseDto {
    private LocalDate recordedAt;
    private Double bmi;
    private Double bmr;
    private Double eer;

    public static MetricResponseDto fromMultipleEntities(
            HealthMetrics bmiMetric,
            HealthMetrics bmrMetric,
            HealthMetrics eerMetric
    ) {

        return MetricResponseDto.builder()
                .recordedAt(LocalDate.now()) // or null, or the latest of the 3 if you prefer
                .bmi(bmiMetric != null ? bmiMetric.getBmi() : null)
                .bmr(bmrMetric != null ? bmrMetric.getBmr() : null)
                .eer(eerMetric != null ? eerMetric.getEer() : null)
                .build();
    }

}
package com.chidoscode.ems.dto;

import com.chidoscode.ems.entity.HealthMetrics;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class MetricResponseDto {
     private LocalDateTime recordedAt;
    private Double bmi;
    private Double bmr;
    private Double eer;

    public static MetricResponseDto fromMultipleEntities(
            HealthMetrics bmiMetric,
            HealthMetrics bmrMetric,
            HealthMetrics eerMetric
    ) {

        LocalDateTime latestRecordedAt = null;

        if (bmiMetric != null) latestRecordedAt = bmiMetric.getRecordedAt();
        if (bmrMetric != null && (latestRecordedAt == null || bmrMetric.getRecordedAt().isAfter(latestRecordedAt))) {
            latestRecordedAt = bmrMetric.getRecordedAt();
        }
        if (eerMetric != null && (latestRecordedAt == null || eerMetric.getRecordedAt().isAfter(latestRecordedAt))) {
            latestRecordedAt = eerMetric.getRecordedAt();
        }

        return MetricResponseDto.builder()
                .recordedAt(latestRecordedAt) // or null, or the latest of the 3 if you prefer
                .bmi(bmiMetric != null ? bmiMetric.getBmi() : null)
                .bmr(bmrMetric != null ? bmrMetric.getBmr() : null)
                .eer(eerMetric != null ? eerMetric.getEer() : null)
                .build();
    }
}
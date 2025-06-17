package com.chidoscode.ems.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthStatusDto {
    private String status;      // e.g., "Healthy", "Overweight"
    private String message;     // Explanation
    private Double bmi;
    private Double bmr;
    private Double eer;
}

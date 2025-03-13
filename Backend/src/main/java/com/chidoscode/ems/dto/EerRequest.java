package com.chidoscode.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EerRequest {
    private double weight;
    private double height;
    private int age;
    private String gender;
    private double activityLevel;
}

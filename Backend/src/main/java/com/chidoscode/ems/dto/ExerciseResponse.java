package com.chidoscode.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ExerciseResponse {
    private Long id;
    private String name;
    private Integer sets;
    private String reps;
    private Integer duration; // in minutes
    private Integer rest; // in seconds
}


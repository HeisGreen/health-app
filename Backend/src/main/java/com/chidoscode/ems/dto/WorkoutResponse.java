package com.chidoscode.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutResponse {
    private Long id;
    private String name;
    private String day;
    private Boolean completed;
    private LocalDateTime createdAt;
    private List<ExerciseResponse> exercises;
}


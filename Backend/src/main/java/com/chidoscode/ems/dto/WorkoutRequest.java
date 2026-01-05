package com.chidoscode.ems.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkoutRequest {
    private String name;
    private String day;
    private List<ExerciseRequest> exercises;
    private Boolean completed;
}


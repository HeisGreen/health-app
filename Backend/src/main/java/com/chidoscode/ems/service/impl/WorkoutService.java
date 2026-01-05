package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.WorkoutRequest;
import com.chidoscode.ems.dto.WorkoutResponse;

import java.util.List;

public interface WorkoutService {
    WorkoutResponse createWorkout(String username, WorkoutRequest workoutRequest);
    List<WorkoutResponse> getAllWorkouts(String username);
    WorkoutResponse updateWorkout(String username, Long id, WorkoutRequest workoutRequest);
    void deleteWorkout(String username, Long id);
    WorkoutResponse toggleComplete(String username, Long id);
}


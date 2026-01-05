package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.ExerciseRequest;
import com.chidoscode.ems.dto.ExerciseResponse;
import com.chidoscode.ems.dto.WorkoutRequest;
import com.chidoscode.ems.dto.WorkoutResponse;
import com.chidoscode.ems.entity.Exercise;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.entity.Workout;
import com.chidoscode.ems.repository.UserRepository;
import com.chidoscode.ems.repository.WorkoutRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutServiceImpl implements WorkoutService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkoutRepository workoutRepository;

    @Override
    @Transactional
    public WorkoutResponse createWorkout(String username, WorkoutRequest workoutRequest) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (workoutRequest.getName() == null || workoutRequest.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Workout name cannot be empty");
        }

        if (workoutRequest.getDay() == null || workoutRequest.getDay().trim().isEmpty()) {
            throw new IllegalArgumentException("Workout day cannot be empty");
        }

        Workout workout = Workout.builder()
                .user(user)
                .name(workoutRequest.getName())
                .day(workoutRequest.getDay())
                .completed(workoutRequest.getCompleted() != null ? workoutRequest.getCompleted() : false)
                .createdAt(LocalDateTime.now())
                .exercises(new ArrayList<>())
                .build();

        // Add exercises if provided
        if (workoutRequest.getExercises() != null && !workoutRequest.getExercises().isEmpty()) {
            List<Exercise> exercises = workoutRequest.getExercises().stream()
                    .filter(ex -> ex.getName() != null && !ex.getName().trim().isEmpty())
                    .map(exRequest -> Exercise.builder()
                            .workout(workout)
                            .name(exRequest.getName())
                            .sets(exRequest.getSets())
                            .reps(exRequest.getReps())
                            .duration(exRequest.getDuration())
                            .rest(exRequest.getRest())
                            .build())
                    .collect(Collectors.toList());
            workout.setExercises(exercises);
        }

        Workout savedWorkout = workoutRepository.save(workout);
        return mapToResponseDto(savedWorkout);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkoutResponse> getAllWorkouts(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        List<Workout> workouts = workoutRepository.findByUserOrderByCreatedAtDesc(user);
        return workouts.stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public WorkoutResponse updateWorkout(String username, Long id, WorkoutRequest workoutRequest) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Workout workout = workoutRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found or you don't have permission to access it"));

        if (workoutRequest.getName() != null && !workoutRequest.getName().trim().isEmpty()) {
            workout.setName(workoutRequest.getName());
        }

        if (workoutRequest.getDay() != null && !workoutRequest.getDay().trim().isEmpty()) {
            workout.setDay(workoutRequest.getDay());
        }

        if (workoutRequest.getCompleted() != null) {
            workout.setCompleted(workoutRequest.getCompleted());
        }

        // Update exercises
        if (workoutRequest.getExercises() != null) {
            // Remove existing exercises
            workout.getExercises().clear();

            // Add new exercises
            List<Exercise> exercises = workoutRequest.getExercises().stream()
                    .filter(ex -> ex.getName() != null && !ex.getName().trim().isEmpty())
                    .map(exRequest -> Exercise.builder()
                            .workout(workout)
                            .name(exRequest.getName())
                            .sets(exRequest.getSets())
                            .reps(exRequest.getReps())
                            .duration(exRequest.getDuration())
                            .rest(exRequest.getRest())
                            .build())
                    .collect(Collectors.toList());
            workout.setExercises(exercises);
        }

        Workout updatedWorkout = workoutRepository.save(workout);
        return mapToResponseDto(updatedWorkout);
    }

    @Override
    @Transactional
    public void deleteWorkout(String username, Long id) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Workout workout = workoutRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found or you don't have permission to delete it"));

        workoutRepository.delete(workout);
    }

    @Override
    @Transactional
    public WorkoutResponse toggleComplete(String username, Long id) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        Workout workout = workoutRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new IllegalArgumentException("Workout not found or you don't have permission to access it"));

        workout.setCompleted(!workout.getCompleted());
        Workout updatedWorkout = workoutRepository.save(workout);
        return mapToResponseDto(updatedWorkout);
    }

    private WorkoutResponse mapToResponseDto(Workout workout) {
        List<ExerciseResponse> exerciseResponses = workout.getExercises() != null
                ? workout.getExercises().stream()
                        .map(ex -> ExerciseResponse.builder()
                                .id(ex.getId())
                                .name(ex.getName())
                                .sets(ex.getSets())
                                .reps(ex.getReps())
                                .duration(ex.getDuration())
                                .rest(ex.getRest())
                                .build())
                        .collect(Collectors.toList())
                : List.of();

        return WorkoutResponse.builder()
                .id(workout.getId())
                .name(workout.getName())
                .day(workout.getDay())
                .completed(workout.getCompleted())
                .createdAt(workout.getCreatedAt())
                .exercises(exerciseResponses)
                .build();
    }
}


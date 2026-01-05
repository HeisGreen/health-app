package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.WorkoutRequest;
import com.chidoscode.ems.dto.WorkoutResponse;
import com.chidoscode.ems.service.impl.WorkoutService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = {"http://localhost:5173", "https://ems-two-gamma.vercel.app/"})
@RestController
@RequestMapping("/api/workouts")
public class WorkoutController {

    @Autowired
    private WorkoutService workoutService;

    @PostMapping
    public ResponseEntity<WorkoutResponse> createWorkout(
            @RequestBody WorkoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        WorkoutResponse response = workoutService.createWorkout(username, request);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<WorkoutResponse>> getAllWorkouts(
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        List<WorkoutResponse> workouts = workoutService.getAllWorkouts(username);
        return ResponseEntity.ok(workouts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkoutResponse> updateWorkout(
            @PathVariable Long id,
            @RequestBody WorkoutRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        WorkoutResponse response = workoutService.updateWorkout(username, id, request);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkout(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        workoutService.deleteWorkout(username, id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/toggle-complete")
    public ResponseEntity<WorkoutResponse> toggleComplete(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        WorkoutResponse response = workoutService.toggleComplete(username, id);
        return ResponseEntity.ok(response);
    }
}


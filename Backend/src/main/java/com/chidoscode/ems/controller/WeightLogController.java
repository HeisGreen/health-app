package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.WeightLogRequest;
import com.chidoscode.ems.dto.WeightLogResponse;
import com.chidoscode.ems.entity.WeightLog;
import com.chidoscode.ems.service.impl.WeightLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/weight")
public class WeightLogController {

    @Autowired
    WeightLogService weightLogService;

    @PostMapping
    public ResponseEntity<WeightLogResponse> logWeight(
            @RequestBody WeightLogRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        // Extract username from JWT
        String username = userDetails.getUsername();

        // Delegate to service (pass the original request + username)
        WeightLog savedLog = weightLogService.logWeight(username, request);

        // Convert to DTO to hide sensitive data
        WeightLogResponse response = mapToResponseDto(savedLog);
        return ResponseEntity.ok(response);
    }
    private WeightLogResponse mapToResponseDto(WeightLog log) {
        return WeightLogResponse.builder()
                .id(log.getId())
                .weightInKg(log.getWeightInKg())
                .logDate(log.getLogDate())
                .user(WeightLogResponse.UserSummary.builder()
                        .id(log.getUser().getId())
                        .firstName(log.getUser().getFirstName())
                        .lastName(log.getUser().getLastName())
                        .build())
                .build();
    }

    @GetMapping
    public ResponseEntity<List<WeightLog>> getWeightHistory(
            @AuthenticationPrincipal UserDetails userDetails) {

        String username = userDetails.getUsername();
        return ResponseEntity.ok(weightLogService.getWeightHistory(username));
    }
}

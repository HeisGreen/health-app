package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.MetricResponseDto;
import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.service.impl.HealthMetricService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class HealthMetricsController {
    @Autowired
    HealthMetricService metricsService;

    @PostMapping("/{metricType}")
    public ResponseEntity<HealthMetrics> saveMetric(
            @PathVariable String metricType,
            @RequestParam Double value,
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        return ResponseEntity.ok(
                metricsService.saveMetric(username, metricType, value)
        );
    }


    @GetMapping("/latest")
    public ResponseEntity<MetricResponseDto> getLatestMetrics(
            @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        return ResponseEntity.ok(
                metricsService.getLatestMetrics(username)
        );
    }

}

package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.HealthStatusDto;
import com.chidoscode.ems.service.impl.HealthStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthStatusController {

    @Autowired
    private HealthStatusService healthStatusService;

    @GetMapping
    public ResponseEntity<Map<String, String>> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Service is running");
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status")
    public ResponseEntity<HealthStatusDto> getHealthStatus(@RequestParam String username) {
        HealthStatusDto healthStatusDto = healthStatusService.getHealthStatus(username);
        return ResponseEntity.ok(healthStatusDto);
    }
}

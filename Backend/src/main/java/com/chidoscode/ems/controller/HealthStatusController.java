package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.HealthStatusDto;
import com.chidoscode.ems.service.impl.HealthStatusService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/health")
public class HealthStatusController {

    @Autowired
    private HealthStatusService healthStatusService;

    @GetMapping("/status")
    public ResponseEntity<HealthStatusDto> getHealthStatus(@RequestParam String username) {
        HealthStatusDto healthStatusDto = healthStatusService.getHealthStatus(username);
        return ResponseEntity.ok(healthStatusDto);
    }
}

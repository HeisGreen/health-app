package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.HealthStatusDto;

public interface HealthStatusService {
    HealthStatusDto getHealthStatus(String username);
}

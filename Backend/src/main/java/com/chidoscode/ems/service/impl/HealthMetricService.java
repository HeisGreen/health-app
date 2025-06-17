package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.MetricResponseDto;
import com.chidoscode.ems.entity.HealthMetrics;

import java.util.List;

public interface HealthMetricService {
    public HealthMetrics saveMetric(String username, String metricType, Double value);

    public MetricResponseDto getLatestMetrics(String username);

    public List<MetricResponseDto> getMetricTrends(String username);
}

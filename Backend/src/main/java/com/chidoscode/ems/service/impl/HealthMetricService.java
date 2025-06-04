package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.entity.HealthMetrics;

public interface HealthMetricService {
    public HealthMetrics saveMetric(Long userId, String metricType, Double value);

    public HealthMetrics getLatestMetrics(Long userId);
}

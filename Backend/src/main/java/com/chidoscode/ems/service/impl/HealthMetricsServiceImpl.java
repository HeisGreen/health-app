package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.HealthMetricsRepository;
import com.chidoscode.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;

@Service
public class HealthMetricsServiceImpl implements HealthMetricService{

    @Autowired
    UserService userService;

    @Autowired
    HealthMetricsRepository metricsRepository;

    @Override
    @Transactional
    public HealthMetrics saveMetric(Long userId, String metricType, Double value) {
        User user = userService.getUserById(userId);
        LocalDate today = LocalDate.now();

        // Check if today's record exists
        HealthMetrics metrics = metricsRepository.findByUserAndRecordedAt(user, today)
                .orElseGet(() -> {
                    HealthMetrics newMetrics = new HealthMetrics();
                    newMetrics.setUser(user);
                    newMetrics.setRecordedAt(today);
                    return newMetrics;
                });

        // Update specific metric
        switch (metricType.toLowerCase()) {
            case "bmi" -> metrics.setBmi(value);
            case "bmr" -> metrics.setBmr(value);
            case "eer" -> metrics.setEer(value);
            default -> throw new IllegalArgumentException("Invalid metric type");
        }

        return metricsRepository.save(metrics);
    }

    @Override
    public HealthMetrics getLatestMetrics(Long userId) {
        User user = userService.getUserById(userId);
        return metricsRepository.findByUserOrderByRecordedAtDesc(user)
                .stream()
                .findFirst()
                .orElse(null);
    }
}

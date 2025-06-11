package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.MetricResponseDto;
import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.HealthMetricsRepository;
import com.chidoscode.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class HealthMetricsServiceImpl implements HealthMetricService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthMetricsRepository metricsRepository;

    @Override
    @Transactional
    public HealthMetrics saveMetric(String username, String metricType, Double value) {
        User user = userRepository.findByEmail(username).orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));;
        LocalDateTime today = LocalDateTime.now();

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
    public MetricResponseDto getLatestMetrics(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        HealthMetrics latestBmi = metricsRepository.findTop1ByUserAndBmiIsNotNullOrderByRecordedAtDesc(user);
        HealthMetrics latestBmr = metricsRepository.findTop1ByUserAndBmrIsNotNullOrderByRecordedAtDesc(user);
        HealthMetrics latestEer = metricsRepository.findTop1ByUserAndEerIsNotNullOrderByRecordedAtDesc(user);

        return MetricResponseDto.fromMultipleEntities(latestBmi, latestBmr, latestEer);
    }
}

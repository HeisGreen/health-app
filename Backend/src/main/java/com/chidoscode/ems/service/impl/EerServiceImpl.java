package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.EerRequest;
import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.HealthMetricsRepository;
import com.chidoscode.ems.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EerServiceImpl implements EerService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthMetricsRepository healthMetricsRepo;

    @Override
    @Transactional
    public double calculateEer(EerRequest eerRequest, String username) {
        // 1. Validate input
        if (eerRequest.getWeight() <= 0 || eerRequest.getHeight() <= 0) {
            throw new IllegalArgumentException("Weight and height must be positive");
        }

        if (!eerRequest.getGender().equalsIgnoreCase("male") &&
                !eerRequest.getGender().equalsIgnoreCase("female")) {
            throw new IllegalArgumentException("Gender must be 'male' or 'female'");
        }

        // 2. Get user
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Calculate EER
        double eer;
        if (eerRequest.getGender().equalsIgnoreCase("male")) {
            eer = 662 - (9.53 * eerRequest.getAge()) +
                    eerRequest.getActivityLevel() * (15.91 * eerRequest.getWeight() + 539.6 * eerRequest.getHeight());
        } else {
            eer = 354 - (6.91 * eerRequest.getAge()) +
                    eerRequest.getActivityLevel() * (9.36 * eerRequest.getWeight() + 726 * eerRequest.getHeight());
        }

        DecimalFormat df = new DecimalFormat("#.##");
        double formattedEer = Double.parseDouble(df.format(eer));

        // 4. Save to HealthMetrics
        HealthMetrics metrics = new HealthMetrics();
        metrics.setUser(user);
        metrics.setRecordedAt(LocalDateTime.now());
        metrics.setEer(formattedEer);

        // Clear other metrics to avoid confusion
        metrics.setBmi(null);
        metrics.setBmr(null);

        healthMetricsRepo.save(metrics);

        return formattedEer;
    }
}
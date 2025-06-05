package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.BmrRequest;
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

@Service
@RequiredArgsConstructor
public class BmrServiceImpl implements BmrService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthMetricsRepository healthMetricsRepo;

    @Override
    @Transactional
    public double calculateBmr(BmrRequest bmrRequest, String username) {
        // 1. Validate input
        if (bmrRequest.getWeight() <= 0) {
            throw new IllegalArgumentException("Weight must be positive");
        }

        if (!bmrRequest.getGender().equalsIgnoreCase("male") &&
                !bmrRequest.getGender().equalsIgnoreCase("female")) {
            throw new IllegalArgumentException("Gender must be 'male' or 'female'");
        }

        // 2. Get user
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // 3. Calculate BMR
        double bmr;
        if (bmrRequest.getGender().equalsIgnoreCase("male")) {
            bmr = bmrRequest.getWeight() * 24; // Simplified formula
        } else {
            bmr = bmrRequest.getWeight() * 0.9 * 24;
        }

        DecimalFormat df = new DecimalFormat("#.##");
        double formattedBmr = Double.parseDouble(df.format(bmr));

        // 4. Save to HealthMetrics
        HealthMetrics metrics = healthMetricsRepo
                .findByUserAndRecordedAt(user, LocalDate.now())
                .orElseGet(() -> {
                    HealthMetrics newMetrics = new HealthMetrics();
                    newMetrics.setUser(user);
                    newMetrics.setRecordedAt(LocalDate.now());
                    return newMetrics;
                });

        metrics.setBmr(formattedBmr); // Fixed: was incorrectly setting BMI
        healthMetricsRepo.save(metrics);

        return formattedBmr;
    }
}
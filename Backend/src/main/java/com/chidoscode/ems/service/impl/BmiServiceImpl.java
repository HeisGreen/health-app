package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.BmiRequest;
import com.chidoscode.ems.dto.UserResponse;
import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.HealthMetricsRepository;
import com.chidoscode.ems.repository.UserRepository;
import com.chidoscode.ems.utils.AccountUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class BmiServiceImpl implements BmiService {

    @Autowired
    HealthMetricsRepository healthMetricsRepo;

    @Autowired
    UserRepository userRepository;

    @Override
    @Transactional
    public double calculateBmi(BmiRequest bmiRequest, String username) {
        // 1. Validate input (your existing code)
        if (bmiRequest.getWeight() <= 0 || bmiRequest.getHeight() <= 0) {
            throw new IllegalArgumentException(
                    UserResponse.builder()
                            .responseCode(AccountUtils.NULL_VALUE_CODE)
                            .responseMessage(AccountUtils.NULL_VALUE_MESSAGE)
                            .build()
                            .getResponseMessage()
            );
        }

        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("This user does not exist"));

        // 3. Calculate BMI (your existing logic)
        double bmi = bmiRequest.getWeight() / Math.pow(bmiRequest.getHeight(), 2);
        DecimalFormat df = new DecimalFormat("#.##");
        double formattedBmi = Double.parseDouble(df.format(bmi));

        // Always create new record
        HealthMetrics metrics = new HealthMetrics();
        metrics.setUser(user);
        metrics.setRecordedAt(LocalDate.now());
        metrics.setBmi(formattedBmi);

        // Clear other metrics to avoid confusion
        metrics.setBmr(null);
        metrics.setEer(null);

        healthMetricsRepo.save(metrics);

        return formattedBmi;
    }
}
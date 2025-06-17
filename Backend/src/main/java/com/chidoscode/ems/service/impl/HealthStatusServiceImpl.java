package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.HealthStatusDto;
import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.HealthMetricsRepository;
import com.chidoscode.ems.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class HealthStatusServiceImpl implements HealthStatusService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    HealthMetricsRepository metricsRepository;


    @Override
    public HealthStatusDto getHealthStatus(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));

        HealthMetrics bmiMetric = metricsRepository.findTop1ByUserAndBmiIsNotNullOrderByRecordedAtDesc(user);
        HealthMetrics bmrMetric = metricsRepository.findTop1ByUserAndBmrIsNotNullOrderByRecordedAtDesc(user);
        HealthMetrics eerMetric = metricsRepository.findTop1ByUserAndEerIsNotNullOrderByRecordedAtDesc(user);

        Double bmi = bmiMetric != null ? bmiMetric.getBmi() : null;
        Double bmr = bmrMetric != null ? bmrMetric.getBmr() : null;
        Double eer = eerMetric != null ? eerMetric.getEer() : null;

        // Start diagnosis
        String status = "Unknown";
        String message = "Not enough data to determine your health status.";

        if (bmi != null) {
            if (bmi < 18.5) {
                status = "Underweight";
            } else if (bmi < 24.9) {
                status = "Healthy";
            } else if (bmi < 29.9) {
                status = "Overweight";
            } else {
                status = "Obese";
            }

            // Add message based on BMR/EER
            if (bmr != null && eer != null) {
                if (eer > bmr + 500 && bmi >= 25) {
                    message = "You're consuming significantly more energy than your body needs. Consider dietary adjustments.";
                } else if (eer < bmr - 500 && bmi < 18.5) {
                    message = "Your energy intake may be too low. You could be at risk of undernourishment.";
                } else {
                    message = "Your energy expenditure seems balanced.";
                }
            } else {
                message = "BMI evaluated, but more data (BMR/EER) would improve accuracy.";
            }
        }

        return HealthStatusDto.builder()
                .status(status)
                .message(message)
                .bmi(bmi)
                .bmr(bmr)
                .eer(eer)
                .build();
    }
}

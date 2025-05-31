package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.WeightLogRequest;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.entity.WeightLog;
import com.chidoscode.ems.repository.UserRepository;
import com.chidoscode.ems.repository.WeightLogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WeightLogServiceImpl implements WeightLogService{

    @Autowired
    UserRepository userRepository;

    @Autowired
    WeightLogRepository weightLogRepository;

    @Override
    public WeightLog logWeight(String username, WeightLogRequest weightLogRequest) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        if (weightLogRequest.getWeightInKg() <= 0){
            throw new IllegalArgumentException("Weight must be greater than 0");
        }

        WeightLog log = WeightLog.builder()
                .user(user)
                .weightInKg(weightLogRequest.getWeightInKg())
                .logDate(weightLogRequest.getDate() != null ? weightLogRequest.getDate() : LocalDate.now())
                .build();

        return weightLogRepository.save(log);
    }

    @Override
    public List<WeightLog> getWeightHistory(String username) {
        User user = userRepository.findByEmail(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
        return weightLogRepository.findByUserOrderByLogDateDesc(user);
    }
}

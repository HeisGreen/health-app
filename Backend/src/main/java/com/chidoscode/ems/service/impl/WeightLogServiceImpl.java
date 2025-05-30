package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.entity.WeightLog;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class WeightLogServiceImpl implements WeightLogService{
    @Override
    public WeightLog logWeight(Long userId, double weightInKg, LocalDate date) {
        return null;
    }

    @Override
    public List<WeightLog> getWeightHistory(Long userId) {
        return List.of();
    }
}

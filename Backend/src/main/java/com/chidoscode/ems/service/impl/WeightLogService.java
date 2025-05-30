package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.entity.WeightLog;

import java.time.LocalDate;
import java.util.List;

public interface WeightLogService {
    public WeightLog logWeight(Long userId, double weightInKg, LocalDate date);
    public List<WeightLog> getWeightHistory(Long userId);
}

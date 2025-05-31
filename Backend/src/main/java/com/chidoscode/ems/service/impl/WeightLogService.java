package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.WeightLogRequest;
import com.chidoscode.ems.entity.WeightLog;

import java.time.LocalDate;
import java.util.List;

public interface WeightLogService {
    WeightLog logWeight(String username, WeightLogRequest weightLogRequest);
    public List<WeightLog> getWeightHistory(String username);
}

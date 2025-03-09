package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.BmrRequest;
import org.springframework.stereotype.Service;

public interface BmrService {
    double calculateBmr(BmrRequest bmrRequest);
}

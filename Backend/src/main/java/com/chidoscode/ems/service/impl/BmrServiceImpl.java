package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.BmrRequest;
import org.springframework.stereotype.Service;

@Service
public class BmrServiceImpl implements BmrService{
    @Override
    public double calculateBmr(BmrRequest bmrRequest) {
        double weight = bmrRequest.getWeight();
        String gender = bmrRequest.getGender();

        if (gender.equals("male")){
            return ((weight * 1) * 24);
        } else if(gender.equals("female")){
            return  ((weight * 0.9) * 24);
        }else
            throw new IllegalArgumentException("you must specify gender either male or female");
    }
}

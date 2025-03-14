package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.BmrRequest;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;

@Service
public class BmrServiceImpl implements BmrService{
    @Override
    public double calculateBmr(BmrRequest bmrRequest) {
        double weight = bmrRequest.getWeight();
        String gender = bmrRequest.getGender();

        DecimalFormat df = new DecimalFormat("#.##");

        if (gender.equals("male")){
            double maleBmi = ((weight * 1) * 24);
            return Double.parseDouble (df.format(maleBmi));
        } else if(gender.equals("female")){
            double femaleBmi = ((weight * 0.9) * 24);
            return Double.parseDouble(df.format(femaleBmi));
        }else
            throw new IllegalArgumentException("you must specify gender either male or female");
    }
}

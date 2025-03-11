package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.BmiRequest;
import com.chidoscode.ems.dto.UserResponse;
import com.chidoscode.ems.utils.AccountUtils;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;


@Service
public class BmiServiceImpl implements BmiService{

    @Override
    public double calculateBmi(BmiRequest bmiRequest) {
        double weight = bmiRequest.getWeight();
        double height = bmiRequest.getHeight();

        if (weight <= 0 && height <= 0){
             UserResponse.builder()
                     .responseCode(AccountUtils.NULL_VALUE_CODE)
                     .responseMessage(AccountUtils.NULL_VALUE_MESSAGE)
                    .build();
        }
       double bmi = (weight / (height * height));

        DecimalFormat df = new DecimalFormat("#.##");
        return Double.parseDouble(df.format(bmi));
    }
}

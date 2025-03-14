package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.EerRequest;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;

@Service
public class EerServiceImpl implements EerService{
    @Override
    public double calculateEer(EerRequest eerRequest) {
        double weight = eerRequest.getWeight();
        double height = eerRequest.getHeight();
        int age = eerRequest.getAge();
        String gender = eerRequest.getGender();
        double physicalActivity = eerRequest.getActivityLevel();

        DecimalFormat df = new DecimalFormat("#.##");


        double eerMale = (662 - (9.53 * age) + physicalActivity * (15.91 * weight + 539.6 * height));

        double eerFemale = (354 - (6.91 * age) + physicalActivity * (9.36 * weight + 726 * height));

        if (gender.equals("male")){
            return Double.parseDouble(df.format(eerMale));
        } else if (gender.equals("female")){
            return Double.parseDouble(df.format(eerFemale));
        }else
            throw new IllegalArgumentException("you must specify gender either male or female");
    }
}

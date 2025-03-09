package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.BmrRequest;
import com.chidoscode.ems.service.impl.BmiService;
import com.chidoscode.ems.service.impl.BmrService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/bmr")
public class BmrController {

    @Autowired
    BmrService bmrService;

    @PostMapping("/calculate")
    public double calculateBmr(@RequestBody BmrRequest bmrRequest){
        return bmrService.calculateBmr(bmrRequest);
    }
}

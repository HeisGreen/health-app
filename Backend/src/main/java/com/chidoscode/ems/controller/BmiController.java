package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.BmiRequest;
import com.chidoscode.ems.service.impl.BmiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "https://ems-two-gamma.vercel.app/"})
@RestController
@RequestMapping("/api/bmi")
public class BmiController {

    @Autowired
    BmiService bmiService;

    @PostMapping("/calculate")
    public double calculateBmi(@RequestBody BmiRequest bmiRequest, @AuthenticationPrincipal UserDetails userDetails
    ) {
        String username = userDetails.getUsername();
        return bmiService.calculateBmi(bmiRequest, username);
    }
}
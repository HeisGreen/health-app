package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.EerRequest;
import com.chidoscode.ems.service.impl.EerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/eer")
public class EerController {

    @Autowired
    EerService eerService;

    @PostMapping("/calculate")
    public double calculateEer(@RequestBody EerRequest eerRequest, @AuthenticationPrincipal UserDetails userDetails) {
        String username = userDetails.getUsername();
        return eerService.calculateEer(eerRequest, username);
    }
}

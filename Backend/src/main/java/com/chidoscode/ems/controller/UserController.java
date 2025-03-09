package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.UserRequest;
import com.chidoscode.ems.dto.UserResponse;
import com.chidoscode.ems.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "https://ems-two-gamma.vercel.app/"})
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/signup")
    public UserResponse createAccount(@RequestBody UserRequest userRequest) {
        return userService.createAccount(userRequest);
    }

}

package com.chidoscode.ems.controller;

import com.chidoscode.ems.dto.*;
import com.chidoscode.ems.service.impl.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = {"http://localhost:5173", "hhttps://health-app-ivory-one.vercel.app/"})
@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/signup")
    public UserResponse createAccount(@RequestBody UserRequest userRequest) {
        return userService.createAccount(userRequest);
    }

    @PostMapping("/login")
    public UserResponse login(@RequestBody UserLoginRequest userLoginRequest) {
        return userService.login(userLoginRequest);
    }

    @GetMapping("/getUsernames")
    public UserDetailsResponse login(@RequestParam String email) {
        return userService.getUserDetailsByEmail(email);
    }

    @PutMapping("/changePassword")
    public UserResponse changePassword(@RequestHeader("Authorization") String token, @RequestBody ChangePasswordRequest changePasswordRequest){
        return userService.changePassword(token, changePasswordRequest);
    }

    @DeleteMapping("/deleteAccount")
    public UserResponse deleteAccount(@RequestHeader("Authorization") String token){
        return userService.deleteAccount(token);
    }
}



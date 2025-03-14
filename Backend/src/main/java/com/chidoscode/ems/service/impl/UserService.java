package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.UserDetailsResponse;
import com.chidoscode.ems.dto.UserLoginRequest;
import com.chidoscode.ems.dto.UserRequest;
import com.chidoscode.ems.dto.UserResponse;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Map;

public interface UserService {
    UserResponse createAccount(UserRequest userRequest);
    UserResponse login(UserLoginRequest userLoginRequest);
    UserDetailsResponse getUserDetailsByEmail(String email);
}

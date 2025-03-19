package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.*;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

import java.util.Map;

public interface UserService {
    UserResponse createAccount(UserRequest userRequest);
    UserResponse login(UserLoginRequest userLoginRequest);
    UserDetailsResponse getUserDetailsByEmail(String email);
    UserResponse changePassword(String token, ChangePasswordRequest changePasswordRequest);
    UserResponse deleteAccount(String token);
}

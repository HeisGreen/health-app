package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.*;

public interface UserService {
    UserResponse createAccount(UserRequest userRequest);
    UserResponse login(UserLoginRequest userLoginRequest);
    UserDetailsResponse getUserDetailsByEmail(String email);
    UserResponse changePassword(String token, ChangePasswordRequest changePasswordRequest);
    UserResponse deleteAccount(String token);
    UserProfileDto getUserProfile(String email);
    UserResponse updateUserProfile(String email, UserProfileDto userProfileDto);
}

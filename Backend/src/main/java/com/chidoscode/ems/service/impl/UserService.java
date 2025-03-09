package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.UserRequest;
import com.chidoscode.ems.dto.UserResponse;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

public interface UserService {
    UserResponse createAccount(UserRequest userRequest);
}

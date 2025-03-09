package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.UserRequest;
import com.chidoscode.ems.dto.UserResponse;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.UserRepository;
import com.chidoscode.ems.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserResponse createAccount(UserRequest userRequest) {
        if (userRepository.existsByEmail(userRequest.getEmail())){
            UserResponse response = UserResponse.builder()
                    .responseCode(AccountUtils.ACCOUNT_ALREADY_EXISTS_CODE)
                    .responseMessage(AccountUtils.ACCOUNT_ALREADY_EXISTS_MESSAGE)
                    .build();
            return response;
        }
        User newUser = User.builder()
                .firstName(userRequest.getFirstName())
                .lastName(userRequest.getLastName())
                .email(userRequest.getEmail())
                .password(userRequest.getPassword())
                .gender(userRequest.getGender())
                .department(userRequest.getDepartment())
                .address(userRequest.getAddress())
                .phoneNumber(userRequest.getPhoneNumber())
                .build();

        User savedUser = userRepository.save(newUser);
        return UserResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_CREATION_CODE)
                .responseMessage(AccountUtils.ACCOUNT_CREATION_MESSAGE)
                .build();
    }
}

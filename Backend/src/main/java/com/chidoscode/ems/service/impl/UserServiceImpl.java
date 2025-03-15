package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.UserDetailsResponse;
import com.chidoscode.ems.dto.UserLoginRequest;
import com.chidoscode.ems.dto.UserRequest;
import com.chidoscode.ems.dto.UserResponse;
import com.chidoscode.ems.entity.Role;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.UserRepository;
import com.chidoscode.ems.security.JwtTokenProvider;
import com.chidoscode.ems.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtTokenProvider jwtTokenProvider;


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
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .gender(userRequest.getGender())
                .department(userRequest.getDepartment())
                .address(userRequest.getAddress())
                .phoneNumber(userRequest.getPhoneNumber())
                .role(Role.ROLE_USER)
                .build();

        User savedUser = userRepository.save(newUser);

        Authentication authentication = null;
        authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userRequest.getEmail(), userRequest.getPassword())
        );

        return UserResponse.builder()
                .responseCode(jwtTokenProvider.generateToken(authentication))
                .responseMessage(AccountUtils.ACCOUNT_CREATION_MESSAGE)
                .build();
    }

    public  UserResponse login(UserLoginRequest userLoginRequest){
        Authentication authentication = null;
        authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(userLoginRequest.getEmail(), userLoginRequest.getPassword())
        );
        return UserResponse.builder()
                .responseCode("Logged in successfully")
                .responseMessage(jwtTokenProvider.generateToken(authentication))
                .build();
    }

    @Override
    public UserDetailsResponse getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return UserDetailsResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }


}

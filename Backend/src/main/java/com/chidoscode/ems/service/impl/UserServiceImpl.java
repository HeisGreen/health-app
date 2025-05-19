package com.chidoscode.ems.service.impl;

import com.chidoscode.ems.dto.*;
import com.chidoscode.ems.entity.Role;
import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.repository.UserRepository;
import com.chidoscode.ems.security.JwtTokenProvider;
import com.chidoscode.ems.utils.AccountUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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
        try {
            Authentication authentication = null;
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userLoginRequest.getEmail(), userLoginRequest.getPassword())
            );
            return UserResponse.builder()
                    .responseCode("Logged in successfully")
                    .responseMessage(jwtTokenProvider.generateToken(authentication))
                    .build();

        }catch (BadCredentialsException e){
            return UserResponse.builder()
                    .responseCode(AccountUtils.BAD_CREDENTIALS_CODE)
                    .responseMessage(AccountUtils.BAD_CREDENTIALS_MESSAGE)
                    .build();
        }catch (Exception e){
            return UserResponse.builder()
                    .responseCode("Login failed")
                    .responseMessage("An error occured during login, Please try again")
                    .build();
        }


    }

    @Override
    public UserDetailsResponse getUserDetailsByEmail(String email) {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("Email not found"));

        return UserDetailsResponse.builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    @Override
    public UserResponse changePassword(String token, ChangePasswordRequest changePasswordRequest) {

        String username = jwtTokenProvider.getUsername(token);

        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("This user does not exist"));

        if (!passwordEncoder.matches(changePasswordRequest.getCurrentPassword(), user.getPassword())) {
           return UserResponse.builder()
                    .responseCode(AccountUtils.PASSWORD_INCORRECT_CODE)
                    .responseMessage(AccountUtils.PASSWORD_INCORRECT_MESSAGE)
                    .build();
        }

        String hashPassword = passwordEncoder.encode(changePasswordRequest.getNewPassword());

        user.setPassword(hashPassword);
        userRepository.save(user);
        return UserResponse.builder()
                .responseCode(AccountUtils.PASSWORD_CHANGED_SUCCESSFULLY_CODE)
                .responseMessage(AccountUtils.PASSWORD_CHANGED_SUCCESSFULLY_MESSAGE)
                .build();
    }

    @Override
    public UserResponse deleteAccount(String token) {
        String username = jwtTokenProvider.getUsername(token);

        User user = userRepository.findByEmail(username).orElseThrow(() -> new RuntimeException("This user does not exist"));

        userRepository.delete(user);
        return UserResponse.builder()
                .responseCode(AccountUtils.ACCOUNT_DELETION_CODE)
                .responseMessage(AccountUtils.ACCOUNT_DELETION_MESSAGE)
                .build();
    }

    @Override
    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return new UserProfileDto().builder()
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .gender(user.getGender())
                .phoneNumber(user.getPhoneNumber())
                .profilePicture(user.getProfilePicture())
                .build();
}

    @Override
    public UserResponse updateUserProfile(String email, UserProfileDto userProfileDto) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        user.setFirstName(userProfileDto.getFirstName());
        user.setLastName(userProfileDto.getLastName());
        user.setGender(userProfileDto.getGender());
        user.setPhoneNumber(userProfileDto.getPhoneNumber());
        user.setProfilePicture(userProfileDto.getProfilePicture());

        userRepository.save(user);
        return UserResponse.builder()
                .responseCode(AccountUtils.PROFILE_UPDATE_SUCCESS_CODE)
                .responseMessage(AccountUtils.PROFILE_UPDATE_SUCCESS_MESSAGE)
                .build();
    }
}

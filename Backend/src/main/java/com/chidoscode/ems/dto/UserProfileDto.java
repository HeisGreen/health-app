package com.chidoscode.ems.dto;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProfileDto {
    private String firstName;
    private String lastName;
    private String email;
    private String gender;
    private String phoneNumber;
    private String profilePicture;
}

package com.chidoscode.ems.dto;

import lombok.*;
import org.springframework.stereotype.Component;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserResponse {
    private String responseCode;
    private String responseMessage;
}

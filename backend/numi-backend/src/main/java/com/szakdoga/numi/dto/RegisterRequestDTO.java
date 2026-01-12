package com.szakdoga.numi.dto;

import lombok.Data;

@Data
public class RegisterRequestDTO {
    // Csak ezeket engedjük be a külvilágból:
    private String username;
    private String email;
    private String password;
}

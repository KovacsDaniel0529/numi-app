package com.szakdoga.numi.dto;

import lombok.Data;

@Data
public class PasswordChangeRequestDTO {
    private String currentPassword;
    private String newPassword;
}

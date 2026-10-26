package com.szakdoga.numi.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponseDTO {
    // Ezeket látja majd a React válaszként:
    private Long id;
    private String username;
    private String email;

    // Ez jön a BaseEntity-ből:
    private LocalDateTime createdAt;
    private ProfileResponseDTO profileDetail;
}

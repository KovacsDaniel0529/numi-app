package com.szakdoga.numi.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProfileResponseDTO {
    private String firstName;
    private Integer age;
    private Double weight;
    private Double height;
    private String gender;
    private String goal;

    // Plusz infó: mikor módosult utoljára a profil?
    private LocalDateTime updatedAt;
}

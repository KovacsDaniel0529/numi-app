package com.szakdoga.numi.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class ProfileResponseDTO {
    private String firstName;
    private Integer age;
    private Double weight;
    private Double height;
    private String gender;
    private String goal;

    private Double activityLevel;
    private String dietaryPreference;
    private List<String> allergies;
    private Integer dailyCalorieGoal;

    // Plusz infó: mikor módosult utoljára a profil?
    private LocalDateTime updatedAt;

}

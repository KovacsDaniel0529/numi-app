package com.szakdoga.numi.dto;

import lombok.Data;

import java.util.List;

@Data
public class ProfileRequestDTO {
    private String firstName;
    private Integer age;
    private Double weight;
    private Double height;
    private String gender;
    private String goal;
    private Double activityLevel;
    private String dietaryPreference;
    private Integer dailyCalorieGoal;
    private List<String> allergies;
    private List<String> digestiveIssues;
}

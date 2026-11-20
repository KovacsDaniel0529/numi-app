package com.szakdoga.numi.dto;

import com.szakdoga.numi.model.AllergenType;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
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

    // Csak ezek az értékek fogadhatók el (a null is, ilyenkor nincs megadva)
    @Pattern(regexp = "omnivore|vegetarian|vegan|pescatarian",
            message = "Ismeretlen étrendi preferencia.")
    private String dietaryPreference;

    private Integer dailyCalorieGoal;
    private List<AllergenType> allergies;

    @Size(max = 5, message = "Legfeljebb 5 emésztési panasz adható meg.")
    private List<@Pattern(regexp = "bloating|reflux|ibs|constipation|diarrhea",
            message = "Ismeretlen emésztési panasz.") String> digestiveIssues;
}
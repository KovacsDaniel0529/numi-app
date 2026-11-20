package com.szakdoga.numi.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data

public class SavedRecipeResponseDTO {
    private Long id;
    private String title;
    private String description;
    private List<String> ingredients;
    private List<String> steps;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;
    private LocalDateTime savedAt;

    // A felhasználó JELENLEGI allergiái alapján talált problémák (üres = nincs).
    // Azért nem mentjük el, mert az allergiák később változhatnak.
    private List<String> allergenWarnings;
}

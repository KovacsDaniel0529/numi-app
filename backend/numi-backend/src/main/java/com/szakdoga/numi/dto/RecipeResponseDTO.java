package com.szakdoga.numi.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

// Az AI ebben a formában adja vissza a receptet (a Jackson ebbe olvassa be a JSON-t),
// és ugyanez megy tovább a frontendnek is.
@Data
@NoArgsConstructor
@JsonIgnoreProperties(ignoreUnknown = true)
public class RecipeResponseDTO {
    private String title;
    private String description;
    private List<String> ingredients;
    private List<String> steps;
    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;
}
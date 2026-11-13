package com.szakdoga.numi.dto;

import lombok.Data;

@Data
public class RecipeRequestDTO {
    // Szabad szöveg, pl. "vacsora, gyors, csirkével" - nem kötelező
    private String preferences;
}

package com.szakdoga.numi.dto;
import lombok.*;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodResponseDTO {
    private Long id;
    private String name;
    private String category;
    private String brand;

    // A frontend ezeket a neveket olvassa (pl. food.calories)
    private BigDecimal calories;
    private BigDecimal protein;
    private BigDecimal carbs;
    private BigDecimal fat;
    private BigDecimal fiber;

    private String servingUnit; // pl. "g" vagy "adag"
    private Boolean isRecipe;
    private List<String> allergens; // hogy ne akadjon el a React szűrője
}

package com.szakdoga.numi.dto;


import com.szakdoga.numi.model.MealType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
public class MealSectionDTO {
    private MealType mealType;
    private BigDecimal calories;               // az adott étkezés összes kalóriája
    private List<FoodLogResponseDTO> entries;  // az étkezés tételei
}

package com.szakdoga.numi.dto;
import com.szakdoga.numi.model.MealType;
import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
public class FoodLogResponseDTO {
    private Long id;
    private String foodName;
    private BigDecimal quantityGrams;
    private MealType mealType;
    private LocalDate logDate;

    // Ezek MÁR a mennyiséghez arányosított értékek, nem a 100g-os alapérték!
    private BigDecimal calories;
    private BigDecimal protein;
    private BigDecimal carbs;
    private BigDecimal fat;
    private BigDecimal fiber;
}

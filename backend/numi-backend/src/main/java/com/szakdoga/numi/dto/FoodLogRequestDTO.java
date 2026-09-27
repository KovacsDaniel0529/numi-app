package com.szakdoga.numi.dto;
import com.szakdoga.numi.model.MealType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
@Data
public class FoodLogRequestDTO {
    private Long foodId;
    private BigDecimal quantityGrams;
    private MealType mealType;
    private LocalDate logDate;

}

package com.szakdoga.numi.mapper;
import com.szakdoga.numi.dto.FoodLogResponseDTO;
import com.szakdoga.numi.model.Food;
import com.szakdoga.numi.model.FoodLog;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Component

public class FoodLogMapper {
    private static final BigDecimal HUNDRED = BigDecimal.valueOf(100);

    public FoodLogResponseDTO toDTO(FoodLog foodLog) {
        Food food = foodLog.getFood();
        BigDecimal quantity = foodLog.getQuantityGrams();

        // Arány: pl. 150g / 100g = 1.5
        BigDecimal ratio = quantity.divide(HUNDRED, 4, RoundingMode.HALF_UP);

        return FoodLogResponseDTO.builder()
                .id(foodLog.getId())
                .foodName(food.getName())
                .quantityGrams(quantity)
                .mealType(foodLog.getMealType())
                .logDate(foodLog.getLogDate())
                .calories(scale(food.getCalories100g().multiply(ratio)))
                .protein(scale(food.getProtein100g().multiply(ratio)))
                .carbs(scale(food.getCarbs100g().multiply(ratio)))
                .fat(scale(food.getFat100g().multiply(ratio)))
                .fiber(food.getFiber100g() != null ? scale(food.getFiber100g().multiply(ratio)) : null)
                .build();
    }

    private BigDecimal scale(BigDecimal value) {
        return value.setScale(2, RoundingMode.HALF_UP);
    }

}

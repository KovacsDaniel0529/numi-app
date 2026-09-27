package com.szakdoga.numi.mapper;

import com.szakdoga.numi.dto.FoodResponseDTO;
import com.szakdoga.numi.model.Food;
import org.springframework.stereotype.Component;

import java.util.Collections;
@Component
public class FoodMapper {
    public FoodResponseDTO toDTO(Food food) {
        if (food == null) {
            return null;
        }

        return FoodResponseDTO.builder()
                .id(food.getId())
                .name(food.getName())
                .category(food.getCategory())
                .brand("Alapanyag") // Mivel az SQL-ben alapanyagok vannak
                // Az adatbázis 'calories_100g' értékét átnevezzük a DTO 'calories' mezőjére:
                .calories(food.getCalories100g())
                .protein(food.getProtein100g())
                .carbs(food.getCarbs100g())
                .fat(food.getFat100g())
                .fiber(food.getFiber100g())
                .servingUnit("g") // Alapanyagoknál 100 gramm az alapértelmezett mértékegység
                .isRecipe(false)
                .allergens(Collections.emptyList()) // Alapértelmezetten üres lista
                .build();
    }
}

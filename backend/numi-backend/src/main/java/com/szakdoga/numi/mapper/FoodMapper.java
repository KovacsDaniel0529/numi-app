package com.szakdoga.numi.mapper;

import com.szakdoga.numi.dto.FoodResponseDTO;
import com.szakdoga.numi.model.AllergenType;
import com.szakdoga.numi.model.Food;
import org.springframework.stereotype.Component;

import java.util.Collections;
import java.util.List;

@Component
public class FoodMapper {
    public FoodResponseDTO toDTO(Food food, List<AllergenType> userAllergies) {
        if (food == null) {
            return null;
        }
        List<AllergenType> foodAllergens = food.getAllergens() != null ? food.getAllergens() : Collections.emptyList();
        List<AllergenType> matched = foodAllergens.stream()
                .filter(userAllergies::contains)
                .toList();
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
                .allergens(foodAllergens) // Alapértelmezetten üres lista
                .allergyWarning(!matched.isEmpty())
                .matchedAllergens(matched)
                .build();
    }
    public FoodResponseDTO toDTO(Food food) {
        return toDTO(food, Collections.emptyList());
    }
}

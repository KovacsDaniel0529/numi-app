package com.szakdoga.numi.service;

import com.szakdoga.numi.dto.FoodResponseDTO;
import com.szakdoga.numi.mapper.FoodMapper;
import com.szakdoga.numi.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import com.szakdoga.numi.model.Food;

import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;
    private final FoodMapper foodMapper;

    public List<FoodResponseDTO> getFoods(String search) {
        List <Food> foods;

        // Ha a frontend küldött keresési szöveget és nem üres
        if (search != null && !search.trim().isEmpty()) {
            foods = foodRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            // Ha nincs keresési feltétel, visszaadjuk mind a 113 alapanyagot
            foods = foodRepository.findAll();
        }

        // Végigmegyünk a listán és a Mapper segítségével mindegyik Food entitást átalakítjuk FoodResponseDTO-vá
        return foods.stream()
                .map(foodMapper::toDTO)
                .toList();
    }
}

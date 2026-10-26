package com.szakdoga.numi.service;

import com.szakdoga.numi.dto.FoodResponseDTO;
import com.szakdoga.numi.mapper.FoodMapper;
import com.szakdoga.numi.model.AllergenType;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import com.szakdoga.numi.model.Food;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;


@Service
@RequiredArgsConstructor
public class FoodService {
    private final FoodRepository foodRepository;
    private final AppUserRepository appUserRepository;
    private final FoodMapper foodMapper;

    @Transactional(readOnly = true)
    public List<FoodResponseDTO> getFoods(String search, String username) {
        List<Food> foods;

        if (search != null && !search.trim().isEmpty()) {
            foods = foodRepository.findByNameContainingIgnoreCase(search.trim());
        } else {
            foods = foodRepository.findAll();
        }

        List<AllergenType> userAllergies = getUserAllergies(username);

        return foods.stream()
                .map(food -> foodMapper.toDTO(food, userAllergies))
                .toList();
    }

    private List<AllergenType> getUserAllergies(String username) {
        if (username == null || username.isBlank()) {
            return Collections.emptyList();
        }

        return appUserRepository.findByUsername(username)
                .map(AppUser::getProfileDetail)
                .map(profile -> profile.getAllergies())
                .orElse(Collections.emptyList());
    }
}

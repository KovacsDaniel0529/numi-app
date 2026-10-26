package com.szakdoga.numi.service;
import com.szakdoga.numi.dto.FoodLogRequestDTO;
import com.szakdoga.numi.dto.FoodLogResponseDTO;
import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.mapper.FoodLogMapper;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.Food;
import com.szakdoga.numi.model.FoodLog;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.FoodLogRepository;
import com.szakdoga.numi.repository.FoodRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class FoodLogService {
    private final FoodLogRepository foodLogRepository;
    private final AppUserRepository appUserRepository;
    private final FoodRepository foodRepository;
    private final FoodLogMapper foodLogMapper;

    public FoodLogResponseDTO addFoodLog(String username, FoodLogRequestDTO request) {
        if (request.getQuantityGrams() == null || request.getQuantityGrams().signum() <= 0) {
            throw new BadRequestException("A mennyiségnek nagyobbnak kell lennie nullánál!");
        }
        if (request.getFoodId() == null || request.getMealType() == null) {
            throw new BadRequestException("Az étel és az étkezés típusa kötelező!");
        }
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));

        Food food = foodRepository.findById(request.getFoodId())
                .orElseThrow(() -> new ResourceNotFoundException("Nincs ilyen alapanyag!"));

        FoodLog foodLog = FoodLog.builder()
                .appUser(user)
                .food(food)
                .quantityGrams(request.getQuantityGrams())
                .mealType(request.getMealType())
                .logDate(request.getLogDate() != null ? request.getLogDate() : LocalDate.now())
                .build();

        FoodLog saved = foodLogRepository.save(foodLog);
        return foodLogMapper.toDTO(saved);
    }

    public List<FoodLogResponseDTO> getDailyLog(String username, LocalDate date) {
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));

        LocalDate targetDate = date != null ? date : LocalDate.now();

        return foodLogRepository.findByAppUserAndLogDate(user, targetDate)
                .stream()
                .map(foodLogMapper::toDTO)
                .toList();
    }

    public void deleteFoodLog(Long id) {
        if (!foodLogRepository.existsById(id)) {
            throw new ResourceNotFoundException("Nincs ilyen naplóbejegyzés!");
        }
        foodLogRepository.deleteById(id);
    }
}


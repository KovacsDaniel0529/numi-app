package com.szakdoga.numi.controller;
import com.szakdoga.numi.dto.FoodLogRequestDTO;
import com.szakdoga.numi.dto.FoodLogResponseDTO;
import com.szakdoga.numi.service.FoodLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/food-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FoodLogController {
    private final FoodLogService foodLogService;

    // POST http://localhost:8080/api/food-logs/danika
    @PostMapping("/{username}")
    public FoodLogResponseDTO addFoodLog(
            @PathVariable String username,
            @RequestBody FoodLogRequestDTO request
    ) {
        return foodLogService.addFoodLog(username, request);
    }

    // GET http://localhost:8080/api/food-logs/danika?date=2026-09-27
    @GetMapping("/{username}")
    public List<FoodLogResponseDTO> getDailyLog(
            @PathVariable String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return foodLogService.getDailyLog(username, date);
    }

    // DELETE http://localhost:8080/api/food-logs/7
    @DeleteMapping("/{id}")
    public void deleteFoodLog(@PathVariable Long id) {
        foodLogService.deleteFoodLog(id);
    }
}

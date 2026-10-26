package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.FoodResponseDTO;
import com.szakdoga.numi.model.Food;
import com.szakdoga.numi.repository.FoodRepository;
import com.szakdoga.numi.service.FoodService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController 
@RequestMapping("/api/foods")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodService foodService;

    // GET kérés: http://localhost:8080/api/foods
    // VAGY kereséssel: http://localhost:8080/api/foods?search=csirke
    @GetMapping
    public ResponseEntity<List<FoodResponseDTO>> getAllFoods(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String username
    ) {
        List<FoodResponseDTO> response = foodService.getFoods(search, username);
        return ResponseEntity.ok(response);
    }
}

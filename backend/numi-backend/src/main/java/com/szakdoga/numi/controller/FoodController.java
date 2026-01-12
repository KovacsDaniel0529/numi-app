package com.szakdoga.numi.controller;

import com.szakdoga.numi.model.Food;
import com.szakdoga.numi.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController // Jelzi, hogy ez egy API végpont
@RequestMapping("/api/foods") // Ezen a címen lesz elérhető: localhost:8080/api/foods
@CrossOrigin(origins = "*") // FONTOS! Ez engedi majd a React-nak a hozzáférést
public class FoodController {

    private final FoodRepository foodRepository;

    // Itt injektáljuk be a Repository-t (Constructor Injection)
    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

    // 1. Összes étel lekérése (GET kérés)
    @GetMapping
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

    // 2. Új étel hozzáadása (POST kérés) - Ezt majd később teszteljük
    @PostMapping
    public Food createFood(@RequestBody Food food) {
        return foodRepository.save(food);
    }
}
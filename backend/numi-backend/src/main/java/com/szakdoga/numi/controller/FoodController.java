package com.szakdoga.numi.controller;

import com.szakdoga.numi.model.Food;
import com.szakdoga.numi.repository.FoodRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController 
@RequestMapping("/api/foods") 
@CrossOrigin(origins = "*")
public class FoodController {

    private final FoodRepository foodRepository;

    
    public FoodController(FoodRepository foodRepository) {
        this.foodRepository = foodRepository;
    }

   
    @GetMapping
    public List<Food> getAllFoods() {
        return foodRepository.findAll();
    }

  
    @PostMapping
    public Food createFood(@RequestBody Food food) {
        return foodRepository.save(food);
    }
}

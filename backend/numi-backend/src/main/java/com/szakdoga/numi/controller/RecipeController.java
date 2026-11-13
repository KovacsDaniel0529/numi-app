package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.RecipeRequestDTO;
import com.szakdoga.numi.dto.RecipeResponseDTO;
import com.szakdoga.numi.service.RecipeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class RecipeController {

    private final RecipeService recipeService;

    // POST http://localhost:8080/api/recipes/DANIKA   body: { "preferences": "vacsora, gyors" }
    @PostMapping("/{username}")
    public RecipeResponseDTO generateRecipe(
            @PathVariable String username,
            @RequestBody(required = false) RecipeRequestDTO request
    ) {
        return recipeService.generateRecipe(username, request);
    }
}

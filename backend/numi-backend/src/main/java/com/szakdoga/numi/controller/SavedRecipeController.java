package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.SaveRecipeRequestDTO;
import com.szakdoga.numi.dto.SavedRecipeResponseDTO;
import com.szakdoga.numi.service.SavedRecipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-recipes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class SavedRecipeController {

    private final SavedRecipeService savedRecipeService;

    // POST   /api/saved-recipes/DANIKA        body: a recept
    @PostMapping("/{username}")
    @ResponseStatus(HttpStatus.CREATED)
    public SavedRecipeResponseDTO save(@PathVariable String username,
                                       @Valid @RequestBody SaveRecipeRequestDTO request) {
        return savedRecipeService.save(username, request);
    }

    // GET    /api/saved-recipes/DANIKA
    @GetMapping("/{username}")
    public List<SavedRecipeResponseDTO> list(@PathVariable String username) {
        return savedRecipeService.list(username);
    }

    // DELETE /api/saved-recipes/DANIKA/5
    @DeleteMapping("/{username}/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable String username, @PathVariable Long id) {
        savedRecipeService.delete(username, id);
    }
}
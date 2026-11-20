package com.szakdoga.numi.service;

import com.szakdoga.numi.dto.SaveRecipeRequestDTO;
import com.szakdoga.numi.dto.SavedRecipeResponseDTO;
import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ConflictException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.model.AllergenType;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.SavedRecipe;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.SavedRecipeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedRecipeService {

    // Egy felhasználó legfeljebb ennyi receptet menthet (az adatbázis ne nőjön a végtelenségig)
    private static final int MAX_SAVED_PER_USER = 30;

    private final SavedRecipeRepository savedRecipeRepository;
    private final AppUserRepository appUserRepository;
    private final RecipeSafetyChecker safetyChecker;

    @Transactional
    public SavedRecipeResponseDTO save(String username, SaveRecipeRequestDTO request) {
        AppUser user = findUser(username);

        if (savedRecipeRepository.countByAppUser(user) >= MAX_SAVED_PER_USER) {
            throw new BadRequestException("Legfeljebb " + MAX_SAVED_PER_USER
                    + " receptet menthetsz. Törölj egyet, mielőtt újat mentenél.");
        }
        if (savedRecipeRepository.existsByAppUserAndTitleIgnoreCase(user, request.getTitle().trim())) {
            throw new ConflictException("Ez a recept már el van mentve.");
        }

        SavedRecipe recipe = new SavedRecipe();
        recipe.setAppUser(user);
        recipe.setTitle(request.getTitle().trim());
        recipe.setDescription(request.getDescription());
        recipe.setIngredients(new ArrayList<>(request.getIngredients()));
        recipe.setSteps(new ArrayList<>(request.getSteps()));
        recipe.setCalories(request.getCalories());
        recipe.setProtein(request.getProtein());
        recipe.setCarbs(request.getCarbs());
        recipe.setFat(request.getFat());

        return toDto(savedRecipeRepository.save(recipe), allergiesOf(user));
    }

    // readOnly + @Transactional: a lusta (LAZY) listák betöltéséhez kell nyitva lennie a tranzakciónak
    @Transactional(readOnly = true)
    public List<SavedRecipeResponseDTO> list(String username) {
        AppUser user = findUser(username);
        List<AllergenType> allergies = allergiesOf(user);

        return savedRecipeRepository.findByAppUserOrderByIdDesc(user).stream()
                .map(recipe -> toDto(recipe, allergies))
                .toList();
    }

    @Transactional
    public void delete(String username, Long id) {
        AppUser user = findUser(username);
        SavedRecipe recipe = savedRecipeRepository.findByIdAndAppUser(id, user)
                .orElseThrow(() -> new ResourceNotFoundException("A recept nem található."));
        savedRecipeRepository.delete(recipe);
    }

    private AppUser findUser(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("A felhasználó nem található."));
    }

    private List<AllergenType> allergiesOf(AppUser user) {
        if (user.getProfileDetail() == null || user.getProfileDetail().getAllergies() == null) {
            return List.of();
        }
        return user.getProfileDetail().getAllergies();
    }

    private SavedRecipeResponseDTO toDto(SavedRecipe recipe, List<AllergenType> allergies) {
        SavedRecipeResponseDTO dto = new SavedRecipeResponseDTO();
        dto.setId(recipe.getId());
        dto.setTitle(recipe.getTitle());
        dto.setDescription(recipe.getDescription());
        dto.setIngredients(new ArrayList<>(recipe.getIngredients()));
        dto.setSteps(new ArrayList<>(recipe.getSteps()));
        dto.setCalories(recipe.getCalories());
        dto.setProtein(recipe.getProtein());
        dto.setCarbs(recipe.getCarbs());
        dto.setFat(recipe.getFat());
        dto.setSavedAt(recipe.getSavedAt());
        // Újra lefuttatjuk az ellenőrzést a JELENLEGI allergiákkal
        dto.setAllergenWarnings(safetyChecker.findViolations(recipe.getIngredients(), allergies));
        return dto;
    }
}
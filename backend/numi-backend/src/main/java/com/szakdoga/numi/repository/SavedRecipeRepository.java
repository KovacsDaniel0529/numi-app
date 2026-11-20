package com.szakdoga.numi.repository;

import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.SavedRecipe;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedRecipeRepository extends JpaRepository<SavedRecipe, Long> {

    List<SavedRecipe> findByAppUserOrderByIdDesc(AppUser appUser);

    // Így nem lehet más felhasználó receptjét törölni, még ha ismerjük is az id-jét
    Optional<SavedRecipe> findByIdAndAppUser(Long id, AppUser appUser);

    long countByAppUser(AppUser appUser);

    boolean existsByAppUserAndTitleIgnoreCase(AppUser appUser, String title);

    void deleteByAppUser(AppUser appUser);
}
package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

// Egy felhasználó által elmentett (AI-generált) recept.
@Entity
@Table(name = "saved_recipes")
@Getter
@Setter
@NoArgsConstructor
public class SavedRecipe {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "app_user_id")
    private AppUser appUser;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(length = 1000)
    private String description;

    // A listák külön táblában tárolódnak; az @OrderColumn miatt megmarad a sorrendjük
    // (a lépéseknél ez fontos).
    @ElementCollection
    @CollectionTable(name = "saved_recipe_ingredients", joinColumns = @JoinColumn(name = "recipe_id"))
    @OrderColumn(name = "position")
    @Column(name = "ingredient", length = 300)
    private List<String> ingredients = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "saved_recipe_steps", joinColumns = @JoinColumn(name = "recipe_id"))
    @OrderColumn(name = "position")
    @Column(name = "step", length = 1000)
    private List<String> steps = new ArrayList<>();

    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fat;

    @Column(nullable = false)
    private LocalDateTime savedAt;

    @PrePersist
    void onCreate() {
        savedAt = LocalDateTime.now();
    }
}

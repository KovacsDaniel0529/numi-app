package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity 
@Table(name = "foods") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String category;

    @Column(name = "calories_100g", nullable = false)
    private BigDecimal calories100g;

    @Column(name = "protein_100g", nullable = false)
    private BigDecimal protein100g;

    @Column(name = "carbs_100g", nullable = false)
    private BigDecimal carbs100g;

    @Column(name = "fat_100g", nullable = false)
    private BigDecimal fat100g;

    @Column(name = "fiber_100g")
    private BigDecimal fiber100g;

    @Column(name = "is_custom")
    private Boolean isCustom = false;

    
    // Getterek, Setterek...

    
    // private boolean isGlutenFree;
    // private boolean isLactoseFree;
}

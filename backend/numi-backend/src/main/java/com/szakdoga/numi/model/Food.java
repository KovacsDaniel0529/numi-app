package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity 
@Table(name = "foods") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Egyedi azonosító (1, 2, 3...)

    private String name; // Étel neve (pl. "Csirkemell")

    private int calories; // Kalória (pl. 110 kcal)

    private double protein; // Fehérje

    private double carbs; // Szénhidrát

    private double fat; // Zsír

    
    // private boolean isGlutenFree;
    // private boolean isLactoseFree;
}

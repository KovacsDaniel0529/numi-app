package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity // Ez mondja meg, hogy ebből Adatbázis Tábla legyen
@Table(name = "foods") // A tábla neve 'foods' lesz
@Data // Lombok: Generál gettereket, settereket helyetted
@NoArgsConstructor // Kell a JPA-nak egy üres konstruktor
@AllArgsConstructor // Generál egy konstruktort minden paraméterrel
public class Food {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id; // Egyedi azonosító (1, 2, 3...)

    private String name; // Étel neve (pl. "Csirkemell")

    private int calories; // Kalória (pl. 110 kcal)

    private double protein; // Fehérje

    private double carbs; // Szénhidrát

    private double fat; // Zsír

    // Ide jöhet majd később:
    // private boolean isGlutenFree;
    // private boolean isLactoseFree;
}

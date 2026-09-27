package com.szakdoga.numi.model; // Figyelj a saját csomagnevedre!

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity // 1. Ezzel jelezzük a Springnek és a Hibernate-nek, hogy ez az osztály egy adatbázis táblát reprezentál.
@Table(name = "foods") // 2. Megmondjuk, hogy a PostgreSQL-ben a tábla neve pontosan "foods".
@Getter // 3. Lombok: automatikusan legenerálja az összes getter metódust (getName(), getId(), stb.).
@Setter // 4. Lombok: automatikusan legenerálja az összes setter metódust a háttérben.
@NoArgsConstructor // 5. Lombok: JPA-nak KÖTELEZŐ egy paraméter nélküli üres konstruktor, különben nem tudja példányosítani az adatbázisból kiolvasott sort.
@AllArgsConstructor // 6. Lombok: csinál egy olyan konstruktort, amiben az összes mező benne van.
@Builder // 7. Lombok: kényelmes tervezési minta (Food.builder().name("Alma").build()), amivel könnyen tudunk új objektumot gyártani.
public class Food extends BaseEntity {

    // MEGJEGYZÉS: Ha a BaseEntity osztályodban már benne van az 'id' mező (@Id private Long id;),
    // akkor itt NEM kell újra felvenni! Ha nincs a BaseEntity-ben, akkor vedd fel:
     @Id
     @GeneratedValue(strategy = GenerationType.IDENTITY)
     private Long id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "category")
    private String category;

    // Miért BigDecimal és miért nem double vagy float?
    // Lebegőpontos számoknál (double/float) előfordulhatnak kerekítési hibák (pl. 0.1 + 0.2 = 0.30000000000000004).
    // Egy dietetikus appnál a makróknak (fehérje, szénhidrát, zsír) pontosnak kell lenniük, ezért a BigDecimal a szabvány.
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

    // Megkülönbözteti, hogy a beépített 113 alapanyag egyike (false),
    // vagy a felhasználó maga hozta létre (true).
    @Column(name = "is_custom")
    @Builder.Default
    private Boolean isCustom = false;
}
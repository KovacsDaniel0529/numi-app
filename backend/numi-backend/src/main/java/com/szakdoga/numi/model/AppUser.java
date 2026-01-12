package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_users") // A tábla neve 'foods' lesz
@Data // Lombok: Generál gettereket, settereket helyetted
@NoArgsConstructor // Kell a JPA-nak egy üres konstruktor
@AllArgsConstructor // Generál egy konstruktort minden paraméterrel
public class  AppUser extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false) // Egyedi felhasználónév!
    private String username;

    @Column(unique = true, nullable = false) // Egyedi email!
    private String email;

    @Column(nullable = false)
    private String password;

    // --- A KAPCSOLAT ---
    // Itt mondjuk meg, hogy ehhez a userhez tartozik egy profil.
    // A "mappedBy" azt jelenti: "Nem én tárolom a kulcsot, hanem a másik osztály 'user' mezője."
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ProfileDetail profileDetail;
}

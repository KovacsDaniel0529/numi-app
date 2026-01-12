package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "app_users") 
@Data 
@NoArgsConstructor 
@AllArgsConstructor 
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
    
    // Itt mondjuk meg, hogy ehhez a userhez tartozik egy profil.
    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL)
    private ProfileDetail profileDetail;
}

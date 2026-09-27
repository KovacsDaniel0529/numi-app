package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "app_users")
@Getter
@Setter
@ToString(exclude = "profileDetail")
@EqualsAndHashCode(exclude = "profileDetail")
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

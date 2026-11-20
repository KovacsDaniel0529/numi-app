package com.szakdoga.numi.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

// Belépéshez csak ez a két adat kell. Eddig az AppUser entitás volt a kérés típusa,
// ami rossz minta: az entitás az adatbázis szerkezetét tükrözi, nem a kérést.
@Data
public class LoginRequestDTO {

    @NotBlank(message = "A felhasználónév és a jelszó megadása kötelező!")
    private String username;

    @NotBlank(message = "A felhasználónév és a jelszó megadása kötelező!")
    private String password;
}
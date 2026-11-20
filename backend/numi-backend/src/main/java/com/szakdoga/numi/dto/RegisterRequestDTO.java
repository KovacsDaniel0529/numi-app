    package com.szakdoga.numi.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class RegisterRequestDTO {

    // A felhasználónév az URL-ekben is szerepel (pl. /api/calendar/{username}/day),
    // ezért csak URL-barát karaktereket engedünk meg.
    @NotBlank(message = "A felhasználónév megadása kötelező!")
    @Size(min = 3, max = 30, message = "A felhasználónév 3 és 30 karakter között legyen!")
    @Pattern(regexp = "^[A-Za-z0-9_.-]*$",
            message = "A felhasználónév csak angol betűt, számot, pontot, kötőjelet és aláhúzást tartalmazhat!")
    private String username;

    @NotBlank(message = "Az email cím megadása kötelező!")
    @Email(message = "Kérlek, valós email címet adj meg!")
    @Size(max = 100, message = "Az email cím legfeljebb 100 karakter lehet!")
    private String email;

    // A BCrypt legfeljebb 72 bájtot dolgoz fel, ezért a felső korlát
    @NotBlank(message = "A jelszó megadása kötelező!")
    @Size(min = 6, max = 72, message = "A jelszó 6 és 72 karakter között legyen!")
    private String password;
}
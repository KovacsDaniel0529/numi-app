package com.szakdoga.numi.dto;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;
@Data
public class SaveRecipeRequestDTO {
    @NotBlank(message = "A recept címe kötelező.")
    @Size(max = 200, message = "A cím legfeljebb 200 karakter lehet.")
    private String title;

    @Size(max = 1000, message = "A leírás legfeljebb 1000 karakter lehet.")
    private String description;

    @NotEmpty(message = "A hozzávalók listája nem lehet üres.")
    @Size(max = 50, message = "Legfeljebb 50 hozzávaló lehet.")
    private List<@NotBlank @Size(max = 300) String> ingredients;

    @NotEmpty(message = "Az elkészítés lépései nem lehetnek üresek.")
    @Size(max = 30, message = "Legfeljebb 30 lépés lehet.")
    private List<@NotBlank @Size(max = 1000) String> steps;

    @Min(0) @Max(100000) private Integer calories;
    @Min(0) @Max(100000) private Integer protein;
    @Min(0) @Max(100000) private Integer carbs;
    @Min(0) @Max(100000) private Integer fat;
}

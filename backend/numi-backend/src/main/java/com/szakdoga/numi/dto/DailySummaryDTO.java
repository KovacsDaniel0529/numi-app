package com.szakdoga.numi.dto;

import lombok.Builder;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@Builder
public class DailySummaryDTO {
    private LocalDate date;
    private List<MealSectionDTO> meals;

    private BigDecimal totalCalories;
    private BigDecimal totalProtein;
    private BigDecimal totalCarbs;
    private BigDecimal totalFat;
    private BigDecimal totalFiber;

    private Integer calorieGoal;            // null, ha még nincs profil
    private BigDecimal caloriesRemaining;   // cél - elfogyasztott (negatív, ha túllépte)

    private Integer waterMl;
    private Integer waterGoalMl;   // pontosan ez a név, "Ml" a végén
}
package com.szakdoga.numi.dto;

import java.time.LocalDate;
import java.util.List;

public class DailySummaryDTO {
    private LocalDate date;
    private List<FoodLogResponseDTO> meals;      // a FoodLog bejegyzések
    private Integer totalCaloriesConsumed;
    private Integer totalWaterMl;                 // a WaterLog bejegyzések összege
    private Integer calorieGoal;                   // a ProfileDetail-ből
    private Integer waterGoal;
}

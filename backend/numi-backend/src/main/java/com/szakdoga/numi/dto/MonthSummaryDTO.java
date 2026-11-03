package com.szakdoga.numi.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class MonthSummaryDTO {
    private int year;
    private int month;
    private Integer calorieGoal;
    private Integer waterGoalMl;
    private List<CalendarDayDTO> days;
}

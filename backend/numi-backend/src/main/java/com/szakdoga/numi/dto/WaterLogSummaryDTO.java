package com.szakdoga.numi.dto;


import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;

@Data
@Builder
public class WaterLogSummaryDTO {
    private LocalDate date;
    private Integer totalAmountMl;
    private Integer goalMl;
}

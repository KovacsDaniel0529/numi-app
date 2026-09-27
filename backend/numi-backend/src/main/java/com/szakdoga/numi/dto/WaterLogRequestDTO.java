package com.szakdoga.numi.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class WaterLogRequestDTO {
    private Integer amountMl;
    private LocalDate logDate;
}

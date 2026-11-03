package com.szakdoga.numi.repository;

import java.time.LocalDate;

public interface DailyWaterTotal {
    LocalDate getLogDate();
    Long getTotalMl();
}

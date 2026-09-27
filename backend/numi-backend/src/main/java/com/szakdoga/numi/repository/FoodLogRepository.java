package com.szakdoga.numi.repository;

import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.FoodLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface FoodLogRepository extends JpaRepository<FoodLog, Long> {
    // Egy adott user egy adott napi bejegyzései (ez a "Napló" oldalhoz kell)
    List<FoodLog> findByAppUserAndLogDate(AppUser appUser, LocalDate logDate);

    // Egy adott user bejegyzései egy időintervallumban (ez a "Naptár" oldalhoz kell majd)
    List<FoodLog> findByAppUserAndLogDateBetween(AppUser appUser, LocalDate startDate, LocalDate endDate);
}

package com.szakdoga.numi.repository;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.WaterLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, Long> {
    List<WaterLog> findByAppUserAndLogDate(AppUser appUser, LocalDate logDate);

    // Az adatbázis maga összegzi - nem kell Java-ban listát összeadni
    @Query("SELECT COALESCE(SUM(w.amountMl), 0) FROM WaterLog w WHERE w.appUser = :appUser AND w.logDate = :logDate")
    Integer sumAmountByAppUserAndLogDate(AppUser appUser, LocalDate logDate);
}

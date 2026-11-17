package com.szakdoga.numi.repository;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.FoodLog;
import com.szakdoga.numi.model.WaterLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface WaterLogRepository extends JpaRepository<WaterLog, Long> {
    List<WaterLog> findByAppUserAndLogDate(AppUser appUser, LocalDate logDate);

    // Az adatbázis maga összegzi - nem kell Java-ban listát összeadni
    @Query("SELECT COALESCE(SUM(w.amountMl), 0) FROM WaterLog w WHERE w.appUser = :appUser AND w.logDate = :logDate")
    Integer sumAmountByAppUserAndLogDate(AppUser appUser, LocalDate logDate);
    Optional<WaterLog> findFirstByAppUserAndLogDateOrderByIdDesc(AppUser appUser, LocalDate logDate);


    @Query("SELECT w.logDate AS logDate, SUM(w.amountMl) AS totalMl " +
            "FROM WaterLog w " +
            "WHERE w.appUser = :appUser AND w.logDate BETWEEN :start AND :end " +
            "GROUP BY w.logDate")
    List<DailyWaterTotal> sumByDay(@Param("appUser") AppUser appUser,
                                   @Param("start") LocalDate start,
                                   @Param("end") LocalDate end);
    void deleteByAppUser(AppUser appUser);
}

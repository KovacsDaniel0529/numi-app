package com.szakdoga.numi.service;

import com.szakdoga.numi.dto.*;
import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.mapper.FoodLogMapper;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.MealType;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.DailyWaterTotal;
import com.szakdoga.numi.repository.FoodLogRepository;
import com.szakdoga.numi.repository.WaterLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.DateTimeException;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final AppUserRepository appUserRepository;
    private final FoodLogRepository foodLogRepository;
    private final WaterLogRepository waterLogRepository;
    private final FoodLogMapper foodLogMapper;

    // ---------- NAPI RÉSZLETEK ----------
    @Transactional(readOnly = true)
    public DailySummaryDTO getDailySummary(String username, LocalDate date) {
        AppUser user = findUser(username);
        LocalDate target = date != null ? date : LocalDate.now();

        List<FoodLogResponseDTO> entries = foodLogRepository.findByAppUserAndLogDate(user, target)
                .stream()
                .map(foodLogMapper::toDTO)
                .toList();

        // Mind a 4 étkezés szerepel, akkor is, ha üres
        List<MealSectionDTO> meals = Arrays.stream(MealType.values())
                .map(type -> {
                    List<FoodLogResponseDTO> ofType = entries.stream()
                            .filter(e -> e.getMealType() == type)
                            .toList();
                    return MealSectionDTO.builder()
                            .mealType(type)
                            .calories(sum(ofType, FoodLogResponseDTO::getCalories))
                            .entries(ofType)
                            .build();
                })
                .toList();

        BigDecimal totalCalories = sum(entries, FoodLogResponseDTO::getCalories);

        ProfileDetail profile = user.getProfileDetail();
        Integer calorieGoal = profile != null ? profile.getDailyCalorieGoal() : null;
        Integer waterGoal = profile != null ? profile.getDailyWaterGoalMl() : null;

        BigDecimal remaining = calorieGoal != null
                ? BigDecimal.valueOf(calorieGoal).subtract(totalCalories)
                : null;

        return DailySummaryDTO.builder()
                .date(target)
                .meals(meals)
                .totalCalories(totalCalories)
                .totalProtein(sum(entries, FoodLogResponseDTO::getProtein))
                .totalCarbs(sum(entries, FoodLogResponseDTO::getCarbs))
                .totalFat(sum(entries, FoodLogResponseDTO::getFat))
                .totalFiber(sum(entries, FoodLogResponseDTO::getFiber))
                .calorieGoal(calorieGoal)
                .caloriesRemaining(remaining)
                .waterMl(waterLogRepository.sumAmountByAppUserAndLogDate(user, target))
                .waterGoalMl(waterGoal)
                .build();
    }

    // ---------- HAVI ÁTTEKINTÉS ----------
    @Transactional(readOnly = true)
    public MonthSummaryDTO getMonthSummary(String username, Integer year, Integer month) {
        AppUser user = findUser(username);

        YearMonth ym;
        try {
            ym = (year == null || month == null) ? YearMonth.now() : YearMonth.of(year, month);
        } catch (DateTimeException e) {
            throw new BadRequestException("Érvénytelen év vagy hónap!");
        }

        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // Egy lekérdezés az egész hónap ételeire, napok szerint csoportosítva
        Map<LocalDate, List<FoodLogResponseDTO>> foodByDate = foodLogRepository
                .findWithFoodInRange(user, start, end)
                .stream()
                .map(foodLogMapper::toDTO)
                .collect(Collectors.groupingBy(FoodLogResponseDTO::getLogDate));

        // Egy lekérdezés az egész hónap vizére, napokra összegezve
        Map<LocalDate, Integer> waterByDate = waterLogRepository
                .sumByDay(user, start, end)
                .stream()
                .collect(Collectors.toMap(DailyWaterTotal::getLogDate, w -> w.getTotalMl().intValue()));

        // Azok a napok, amelyeken étel VAGY víz van (rendezve)
        Set<LocalDate> dates = new TreeSet<>(foodByDate.keySet());
        dates.addAll(waterByDate.keySet());

        List<CalendarDayDTO> days = dates.stream()
                .map(d -> {
                    List<FoodLogResponseDTO> list = foodByDate.getOrDefault(d, List.of());
                    return CalendarDayDTO.builder()
                            .date(d)
                            .totalCalories(sum(list, FoodLogResponseDTO::getCalories))
                            .totalProtein(sum(list, FoodLogResponseDTO::getProtein))
                            .totalCarbs(sum(list, FoodLogResponseDTO::getCarbs))
                            .totalFat(sum(list, FoodLogResponseDTO::getFat))
                            .waterMl(waterByDate.getOrDefault(d, 0))
                            .build();
                })
                .toList();

        ProfileDetail profile = user.getProfileDetail();

        return MonthSummaryDTO.builder()
                .year(ym.getYear())
                .month(ym.getMonthValue())
                .calorieGoal(profile != null ? profile.getDailyCalorieGoal() : null)
                .waterGoalMl(profile != null ? profile.getDailyWaterGoalMl() : null)
                .days(days)
                .build();
    }

    // ---------- SEGÉDMETÓDUSOK ----------
    private AppUser findUser(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));
    }

    // Összead egy BigDecimal mezőt a lista elemein (a null értékeket kihagyja)
    private BigDecimal sum(List<FoodLogResponseDTO> list, Function<FoodLogResponseDTO, BigDecimal> getter) {
        return list.stream()
                .map(getter)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .setScale(2, RoundingMode.HALF_UP);
    }
}

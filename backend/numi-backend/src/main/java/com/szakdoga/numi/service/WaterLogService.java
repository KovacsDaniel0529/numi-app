package com.szakdoga.numi.service;
import com.szakdoga.numi.dto.WaterLogRequestDTO;
import com.szakdoga.numi.dto.WaterLogSummaryDTO;
import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.WaterLog;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.WaterLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class WaterLogService {
    private final WaterLogRepository waterLogRepository;
    private final AppUserRepository appUserRepository;

    public WaterLogSummaryDTO addWaterLog(String username, WaterLogRequestDTO request) {
        if (request.getAmountMl() == null || request.getAmountMl() <= 0) {
            throw new BadRequestException("A vízmennyiségnek nagyobbnak kell lennie nullánál!");
        }
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));

        LocalDate targetDate = request.getLogDate() != null ? request.getLogDate() : LocalDate.now();

        WaterLog waterLog = WaterLog.builder()
                .appUser(user)
                .amountMl(request.getAmountMl())
                .logDate(targetDate)
                .build();

        waterLogRepository.save(waterLog);

        return buildSummary(user, targetDate);
    }

    public WaterLogSummaryDTO getDailySummary(String username, LocalDate date) {
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));

        LocalDate targetDate = date != null ? date : LocalDate.now();
        return buildSummary(user, targetDate);
    }

    private WaterLogSummaryDTO buildSummary(AppUser user, LocalDate date) {
        Integer total = waterLogRepository.sumAmountByAppUserAndLogDate(user, date);

        Integer goal = user.getProfileDetail() != null
                ? user.getProfileDetail().getDailyWaterGoalMl()
                : null;

        return WaterLogSummaryDTO.builder()
                .date(date)
                .totalAmountMl(total)
                .goalMl(goal)
                .build();
    }
}

package com.szakdoga.numi.controller;
import com.szakdoga.numi.dto.WaterLogRequestDTO;
import com.szakdoga.numi.dto.WaterLogSummaryDTO;
import com.szakdoga.numi.service.WaterLogService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/water-logs")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WaterLogController {
    private final WaterLogService waterLogService;

    // POST http://localhost:8080/api/water-logs/danika  body: { "amountMl": 250 }
    @PostMapping("/{username}")
    public WaterLogSummaryDTO addWaterLog(
            @PathVariable String username,
            @RequestBody WaterLogRequestDTO request
    ) {
        return waterLogService.addWaterLog(username, request);
    }

    // GET http://localhost:8080/api/water-logs/danika?date=2026-09-27
    @GetMapping("/{username}")
    public WaterLogSummaryDTO getDailySummary(
            @PathVariable String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return waterLogService.getDailySummary(username, date);
    }
}

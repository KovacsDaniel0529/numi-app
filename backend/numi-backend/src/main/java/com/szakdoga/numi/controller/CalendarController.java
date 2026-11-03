package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.DailySummaryDTO;
import com.szakdoga.numi.dto.MonthSummaryDTO;
import com.szakdoga.numi.service.CalendarService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/calendar")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CalendarController {

    private final CalendarService calendarService;

    // GET http://localhost:8080/api/calendar/teszt01/day?date=2026-10-26
    @GetMapping("/{username}/day")
    public DailySummaryDTO getDay(
            @PathVariable String username,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date
    ) {
        return calendarService.getDailySummary(username, date);
    }

    // GET http://localhost:8080/api/calendar/teszt01/month?year=2026&month=10
    @GetMapping("/{username}/month")
    public MonthSummaryDTO getMonth(
            @PathVariable String username,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month
    ) {
        return calendarService.getMonthSummary(username, year, month);
    }
}

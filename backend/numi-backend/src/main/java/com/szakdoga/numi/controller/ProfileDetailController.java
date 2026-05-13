package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.ProfileRequestDTO;
import com.szakdoga.numi.dto.ProfileResponseDTO;
import com.szakdoga.numi.mapper.ProfileMapper;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.service.ProfileDetailService;
import com.szakdoga.numi.service.AppUserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileDetailController {
    private final ProfileDetailService service;
    private final ProfileMapper profileMapper;
    private final AppUserService appUserService; // 1. JAVÍTÁS: Jó típus!

    // 2. JAVÍTÁS: Mind a három kell a konstruktorba!
    public ProfileDetailController(ProfileDetailService service,
                                   ProfileMapper profileMapper,
                                   AppUserService appUserService) {
        this.service = service;
        this.profileMapper = profileMapper;
        this.appUserService = appUserService;
    }


    @PostMapping("/profile/{username}")
    public ResponseEntity<ProfileResponseDTO> saveProfile(@PathVariable String username, @RequestBody ProfileRequestDTO dto) {

        ProfileDetail profile = profileMapper.toEntity(dto);

        // Ez most már nem lesz null, mert beletettük a konstruktorba
        appUserService.saveProfile(username, profile);

        // Ez küldi vissza a JSON-t a React-nak, hogy át tudjon ugrani a Diary-re
        return ResponseEntity.ok(profileMapper.toDto(profile));
    }

}

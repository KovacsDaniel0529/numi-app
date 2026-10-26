package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.ProfileRequestDTO;
import com.szakdoga.numi.dto.ProfileResponseDTO;
import com.szakdoga.numi.mapper.ProfileMapper;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ProfileDetailController {

    private final ProfileMapper profileMapper;
    private final AppUserService appUserService;

    // POST http://localhost:8080/api/profile/teszt01
    @PostMapping("/{username}")
    public ResponseEntity<ProfileResponseDTO> saveProfile(
            @PathVariable String username,
            @RequestBody ProfileRequestDTO dto
    ) {
        ProfileDetail profile = profileMapper.toEntity(dto);
        ProfileDetail savedProfile = appUserService.saveProfile(username, profile);
        return ResponseEntity.ok(profileMapper.toDto(savedProfile));
    }
}
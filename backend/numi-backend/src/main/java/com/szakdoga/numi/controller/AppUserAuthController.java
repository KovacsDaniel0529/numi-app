package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.RegisterRequestDTO;
import com.szakdoga.numi.dto.UserResponseDTO;
import com.szakdoga.numi.mapper.UserMapper;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.service.AppUserService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class AppUserAuthController {
    private final AppUserService appUserService;
    private final UserMapper userMapper;

    public AppUserAuthController(AppUserService appUserService, UserMapper userMapper) {
        this.appUserService = appUserService;
        this.userMapper = userMapper;
    }

    // REGISZTRÁCIÓ
    @PostMapping("/register")
    public UserResponseDTO register(@RequestBody RegisterRequestDTO request) {
        AppUser userEntity = userMapper.toEntity(request);
        AppUser savedUser = appUserService.registerUser(userEntity);
        return userMapper.toDto(savedUser);
    }

    // BEJELENTKEZÉS
    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody AppUser loginAdatok) {
        AppUser user = appUserService.login(
                loginAdatok.getUsername(),
                loginAdatok.getPassword()
        );
        return userMapper.toDto(user);
    }

    // FELHASZNÁLÓ + PROFIL LEKÉRDEZÉSE
    @GetMapping("/stats/{username}")
    public UserResponseDTO getUserStats(@PathVariable String username) {
        AppUser user = appUserService.findByUsername(username);
        return userMapper.toDto(user);
    }
}
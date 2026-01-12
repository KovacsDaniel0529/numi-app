package com.szakdoga.numi.controller;

import com.szakdoga.numi.dto.ProfileRequestDTO;
import com.szakdoga.numi.dto.RegisterRequestDTO;
import com.szakdoga.numi.dto.UserResponseDTO;
import com.szakdoga.numi.mapper.ProfileMapper;
import com.szakdoga.numi.mapper.UserMapper;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.service.AppUserService;
import org.springframework.web.bind.annotation.*;
import com.szakdoga.numi.model.ProfileDetail;

@RestController
@RequestMapping("/api/auth") 
@CrossOrigin(origins = "http://localhost:5173") 
public class AppUserAuthController {
    private final AppUserService appUserService;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;

    
    
    public AppUserAuthController(AppUserService appUserService, UserMapper userMapper, ProfileMapper profileMapper) {
        this.appUserService = appUserService;
        this.userMapper = userMapper;
        this.profileMapper = profileMapper;
    }

    // REGISZTRÁCIÓ VÉGPONT
    @PostMapping("/register")

    public UserResponseDTO register(@RequestBody RegisterRequestDTO request) {

       
        AppUser userEntity = userMapper.toEntity(request);

        AppUser savedUser = appUserService.registerUser(userEntity);

       
        return userMapper.toDto(savedUser);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody AppUser loginAdatok) {

        AppUser user = appUserService.login(
                loginAdatok.getUsername(),
                loginAdatok.getPassword()
        );

      
        return userMapper.toDto(user);
    }
    @PostMapping("/profile/{username}")
    public void saveProfile(@PathVariable String username, @RequestBody ProfileRequestDTO request) {

        ProfileDetail profileEntity = profileMapper.toEntity(request);

    
        appUserService.saveProfile(username, profileEntity);
    }
}

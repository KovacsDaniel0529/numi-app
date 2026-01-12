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
@RequestMapping("/api/auth") // A cím ez lesz: localhost:8080/api/auth/...
@CrossOrigin(origins = "http://localhost:5173") // React engedélyezése
public class AppUserAuthController {
    private final AppUserService appUserService;
    private final UserMapper userMapper;
    private final ProfileMapper profileMapper;

    // Itt injektáljuk be a Service-t!
    // Látod a láncot? Repo -> Service -> Controller
    public AppUserAuthController(AppUserService appUserService, UserMapper userMapper, ProfileMapper profileMapper) {
        this.appUserService = appUserService;
        this.userMapper = userMapper;
        this.profileMapper = profileMapper;
    }

    // REGISZTRÁCIÓ VÉGPONT
    @PostMapping("/register")
    // Figyeld a típusokat: DTO megy be, DTO jön ki!
    public UserResponseDTO register(@RequestBody RegisterRequestDTO request) {

        // 1. Bejövő adat átalakítása Entity-vé (Mapping)
        AppUser userEntity = userMapper.toEntity(request);

        // 2. Az üzleti logika meghívása (Mentés)
        AppUser savedUser = appUserService.registerUser(userEntity);

        // 3. A mentett adat visszaalakítása biztonságos DTO-vá (Jelszó nélkül!)
        return userMapper.toDto(savedUser);
    }

    @PostMapping("/login")
    public UserResponseDTO login(@RequestBody AppUser loginAdatok) {

        // 1. A Service megkeresi az embert (ellenőrzi a jelszót)
        AppUser user = appUserService.login(
                loginAdatok.getUsername(),
                loginAdatok.getPassword()
        );

        // 2. De mi nem küldjük vissza az egész embert (jelszóval együtt)!
        // Átcsomagoljuk DTO-vá:
        return userMapper.toDto(user);
    }
    @PostMapping("/profile/{username}")
    public void saveProfile(@PathVariable String username, @RequestBody ProfileRequestDTO request) {

        // 1. Átalakítjuk a DTO-t Entity-vé
        ProfileDetail profileEntity = profileMapper.toEntity(request);

        // 2. Átadjuk a Service-nek mentésre
        appUserService.saveProfile(username, profileEntity);
    }
}

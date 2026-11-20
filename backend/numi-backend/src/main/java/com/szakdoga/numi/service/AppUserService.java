package com.szakdoga.numi.service;

import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ConflictException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.exception.UnauthorizedException;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.ProfileDetailRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final ProfileDetailRepository profileDetailRepository;
    private final PasswordEncoder passwordEncoder;

   
    public AppUserService(AppUserRepository appUserRepository, ProfileDetailRepository profileDetailRepository, PasswordEncoder passwordEncoder) {
        this.appUserRepository = appUserRepository;
        this.profileDetailRepository = profileDetailRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AppUser registerUser(AppUser userToSave) {

        // 1. Ellenőrzés: Foglalt-e a név?
        if (appUserRepository.existsByUsernameIgnoreCase(userToSave.getUsername())) {
            throw new ConflictException("Ez a felhasználónév már foglalt!");
        }
        
        if (appUserRepository.existsByEmailIgnoreCase(userToSave.getEmail())) {
            throw new ConflictException("Ez az email cím már regisztrálva van!");
        }
        userToSave.setPassword(passwordEncoder.encode(userToSave.getPassword()));
        return appUserRepository.save(userToSave);
    }
    // Bejelentkezés rész:
    public AppUser login(String username, String password) {
        // 1. Megkeressük a felhasználót

        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new UnauthorizedException("Hibás felhasználónév vagy jelszó!"));


        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new UnauthorizedException("Hibás felhasználónév vagy jelszó!");
        }
        return user;
    }
    




    private Integer calculateDailyCalories(ProfileDetail profile) {
        double bmr;
        // BMR (Alapanyagcsere) számítás
        if ("male".equalsIgnoreCase(profile.getGender())) {
            bmr = (10 * profile.getWeight()) + (6.25 * profile.getHeight()) - (5 * profile.getAge()) + 5;
        } else {
            bmr = (10 * profile.getWeight()) + (6.25 * profile.getHeight()) - (5 * profile.getAge()) - 161;
        }

        // TDEE (Napi teljes energiaigény) az aktivitási szinttel
        double tdee = bmr * profile.getActivityLevel();

        // Cél szerinti módosítás
        if ("lose".equalsIgnoreCase(profile.getGoal())) {
            return (int) Math.round(tdee - 500); // Fogyáshoz deficit
        } else if ("gain".equalsIgnoreCase(profile.getGoal())) {
            return (int) Math.round(tdee + 300); // Hízáshoz többlet
        }
        return (int) Math.round(tdee); // Súlytartás
    }

    public ProfileDetail saveProfile(String username, ProfileDetail incoming) {
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));

        if (incoming.getWeight() == null || incoming.getHeight() == null
                || incoming.getAge() == null || incoming.getActivityLevel() == null) {
            throw new BadRequestException("Hiányzó profiladat (súly, magasság, kor vagy aktivitási szint)!");
        }

        // Ha már van profilja, azt módosítjuk, különben újat készítünk
        ProfileDetail profile = user.getProfileDetail() != null
                ? user.getProfileDetail()
                : new ProfileDetail();

        profile.setFirstName(incoming.getFirstName());
        profile.setAge(incoming.getAge());
        profile.setWeight(incoming.getWeight());
        profile.setHeight(incoming.getHeight());
        profile.setGender(incoming.getGender());
        profile.setGoal(incoming.getGoal());
        profile.setActivityLevel(incoming.getActivityLevel());
        profile.setDietaryPreference(incoming.getDietaryPreference());
        profile.setAllergies(incoming.getAllergies());
        profile.setDigestiveIssues(incoming.getDigestiveIssues());

        profile.setDailyCalorieGoal(calculateDailyCalories(profile));
        profile.setDailyWaterGoalMl(calculateDailyWaterGoal(profile));
        profile.setUser(user);

        ProfileDetail savedProfile = profileDetailRepository.save(profile);

        user.setProfileDetail(savedProfile);
        appUserRepository.save(user);

        return savedProfile;
    }

    public AppUser findByUsername(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));
    }

    private Integer calculateDailyWaterGoal(ProfileDetail profile) {
        // Ökölszabály: kb. 33 ml víz / testsúly kg
        return (int) Math.round(profile.getWeight() * 33);
    }
    @Transactional
    public ProfileDetail updateWeight(String username, Double newWeight) {
        if (newWeight == null || newWeight < 25 || newWeight > 400) {
            throw new BadRequestException("Érvénytelen testsúly (25–400 kg között add meg)!");
        }

        AppUser user = findByUsername(username);
        ProfileDetail profile = user.getProfileDetail();
        if (profile == null) {
            throw new ResourceNotFoundException("A felhasználónak még nincs profilja!");
        }

        profile.setWeight(newWeight);
        profile.setDailyCalorieGoal(calculateDailyCalories(profile));
        profile.setDailyWaterGoalMl(calculateDailyWaterGoal(profile));

        return profileDetailRepository.save(profile);
    }


}

package com.szakdoga.numi.service;

import com.szakdoga.numi.dto.DeleteAccountRequestDTO;
import com.szakdoga.numi.dto.PasswordChangeRequestDTO;
import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.exception.UnauthorizedException;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.FoodLogRepository;
import com.szakdoga.numi.repository.WaterLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * A fiókkal kapcsolatos műveletek (jelszócsere, fióktörlés).
 * Külön service, hogy az AppUserService ne nőjön túl nagyra.
 */
@Service
@RequiredArgsConstructor
public class AccountService {

    private static final int MIN_PASSWORD_LENGTH = 6;

    private final AppUserRepository appUserRepository;
    private final FoodLogRepository foodLogRepository;
    private final WaterLogRepository waterLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public void changePassword(String username, PasswordChangeRequestDTO request) {
        AppUser user = findUser(username);

        // A jelenlegi jelszót mindig ellenőrizzük, különben bárki átírhatná egy másik ember jelszavát
        checkPassword(user, request.getCurrentPassword(), "A jelenlegi jelszó hibás!");

        String newPassword = request.getNewPassword();
        if (newPassword == null || newPassword.length() < MIN_PASSWORD_LENGTH) {
            throw new BadRequestException("Az új jelszó legalább " + MIN_PASSWORD_LENGTH + " karakter legyen!");
        }
        if (passwordEncoder.matches(newPassword, user.getPassword())) {
            throw new BadRequestException("Az új jelszó nem egyezhet meg a régivel!");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        appUserRepository.save(user);
    }

    @Transactional
    public void deleteAccount(String username, DeleteAccountRequestDTO request) {
        AppUser user = findUser(username);

        checkPassword(user, request.getPassword(), "Hibás jelszó, a fiók nem törölhető!");

        // Előbb a naplóbejegyzések, mert ők hivatkoznak a felhasználóra
        foodLogRepository.deleteByAppUser(user);
        waterLogRepository.deleteByAppUser(user);

        // A profil (ProfileDetail) a cascade miatt a felhasználóval együtt törlődik
        appUserRepository.delete(user);
    }

    private AppUser findUser(String username) {
        return appUserRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("Felhasználó nem található: " + username));
    }

    private void checkPassword(AppUser user, String rawPassword, String errorMessage) {
        if (rawPassword == null || !passwordEncoder.matches(rawPassword, user.getPassword())) {
            throw new UnauthorizedException(errorMessage);
        }
    }
}
package com.szakdoga.numi.service;

import com.szakdoga.numi.exception.BadRequestException;
import com.szakdoga.numi.exception.ConflictException;
import com.szakdoga.numi.exception.ResourceNotFoundException;
import com.szakdoga.numi.exception.UnauthorizedException;
import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.ProfileDetailRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

/**
 * Az AppUserService tesztjei. Az adatbázist (repository-kat) kicseréljük "mock"-ra:
 * ez egy üres, általunk irányítható helyettes, így nincs szükség PostgreSQL-re,
 * és a teszt gyors. A jelszó-kódolás viszont a VALÓDI BCrypt, mert azt is ellenőrizni akarjuk.
 *
 * A kalória- és vízszámítás privát metódus, ezért a publikus saveProfile / updateWeight
 * metóduson keresztül vizsgáljuk, azaz úgy, ahogy a program használja.
 */
@ExtendWith(MockitoExtension.class)
class AppUserServiceTest {

    @Mock
    private AppUserRepository appUserRepository;

    @Mock
    private ProfileDetailRepository profileDetailRepository;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder(4); // 4 = gyors, tesztre elég

    private AppUserService service;

    @BeforeEach
    void setUp() {
        service = new AppUserService(appUserRepository, profileDetailRepository, passwordEncoder);
    }

    // ---------- segédek ----------

    private AppUser userWithoutProfile() {
        AppUser user = new AppUser();
        user.setUsername("dani");
        return user;
    }

    private ProfileDetail incoming(String gender, double weight, double height, int age,
                                   double activity, String goal) {
        ProfileDetail p = new ProfileDetail();
        p.setGender(gender);
        p.setWeight(weight);
        p.setHeight(height);
        p.setAge(age);
        p.setActivityLevel(activity);
        p.setGoal(goal);
        return p;
    }

    // A mentést (save) úgy állítjuk be, hogy azt adja vissza, amit kapott
    private void saveReturnsArgument() {
        when(profileDetailRepository.save(any(ProfileDetail.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));
    }

    private ProfileDetail saveFor(AppUser user, ProfileDetail incoming) {
        when(appUserRepository.findByUsername("dani")).thenReturn(Optional.of(user));
        saveReturnsArgument();
        return service.saveProfile("dani", incoming);
    }

    // ---------- Kalóriaszámítás (Mifflin-St Jeor + aktivitás + cél) ----------

    @Test
    @DisplayName("Férfi, súlytartás: BMR 1780 x 1,55 = 2759 kcal")
    void maleMaintain() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("male", 80, 180, 30, 1.55, "maintain"));

        assertEquals(2759, saved.getDailyCalorieGoal());
    }

    @Test
    @DisplayName("Fogyás: 500 kcal-lal kevesebb")
    void loseSubtracts500() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("male", 80, 180, 30, 1.55, "lose"));

        assertEquals(2259, saved.getDailyCalorieGoal());
    }

    @Test
    @DisplayName("Hízás / izomépítés: 300 kcal-lal több")
    void gainAdds300() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("male", 80, 180, 30, 1.55, "gain"));

        assertEquals(3059, saved.getDailyCalorieGoal());
    }

    @Test
    @DisplayName("Nő: a képlet 161-et von le (a férfiaknál 5-öt ad hozzá)")
    void femaleFormula() {
        ProfileDetail maintain = saveFor(userWithoutProfile(), incoming("female", 60, 165, 25, 1.2, "maintain"));
        assertEquals(1614, maintain.getDailyCalorieGoal());
    }

    @Test
    @DisplayName("Nő, fogyás: 1614 - 500 = 1114 kcal")
    void femaleLose() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("female", 60, 165, 25, 1.2, "lose"));

        assertEquals(1114, saved.getDailyCalorieGoal());
    }

    @Test
    @DisplayName("A nem megadása kis- és nagybetűre nem érzékeny (MALE = male)")
    void genderIsCaseInsensitive() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("MALE", 80, 180, 30, 1.55, "maintain"));

        assertEquals(2759, saved.getDailyCalorieGoal());
    }

    @Test
    @DisplayName("Ismeretlen cél esetén súlytartás számítódik")
    void unknownGoalMeansMaintain() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("male", 80, 180, 30, 1.55, "valami"));

        assertEquals(2759, saved.getDailyCalorieGoal());
    }

    // ---------- Vízcél ----------

    @Test
    @DisplayName("Vízcél: testsúly (kg) x 33 ml")
    void waterGoalIs33mlPerKg() {
        ProfileDetail saved = saveFor(userWithoutProfile(), incoming("male", 80, 180, 30, 1.55, "maintain"));

        assertEquals(2640, saved.getDailyWaterGoalMl());
    }

    // ---------- saveProfile: viselkedés ----------

    @Test
    @DisplayName("Hiányzó adat (súly) esetén hibát dob, nem ment")
    void missingWeightIsRejected() {
        ProfileDetail bad = incoming("male", 80, 180, 30, 1.55, "maintain");
        bad.setWeight(null);
        when(appUserRepository.findByUsername("dani")).thenReturn(Optional.of(userWithoutProfile()));

        assertThrows(BadRequestException.class, () -> service.saveProfile("dani", bad));
    }

    @Test
    @DisplayName("Ismeretlen felhasználónál hibát dob")
    void unknownUserIsRejected() {
        when(appUserRepository.findByUsername("nincs")).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class,
                () -> service.saveProfile("nincs", incoming("male", 80, 180, 30, 1.55, "maintain")));
    }

    @Test
    @DisplayName("Meglévő profilnál a régit módosítja, nem hoz létre újat")
    void existingProfileIsUpdatedNotReplaced() {
        AppUser user = userWithoutProfile();
        ProfileDetail existing = incoming("male", 70, 175, 28, 1.2, "maintain");
        user.setProfileDetail(existing);

        ProfileDetail saved = saveFor(user, incoming("male", 80, 180, 30, 1.55, "maintain"));

        assertSame(existing, saved);
        assertEquals(80.0, saved.getWeight());
    }

    // ---------- updateWeight ----------

    @Test
    @DisplayName("Súlymódosításkor a kalória- és vízcél újraszámolódik")
    void updateWeightRecalculatesGoals() {
        AppUser user = userWithoutProfile();
        user.setProfileDetail(incoming("female", 60, 165, 25, 1.2, "maintain"));
        when(appUserRepository.findByUsername("dani")).thenReturn(Optional.of(user));
        saveReturnsArgument();

        ProfileDetail updated = service.updateWeight("dani", 70.0);

        assertEquals(70.0, updated.getWeight());
        assertEquals(1734, updated.getDailyCalorieGoal());
        assertEquals(2310, updated.getDailyWaterGoalMl());
    }

    @Test
    @DisplayName("Életszerűtlen súlyt (24 és 401 kg, null) elutasít")
    void updateWeightRejectsInvalidValues() {
        assertThrows(BadRequestException.class, () -> service.updateWeight("dani", 24.0));
        assertThrows(BadRequestException.class, () -> service.updateWeight("dani", 401.0));
        assertThrows(BadRequestException.class, () -> service.updateWeight("dani", null));
    }

    @Test
    @DisplayName("Profil nélküli felhasználónál a súlymódosítás hibát dob")
    void updateWeightWithoutProfile() {
        when(appUserRepository.findByUsername("dani")).thenReturn(Optional.of(userWithoutProfile()));

        assertThrows(ResourceNotFoundException.class, () -> service.updateWeight("dani", 70.0));
    }

    // ---------- Regisztráció ----------

    @Test
    @DisplayName("Regisztrációkor a jelszó BCrypt hash-sel mentődik, nem nyers szövegként")
    void registerHashesPassword() {
        when(appUserRepository.save(any(AppUser.class))).thenAnswer(invocation -> invocation.getArgument(0));

        AppUser toSave = new AppUser();
        toSave.setUsername("dani");
        toSave.setEmail("dani@example.com");
        toSave.setPassword("titok123");

        AppUser saved = service.registerUser(toSave);

        assertNotEquals("titok123", saved.getPassword());
        assertTrue(saved.getPassword().startsWith("$2")); // a BCrypt hash jellegzetes eleje
        assertTrue(passwordEncoder.matches("titok123", saved.getPassword()));
    }

    @Test
    @DisplayName("Foglalt felhasználónévnél hibát dob")
    void registerRejectsTakenUsername() {
        when(appUserRepository.existsByUsernameIgnoreCase("dani")).thenReturn(true);

        AppUser toSave = new AppUser();
        toSave.setUsername("dani");
        toSave.setEmail("uj@example.com");
        toSave.setPassword("titok123");

        assertThrows(ConflictException.class, () -> service.registerUser(toSave));
    }

    @Test
    @DisplayName("Már regisztrált email címnél hibát dob")
    void registerRejectsTakenEmail() {
        when(appUserRepository.existsByEmailIgnoreCase("dani@example.com")).thenReturn(true);

        AppUser toSave = new AppUser();
        toSave.setUsername("masik");
        toSave.setEmail("dani@example.com");
        toSave.setPassword("titok123");

        assertThrows(ConflictException.class, () -> service.registerUser(toSave));
    }

    // ---------- Bejelentkezés ----------

    private AppUser storedUser(String rawPassword) {
        AppUser user = new AppUser();
        user.setUsername("dani");
        user.setPassword(passwordEncoder.encode(rawPassword));
        return user;
    }

    @Test
    @DisplayName("Helyes jelszóval sikeres a belépés")
    void loginWithCorrectPassword() {
        AppUser stored = storedUser("titok123");
        when(appUserRepository.findByUsername("dani")).thenReturn(Optional.of(stored));

        assertSame(stored, service.login("dani", "titok123"));
    }

    @Test
    @DisplayName("Rossz jelszóval nem lehet belépni")
    void loginWithWrongPassword() {
        when(appUserRepository.findByUsername("dani")).thenReturn(Optional.of(storedUser("titok123")));

        assertThrows(UnauthorizedException.class, () -> service.login("dani", "rossz"));
    }

    @Test
    @DisplayName("Ismeretlen felhasználónévvel nem lehet belépni")
    void loginWithUnknownUser() {
        when(appUserRepository.findByUsername("nincs")).thenReturn(Optional.empty());

        assertThrows(UnauthorizedException.class, () -> service.login("nincs", "titok123"));
    }
}
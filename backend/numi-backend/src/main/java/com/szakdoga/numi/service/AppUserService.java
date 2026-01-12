package com.szakdoga.numi.service;

import com.szakdoga.numi.model.AppUser;
import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.repository.AppUserRepository;
import com.szakdoga.numi.repository.ProfileDetailRepository;
import org.springframework.stereotype.Service;

@Service
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final ProfileDetailRepository profileDetailRepository;

   
    public AppUserService(AppUserRepository appUserRepository, ProfileDetailRepository profileDetailRepository) {
        this.appUserRepository = appUserRepository;
        this.profileDetailRepository = profileDetailRepository;
    }

    public AppUser registerUser(AppUser userToSave) {

        // 1. Ellenőrzés: Foglalt-e a név?
        if (appUserRepository.findByUsername(userToSave.getUsername()).isPresent()) {
            throw new RuntimeException("Ez a felhasználónév már foglalt!");
        }
        return appUserRepository.save(userToSave);
    }
    // Bejelentkezés rész:
    public AppUser login(String username, String password) {
        // 1. Megkeressük a felhasználót
        
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nincs ilyen felhasználó!"));

        // 2. Jelszó ellenőrzés
        if (!user.getPassword().equals(password)) {
            throw new RuntimeException("Hibás jelszó!");
        }

        // 3. Siker
        return user;
    }
    

   -
    public void saveProfile(String username, ProfileDetail profilAdatok) {
        // 1. Megkeressük, kihez tartozik ez a profil
        AppUser user = appUserRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Nincs ilyen felhasználó!"));

        // 2. Beállítjuk a kapcsolatot (összekötjük őket)
        profilAdatok.setUser(user);

        // 3. Elmentjük a profilt
        profileDetailRepository.save(profilAdatok);

        user.setProfileDetail(profilAdatok);
        appUserRepository.save(user);
    }

}

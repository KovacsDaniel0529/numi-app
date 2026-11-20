package com.szakdoga.numi.repository;

import com.szakdoga.numi.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {
   boolean existsByEmailIgnoreCase(String email);


   boolean existsByUsernameIgnoreCase(String username);
   Optional<AppUser> findByUsername(String username);
// import org.springframework.data.jpa.repository.Query;
}

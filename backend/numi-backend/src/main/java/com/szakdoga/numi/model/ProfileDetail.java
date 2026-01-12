package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;


    @Entity
    @Table(name = "profile_details")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ProfileDetail extends BaseEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        // Ez került át ide, ahogy kérted:
        private String firstName;

        // Itt használjuk a nagybetűs Integer/Double-t, mert ezek lehetnek üresek kezdetben!
        private Integer age;

        private Double weight; // kg

        private Double height; // cm

        private String gender; // MALE / FEMALE

        private String goal; // lose, maintain, gain

        // --- A KULCS (Foreign Key) ---
        // Ez a mező fogja összekötni a Userrel.
        // Az adatbázisban lesz egy "user_id" oszlop ebben a táblában.
        @OneToOne
        @JoinColumn(name = "user_id", referencedColumnName = "id")
        @com.fasterxml.jackson.annotation.JsonIgnore
        private AppUser user;
    }


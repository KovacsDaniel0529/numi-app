package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Entity
    @Table(name = "profile_details")
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public class ProfileDetail extends BaseEntity {

        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        
        private String firstName;

       
        private Integer age;

        private Double weight; // kg

        private Double height; // cm

        private String gender; // MALE / FEMALE

        private String goal; // lose, maintain, gain

        private Double activityLevel;

        private String dietaryPreference;

        private Integer dailyCalorieGoal;

        // 3. Allergiák listája
        // Az @ElementCollection létrehoz egy kapcsolódó táblát az adatbázisban,
        // így nem kell manuálisan JSON-né alakítani.
        @ElementCollection
        @CollectionTable(name = "profile_allergies", joinColumns = @JoinColumn(name = "profile_id"))
        @Column(name = "allergy")
        private List<String> allergies;

        // 4. Emésztési panaszok (AI receptekhez nagyon hasznos)
        // pl. "puffadás", "reflux"
        @ElementCollection
        @CollectionTable(name = "profile_digestive_issues", joinColumns = @JoinColumn(name = "profile_id"))
        @Column(name = "issue")
        private List<String> digestiveIssues;

        
        // Ez a mező fogja összekötni a Userrel.
        // Az adatbázisban lesz egy "user_id" oszlop ebben a táblában.
        @OneToOne
        @JoinColumn(name = "user_id", referencedColumnName = "id")
        @com.fasterxml.jackson.annotation.JsonIgnore
        private AppUser user;


}


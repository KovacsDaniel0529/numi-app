package com.szakdoga.numi.mapper;

import com.szakdoga.numi.dto.ProfileRequestDTO;
import com.szakdoga.numi.dto.ProfileResponseDTO;
import com.szakdoga.numi.model.ProfileDetail;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {
    // 1. DTO -> Entity (Mentéshez)
    public ProfileDetail toEntity(ProfileRequestDTO dto) {
        if (dto == null) return null;

        ProfileDetail profile = new ProfileDetail();
        profile.setFirstName(dto.getFirstName());
        profile.setAge(dto.getAge());
        profile.setWeight(dto.getWeight());
        profile.setHeight(dto.getHeight());
        profile.setGender(dto.getGender());
        profile.setGoal(dto.getGoal());

        profile.setActivityLevel(dto.getActivityLevel());
        profile.setDailyCalorieGoal(dto.getDailyCalorieGoal());
        profile.setDietaryPreference(dto.getDietaryPreference());
        profile.setAllergies(dto.getAllergies());
        profile.setDigestiveIssues(dto.getDigestiveIssues());
        return profile;
    }

    // 2. Entity -> DTO (Lekérdezéshez)
    public ProfileResponseDTO toDto(ProfileDetail profile) {
        if (profile == null) return null;

        ProfileResponseDTO dto = new ProfileResponseDTO();
        dto.setFirstName(profile.getFirstName());
        dto.setAge(profile.getAge());
        dto.setWeight(profile.getWeight());
        dto.setHeight(profile.getHeight());
        dto.setGender(profile.getGender());
        dto.setGoal(profile.getGoal());
        dto.setUpdatedAt(profile.getUpdatedAt());
        dto.setActivityLevel(profile.getActivityLevel());
        dto.setDietaryPreference(profile.getDietaryPreference());
        dto.setAllergies(profile.getAllergies());
        return dto;
    }
}

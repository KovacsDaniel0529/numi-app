package com.szakdoga.numi.service;

import com.szakdoga.numi.model.ProfileDetail;
import com.szakdoga.numi.repository.ProfileDetailRepository;
import org.springframework.stereotype.Service;

@Service
public class ProfileDetailService {
    private ProfileDetailRepository repository;
    public ProfileDetailService(ProfileDetailRepository repository) {
        this.repository = repository;
    }
    public String getFirstName(Long id) {
        return repository.findById(id)
                .map(ProfileDetail::getFirstName)
                .orElseThrow(() -> new RuntimeException("User not found"));

    }
}

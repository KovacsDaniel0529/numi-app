package com.szakdoga.numi.repository;

import com.szakdoga.numi.model.ProfileDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfileDetailRepository extends JpaRepository<ProfileDetail, Long> {
    Optional<ProfileDetail> findById (Long id);

}

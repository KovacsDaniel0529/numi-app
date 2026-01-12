package com.szakdoga.numi.model;


import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import lombok.Data;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass // Ez fontos: ettől öröklődnek az oszlopok
@Data
@EntityListeners(AuditingEntityListener.class) // Ez figyeli az eseményeket
public abstract class BaseEntity {
    @CreatedDate
    @Column(updatable = false) // Létrehozáskor mentődik, utána soha nem írható felül
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    @CreatedBy
    private String createdBy;

    @LastModifiedBy
    private String updatedBy;
}

package com.szakdoga.numi.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "water_logs")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = "appUser")
@EqualsAndHashCode(exclude = "appUser", callSuper = false)
public class WaterLog extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "app_user_id", nullable = false)
    private AppUser appUser;

    @Column(name = "amount_ml", nullable = false)
    private Integer amountMl;

    @Column(name = "log_date", nullable = false)
    private LocalDate logDate;
}

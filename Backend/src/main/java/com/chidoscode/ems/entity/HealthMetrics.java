package com.chidoscode.ems.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "health_metrics")
public class HealthMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false, updatable = false)
    private LocalDateTime recordedAt = LocalDateTime.now(); // Auto-set to current date

    @Column(nullable = true)  // All metrics optional
    private Double bmi;

    @Column(nullable = true)
    private Double bmr;

    @Column(nullable = true)
    private Double eer;
}

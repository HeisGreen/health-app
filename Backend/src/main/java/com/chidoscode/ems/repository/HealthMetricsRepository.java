package com.chidoscode.ems.repository;

import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;

public interface HealthMetricsRepository extends JpaRepository<HealthMetrics, Long> {
    // Find all metrics for a user (sorted newest first)
    List<HealthMetrics> findByUserOrderByRecordedAtDesc(User user);

    // Find metrics for a user on a specific date
    HealthMetrics findByUserAndRecordedAt(User user, LocalDate date);

    // Find latest non-null metrics of each type
    @Query("SELECT hm FROM HealthMetrics hm WHERE " +
            "hm.user = :user AND " +
            "(:metricType = 'bmi' AND hm.bmi IS NOT NULL) OR " +
            "(:metricType = 'bmr' AND hm.bmr IS NOT NULL) OR " +
            "(:metricType = 'eer' AND hm.eer IS NOT NULL) " +
            "ORDER BY hm.recordedAt DESC LIMIT 1")
    HealthMetrics findLatestNonNullMetric(
            @Param("user") User user,
            @Param("metricType") String metricType
    );
}

package com.chidoscode.ems.repository;

import com.chidoscode.ems.entity.HealthMetrics;
import com.chidoscode.ems.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface HealthMetricsRepository extends JpaRepository<HealthMetrics, Long> {

    // Find all metrics for a user (sorted newest first)
    List<HealthMetrics> findByUserOrderByRecordedAtDesc(User user);

    // Find metrics for a user at an exact timestamp
    Optional<HealthMetrics> findByUserAndRecordedAt(User user, LocalDateTime date);

    // Find latest non-null metrics for each type
    HealthMetrics findTop1ByUserAndBmiIsNotNullOrderByRecordedAtDesc(User user);

    HealthMetrics findTop1ByUserAndBmrIsNotNullOrderByRecordedAtDesc(User user);

    HealthMetrics findTop1ByUserAndEerIsNotNullOrderByRecordedAtDesc(User user);

    List<HealthMetrics> findAllByUser_EmailOrderByRecordedAtAsc(String email);


    // Get all metrics for a user (sorted by date/time ascending)
    @Query("SELECT hm FROM HealthMetrics hm WHERE hm.user.id = :userId ORDER BY hm.recordedAt ASC")
    List<HealthMetrics> findCompleteHistory(@Param("userId") Long userId);

    // Get BMI history for a user
    @Query("SELECT hm FROM HealthMetrics hm WHERE hm.user.id = :userId AND hm.bmi IS NOT NULL ORDER BY hm.recordedAt ASC")
    List<HealthMetrics> findBmiHistory(@Param("userId") Long userId);

    // (Optional) Add similar history methods for BMR and EER if needed
    @Query("SELECT hm FROM HealthMetrics hm WHERE hm.user.id = :userId AND hm.bmr IS NOT NULL ORDER BY hm.recordedAt ASC")
    List<HealthMetrics> findBmrHistory(@Param("userId") Long userId);

    @Query("SELECT hm FROM HealthMetrics hm WHERE hm.user.id = :userId AND hm.eer IS NOT NULL ORDER BY hm.recordedAt ASC")
    List<HealthMetrics> findEerHistory(@Param("userId") Long userId);
}

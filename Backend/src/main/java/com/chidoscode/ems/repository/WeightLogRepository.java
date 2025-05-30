package com.chidoscode.ems.repository;

import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.entity.WeightLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface WeightLogRepository extends JpaRepository<WeightLog, Long> {
    List<WeightLog> findByUserOrderByLogDateDesc(User user);  // For dashboard charts
    Optional<WeightLog> findTopByUserOrderByLogDateDesc(User user);  // Latest entry

    // Custom query methods can be defined here if needed
    // For example, to find weight logs by user:
    // List<WeightLog> findByUser(User user);
}

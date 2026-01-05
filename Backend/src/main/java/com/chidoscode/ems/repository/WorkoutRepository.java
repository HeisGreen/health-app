package com.chidoscode.ems.repository;

import com.chidoscode.ems.entity.User;
import com.chidoscode.ems.entity.Workout;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    List<Workout> findByUserOrderByCreatedAtDesc(User user);
    Optional<Workout> findByIdAndUser(Long id, User user);
}


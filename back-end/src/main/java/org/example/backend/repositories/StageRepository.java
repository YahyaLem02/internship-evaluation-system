package org.example.backend.repositories;

import org.example.backend.entities.Admin;
import org.example.backend.entities.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;

public interface StageRepository extends JpaRepository<Stage, Long> {
    List<Stage> findByStageAnneeId(Long stageAnneeId);

}


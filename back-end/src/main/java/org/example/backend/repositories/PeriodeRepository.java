package org.example.backend.repositories;

import org.example.backend.entities.Periode;
import org.example.backend.entities.PeriodeId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PeriodeRepository extends JpaRepository<Periode, PeriodeId> {
    // Vérifie si une période existe par son ID composite
    boolean existsById(PeriodeId id);

    // Supprime une période par son ID composite
    void deleteById(PeriodeId id);

    // Trouve une période par son ID composite, renvoie un Optional
    Optional<Periode> findById(PeriodeId id);

    Optional<Periode> findById_StagiaireIdAndId_StageId(Long stagiaireId, Long stageId);

}

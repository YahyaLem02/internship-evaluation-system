package org.example.backend.repositories;

import org.example.backend.entities.Periode;
import org.example.backend.entities.PeriodeId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PeriodeRepository extends JpaRepository<Periode, PeriodeId> {
    boolean existsById(PeriodeId id);

    List<Periode> findByStagiaireId(Long stagiaireId);
    List<Periode> findByStageId(Long stageId);
    @Query("SELECT DISTINCT p FROM Periode p " +
            "LEFT JOIN FETCH p.appreciations " +
            "WHERE p.stagiaire.id = :stagiaireId")
    List<Periode> findByStagiaireIdWithAppreciations(@Param("stagiaireId") Long stagiaireId);
    void deleteById(PeriodeId id);
    Optional<Periode> findById(PeriodeId id);
    Optional<Periode> findByAppreciationToken(String token);
    Optional<Periode> findById_StagiaireIdAndId_StageId(Long stagiaireId, Long stageId);
    

}

package org.example.backend.repositories;

import org.example.backend.entities.Appreciation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface AppreciationRepository extends JpaRepository<Appreciation, Long> {
    List<Appreciation> findByTuteurId(Long tuteurId);
    // Remplacer la méthode findByPeriodeId par une requête JPQL personnalisée
    @Query("SELECT a FROM Appreciation a WHERE a.periode.id = :periodeId")
    List<Appreciation> findByPeriodeId(@Param("periodeId") Long periodeId);
    @Query("SELECT a FROM Appreciation a " +
            "LEFT JOIN FETCH a.evaluations " +
            "LEFT JOIN FETCH a.competences c " +
            "LEFT JOIN FETCH c.categories " +
            "WHERE a.id = :id")
    Appreciation findByIdWithRelations(@Param("id") Long id);
}

package org.example.backend.repositories;

import org.example.backend.entities.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StagaireRepository extends JpaRepository<Stagiaire, Long> {
    Optional<Stagiaire> findByEmail(String email);
    boolean existsByEmail(String email);
}

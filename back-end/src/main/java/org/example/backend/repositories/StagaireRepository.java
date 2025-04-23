package org.example.backend.repositories;

import org.example.backend.entities.Stagiaire;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StagaireRepository extends JpaRepository<Stagiaire, Long> {
}

package org.example.backend.repositories;

import org.example.backend.entities.Admin;
import org.example.backend.entities.Tuteur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface TuteurRepository extends JpaRepository<Tuteur, Long> {
    Optional<Tuteur> findByEmail(String email);
}

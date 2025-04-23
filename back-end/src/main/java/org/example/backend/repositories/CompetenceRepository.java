package org.example.backend.repositories;

import org.example.backend.entities.Admin;
import org.example.backend.entities.Competence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface CompetenceRepository extends JpaRepository<Competence, Long> {
}

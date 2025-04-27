package org.example.backend.repositories;

import org.example.backend.entities.Admin;
import org.example.backend.entities.Evaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface EvaluationRepository extends JpaRepository<Evaluation, Long> {
}

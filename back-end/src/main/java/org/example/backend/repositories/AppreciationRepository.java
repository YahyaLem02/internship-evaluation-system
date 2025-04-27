package org.example.backend.repositories;

import org.example.backend.entities.Appreciation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

public interface AppreciationRepository extends JpaRepository<Appreciation, Long> {
}

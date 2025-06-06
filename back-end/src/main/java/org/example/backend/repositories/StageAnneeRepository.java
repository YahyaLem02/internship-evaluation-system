package org.example.backend.repositories;

import org.example.backend.entities.Admin;
import org.example.backend.entities.StageAnnee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface StageAnneeRepository extends JpaRepository<StageAnnee, Long> {
    Optional<StageAnnee> findByShareToken(String shareToken);

}

package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stagiaire extends Personne {
    private String institution;

    @ManyToMany(mappedBy = "stagiaires")
    private Set<Stage> stages;
    @OneToMany(mappedBy = "stagiaire")
    private Set<Periode> periodes;

}
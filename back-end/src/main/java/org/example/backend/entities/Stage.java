package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;
    private String objectif;
    private String entreprise;

    @ManyToOne
    private StageAnnee stageAnnee;

    @ManyToMany
    @JoinTable(
            name = "periode",
            joinColumns = @JoinColumn(name = "id_stage"),
            inverseJoinColumns = @JoinColumn(name = "id_stagiaire")
    )
    private Set<Stagiaire> stagiaires;
}
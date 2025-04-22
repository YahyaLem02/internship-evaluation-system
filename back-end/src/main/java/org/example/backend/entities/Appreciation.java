package org.example.backend.entities;

import jakarta.persistence.*;
import lombok.*;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Appreciation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_tuteur")
    private Tuteur tuteur;

    @ManyToOne
    @JoinColumn(name = "id_periode")
    private Periode periode;

    @OneToMany(mappedBy = "appreciation")
    private Set<Evaluation> evaluations;

    @OneToMany(mappedBy = "appreciation")
    private Set<Competence> competences;
}
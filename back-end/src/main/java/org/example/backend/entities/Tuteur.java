package org.example.backend.entities;


import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Tuteur extends Personne {
    private String entreprise;

    @OneToMany(mappedBy = "tuteur")
    private Set<Appreciation> appreciations;
}

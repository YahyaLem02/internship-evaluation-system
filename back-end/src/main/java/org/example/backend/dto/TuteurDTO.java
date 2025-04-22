package org.example.backend.dto;


import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TuteurDTO extends PersonneDTO {
    private String entreprise;
    private Set<Long> appreciationIds; // IDs of related appreciations
}
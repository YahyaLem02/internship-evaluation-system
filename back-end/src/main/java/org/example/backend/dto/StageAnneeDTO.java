package org.example.backend.dto;


import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StageAnneeDTO {
    private Long id;
    private String anneeUniversitaire;
    private Set<Long> stageIds; // IDs of related stages
}
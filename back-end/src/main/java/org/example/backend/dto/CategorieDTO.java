package org.example.backend.dto;


import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CategorieDTO {
    private Long id;
    private String intitule;
    private String valeur;
    private Long competenceId; // ID of the related competence
}
package org.example.backend.dto;


import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class CompetenceDTO {
    private Long id;
    private String intitule;
    private String note;
    private Long appreciationId; // ID of the related appreciation
    private Set<Long> categorieIds; // IDs of related categories
}
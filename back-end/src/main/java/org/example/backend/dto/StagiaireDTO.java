package org.example.backend.dto;


import lombok.*;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class StagiaireDTO extends PersonneDTO {
    private String institution;
    private Set<Long> stageIds; // IDs of related stages
}
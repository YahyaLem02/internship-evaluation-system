package org.example.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PeriodeId implements Serializable {
    // Sans annotation @Id ou @GeneratedValue
    private Long stagiaireId;
    private Long stageId;

    public Long getStagiaireId() {
        return stagiaireId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof PeriodeId)) return false;
        PeriodeId that = (PeriodeId) o;
        return Objects.equals(stagiaireId, that.stagiaireId) &&
                Objects.equals(stageId, that.stageId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(stagiaireId, stageId);
    }
}
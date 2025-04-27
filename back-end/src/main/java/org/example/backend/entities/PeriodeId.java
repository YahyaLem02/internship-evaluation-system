package org.example.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable

public class PeriodeId implements Serializable {
    // Sans annotation @Id ou @GeneratedValue
    private Long stagiaireId;
    private Long stageId;
    // Constructeur par défaut
    public PeriodeId() {
    }
    // Constructeur avec tous les arguments
    public PeriodeId(Long stagiaireId, Long stageId) {
        this.stagiaireId = stagiaireId;
        this.stageId = stageId;
    }

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

    public void setStagiaireId(Long stagiaireId) {
        this.stagiaireId = stagiaireId;
    }

    public Long getStageId() {
        return stageId;
    }

    public void setStageId(Long stageId) {
        this.stageId = stageId;
    }
}
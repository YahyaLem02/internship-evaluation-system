package org.example.backend.entities;

import jakarta.persistence.Embeddable;
import lombok.*;

import java.io.Serializable;
import java.util.Objects;

@Embeddable

public class PeriodeId implements Serializable {
    private Long stagiaireId;
    private Long stageId;
    public PeriodeId() {
    }
    public PeriodeId(Long stagiaireId, Long stageId) {
        this.stagiaireId = stagiaireId;
        this.stageId = stageId;
    }

    public PeriodeId(Long periodeId) {
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
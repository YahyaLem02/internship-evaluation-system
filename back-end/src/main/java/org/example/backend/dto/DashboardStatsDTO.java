package org.example.backend.dto;

import java.util.List;
import java.util.Map;

public class DashboardStatsDTO {
    private Long totalStagiaires;
    private Long totalTuteurs;
    private Long totalStages;
    private Long totalAppreciations;
    private List<Map<String, Object>> stagesByAnnee;
    private List<Map<String, Object>> stagesByEntreprise;
    private List<Map<String, Object>> stagesByEvaluationStatus;
    private List<Map<String, Object>> averageNotesByCompetence;
    private List<Map<String, Object>> topTuteurs;
    private List<Map<String, Object>> evaluationDistribution;
    private List<Map<String, Object>> stagiairesByInstitution;
    private List<Map<String, Object>> stageDistributionByMonth;

    // Constructeur
    public DashboardStatsDTO() {
    }

    // Getters et Setters
    public Long getTotalStagiaires() {
        return totalStagiaires;
    }

    public void setTotalStagiaires(Long totalStagiaires) {
        this.totalStagiaires = totalStagiaires;
    }

    public Long getTotalTuteurs() {
        return totalTuteurs;
    }

    public void setTotalTuteurs(Long totalTuteurs) {
        this.totalTuteurs = totalTuteurs;
    }

    public Long getTotalStages() {
        return totalStages;
    }

    public void setTotalStages(Long totalStages) {
        this.totalStages = totalStages;
    }

    public Long getTotalAppreciations() {
        return totalAppreciations;
    }

    public void setTotalAppreciations(Long totalAppreciations) {
        this.totalAppreciations = totalAppreciations;
    }

    public List<Map<String, Object>> getStagesByAnnee() {
        return stagesByAnnee;
    }

    public void setStagesByAnnee(List<Map<String, Object>> stagesByAnnee) {
        this.stagesByAnnee = stagesByAnnee;
    }

    public List<Map<String, Object>> getStagesByEntreprise() {
        return stagesByEntreprise;
    }

    public void setStagesByEntreprise(List<Map<String, Object>> stagesByEntreprise) {
        this.stagesByEntreprise = stagesByEntreprise;
    }

    public List<Map<String, Object>> getStagesByEvaluationStatus() {
        return stagesByEvaluationStatus;
    }

    public void setStagesByEvaluationStatus(List<Map<String, Object>> stagesByEvaluationStatus) {
        this.stagesByEvaluationStatus = stagesByEvaluationStatus;
    }

    public List<Map<String, Object>> getAverageNotesByCompetence() {
        return averageNotesByCompetence;
    }

    public void setAverageNotesByCompetence(List<Map<String, Object>> averageNotesByCompetence) {
        this.averageNotesByCompetence = averageNotesByCompetence;
    }

    public List<Map<String, Object>> getTopTuteurs() {
        return topTuteurs;
    }

    public void setTopTuteurs(List<Map<String, Object>> topTuteurs) {
        this.topTuteurs = topTuteurs;
    }

    public List<Map<String, Object>> getEvaluationDistribution() {
        return evaluationDistribution;
    }

    public void setEvaluationDistribution(List<Map<String, Object>> evaluationDistribution) {
        this.evaluationDistribution = evaluationDistribution;
    }

    public List<Map<String, Object>> getStagiairesByInstitution() {
        return stagiairesByInstitution;
    }

    public void setStagiairesByInstitution(List<Map<String, Object>> stagiairesByInstitution) {
        this.stagiairesByInstitution = stagiairesByInstitution;
    }

    public List<Map<String, Object>> getStageDistributionByMonth() {
        return stageDistributionByMonth;
    }

    public void setStageDistributionByMonth(List<Map<String, Object>> stageDistributionByMonth) {
        this.stageDistributionByMonth = stageDistributionByMonth;
    }
}
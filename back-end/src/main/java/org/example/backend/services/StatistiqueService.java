package org.example.backend.services;

import org.example.backend.dto.DashboardStatsDTO;
import org.example.backend.repositories.StatistiqueRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class StatistiqueService {

    @Autowired
    private StatistiqueRepository statistiqueRepository;

    /**
     * Récupère toutes les statistiques pour le tableau de bord
     * @return DTO contenant toutes les statistiques
     */
    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Statistiques globales
        stats.setTotalStagiaires(statistiqueRepository.countTotalStagiaires());
        stats.setTotalTuteurs(statistiqueRepository.countTotalTuteurs());
        stats.setTotalStages(statistiqueRepository.countTotalStages());
        stats.setTotalAppreciations(statistiqueRepository.countTotalAppreciations());

        // Statistiques détaillées
        stats.setStagesByAnnee(statistiqueRepository.countStagesByAnnee());
        stats.setStagesByEntreprise(limitToTopN(statistiqueRepository.countStagesByEntreprise(), 10));
        stats.setStagesByEvaluationStatus(statistiqueRepository.countStagesByEvaluationStatus());
        stats.setAverageNotesByCompetence(statistiqueRepository.getAverageNotesByCompetence());
        stats.setTopTuteurs(limitToTopN(statistiqueRepository.getTopTuteursByAppreciations(), 5));
        stats.setEvaluationDistribution(statistiqueRepository.getEvaluationDistribution());
        stats.setStagiairesByInstitution(statistiqueRepository.countStagiairesByInstitution());
        stats.setStageDistributionByMonth(statistiqueRepository.getStageDistributionByMonth());

        return stats;
    }

    /**
     * Récupère les statistiques sur les stages
     * @return Map contenant les statistiques sur les stages
     */
    public Map<String, Object> getStageStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalStages());
        stats.put("byAnnee", statistiqueRepository.countStagesByAnnee());
        stats.put("byEntreprise", limitToTopN(statistiqueRepository.countStagesByEntreprise(), 10));
        stats.put("byEvaluationStatus", statistiqueRepository.countStagesByEvaluationStatus());
        stats.put("distributionByMonth", statistiqueRepository.getStageDistributionByMonth());

        return stats;
    }

    /**
     * Récupère les statistiques sur les stagiaires
     * @return Map contenant les statistiques sur les stagiaires
     */
    public Map<String, Object> getStagiaireStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalStagiaires());
        stats.put("byInstitution", statistiqueRepository.countStagiairesByInstitution());

        return stats;
    }

    /**
     * Récupère les statistiques sur les tuteurs
     * @return Map contenant les statistiques sur les tuteurs
     */
    public Map<String, Object> getTuteurStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalTuteurs());
        stats.put("topTuteurs", limitToTopN(statistiqueRepository.getTopTuteursByAppreciations(), 5));

        return stats;
    }

    /**
     * Récupère les statistiques sur les évaluations et compétences
     * @return Map contenant les statistiques sur les évaluations
     */
    public Map<String, Object> getEvaluationStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalAppreciations());
        stats.put("evaluationDistribution", statistiqueRepository.getEvaluationDistribution());
        stats.put("averageNotesByCompetence", statistiqueRepository.getAverageNotesByCompetence());

        return stats;
    }

    /**
     * Limite une liste de résultats aux N premiers éléments
     * @param list Liste à limiter
     * @param n Nombre d'éléments à conserver
     * @return Liste limitée aux N premiers éléments
     */
    private List<Map<String, Object>> limitToTopN(List<Map<String, Object>> list, int n) {
        return list.stream().limit(n).collect(Collectors.toList());
    }
}
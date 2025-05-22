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


    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        stats.setTotalStagiaires(statistiqueRepository.countTotalStagiaires());
        stats.setTotalTuteurs(statistiqueRepository.countTotalTuteurs());
        stats.setTotalStages(statistiqueRepository.countTotalStages());
        stats.setTotalAppreciations(statistiqueRepository.countTotalAppreciations());

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


    public Map<String, Object> getStageStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalStages());
        stats.put("byAnnee", statistiqueRepository.countStagesByAnnee());
        stats.put("byEntreprise", limitToTopN(statistiqueRepository.countStagesByEntreprise(), 10));
        stats.put("byEvaluationStatus", statistiqueRepository.countStagesByEvaluationStatus());
        stats.put("distributionByMonth", statistiqueRepository.getStageDistributionByMonth());

        return stats;
    }


    public Map<String, Object> getStagiaireStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalStagiaires());
        stats.put("byInstitution", statistiqueRepository.countStagiairesByInstitution());

        return stats;
    }


    public Map<String, Object> getTuteurStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalTuteurs());
        stats.put("topTuteurs", limitToTopN(statistiqueRepository.getTopTuteursByAppreciations(), 5));

        return stats;
    }


    public Map<String, Object> getEvaluationStats() {
        Map<String, Object> stats = new HashMap<>();

        stats.put("total", statistiqueRepository.countTotalAppreciations());
        stats.put("evaluationDistribution", statistiqueRepository.getEvaluationDistribution());
        stats.put("averageNotesByCompetence", statistiqueRepository.getAverageNotesByCompetence());

        return stats;
    }

    private List<Map<String, Object>> limitToTopN(List<Map<String, Object>> list, int n) {
        return list.stream().limit(n).collect(Collectors.toList());
    }
}
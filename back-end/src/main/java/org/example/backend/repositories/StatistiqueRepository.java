package org.example.backend.repositories;

import org.example.backend.entities.*;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@Repository
public interface StatistiqueRepository extends JpaRepository<Stage, Long> {

    // Nombre de stages par année
    @Query("SELECT sa.anneeUniversitaire as annee, COUNT(s) as nombre FROM Stage s JOIN s.stageAnnee sa GROUP BY sa.anneeUniversitaire")
    List<Map<String, Object>> countStagesByAnnee();

    // Nombre de stages par entreprise
    @Query("SELECT s.entreprise as entreprise, COUNT(s) as nombre FROM Stage s GROUP BY s.entreprise ORDER BY COUNT(s) DESC")
    List<Map<String, Object>> countStagesByEntreprise();

    // Nombre de stages évalués vs non évalués
    @Query("SELECT s.isEvaluated as evalue, COUNT(s) as nombre FROM Stage s GROUP BY s.isEvaluated")
    List<Map<String, Object>> countStagesByEvaluationStatus();

    // Distribution des notes par compétence
    @Query("SELECT c.intitule as competence, AVG(CAST(c.note as double)) as moyenne FROM Competence c GROUP BY c.intitule")
    List<Map<String, Object>> getAverageNotesByCompetence();

    // Top 5 des tuteurs ayant donné le plus d'appréciations
    @Query("SELECT t.nom as nom, t.prenom as prenom, COUNT(a) as nombre FROM Tuteur t JOIN t.appreciations a GROUP BY t.id ORDER BY COUNT(a) DESC")
    List<Map<String, Object>> getTopTuteursByAppreciations();

    // Distribution des évaluations par catégorie
    @Query("SELECT e.categorie as categorie, e.valeur as valeur, COUNT(e) as nombre FROM Evaluation e GROUP BY e.categorie, e.valeur")
    List<Map<String, Object>> getEvaluationDistribution();

    // Nombre de stagiaires par institution
    @Query("SELECT s.institution as institution, COUNT(s) as nombre FROM Stagiaire s GROUP BY s.institution")
    List<Map<String, Object>> countStagiairesByInstitution();

    // Répartition des stages dans le temps (par mois)
    @Query("SELECT FUNCTION('YEAR', p.dateDebut) as annee, FUNCTION('MONTH', p.dateDebut) as mois, COUNT(p) as nombre FROM Periode p GROUP BY FUNCTION('YEAR', p.dateDebut), FUNCTION('MONTH', p.dateDebut) ORDER BY annee, mois")
    List<Map<String, Object>> getStageDistributionByMonth();

    // Nombre total de stagiaires
    @Query("SELECT COUNT(DISTINCT s.id) FROM Stagiaire s")
    Long countTotalStagiaires();

    // Nombre total de tuteurs
    @Query("SELECT COUNT(DISTINCT t.id) FROM Tuteur t")
    Long countTotalTuteurs();

    // Nombre total de stages
    @Query("SELECT COUNT(s) FROM Stage s")
    Long countTotalStages();

    // Nombre total d'appréciations
    @Query("SELECT COUNT(a) FROM Appreciation a")
    Long countTotalAppreciations();
}
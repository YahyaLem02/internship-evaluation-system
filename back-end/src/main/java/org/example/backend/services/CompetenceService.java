package org.example.backend.services;

import org.example.backend.dto.CompetenceDTO;
import org.example.backend.entities.Appreciation;
import org.example.backend.entities.Categorie;
import org.example.backend.entities.Competence;
import org.example.backend.repositories.AppreciationRepository;
import org.example.backend.repositories.CategorieRepository;
import org.example.backend.repositories.CompetenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class CompetenceService {
    @Autowired
    private CompetenceRepository competenceRepository;

    @Autowired
    private AppreciationRepository appreciationRepository;

    @Autowired
    private CategorieRepository categorieRepository;

//    public List<CompetenceDTO> getAllCompetences() {
//        return competenceRepository.findAll().stream()
//                .map(this::convertToDTO)
//                .collect(Collectors.toList());
//    }
//
//    public CompetenceDTO getCompetenceById(Long id) {
//        Optional<Competence> competence = competenceRepository.findById(id);
//        return competence.map(this::convertToDTO).orElse(null);
//    }

//    public CompetenceDTO createCompetence(CompetenceDTO dto) {
//        Competence competence = new Competence();
//        competence.setIntitule(dto.getIntitule());
//        competence.setNote(dto.getNote());
//
//        appreciationRepository.findById(dto.getAppreciationId())
//                .ifPresent(competence::setAppreciation);
//
//        if (dto.getCategorieIds() != null) {
//            Set<Categorie> categories = new HashSet<>(categorieRepository.findAllById(dto.getCategorieIds()));
//            competence.setCategories(categories);
//        }
//
//        return convertToDTO(competenceRepository.save(competence));
//    }
//
//    public CompetenceDTO updateCompetence(Long id, CompetenceDTO dto) {
//        Optional<Competence> optional = competenceRepository.findById(id);
//        if (optional.isEmpty()) return null;
//
//        Competence competence = optional.get();
//        competence.setIntitule(dto.getIntitule());
//        competence.setNote(dto.getNote());
//
//        appreciationRepository.findById(dto.getAppreciationId())
//                .ifPresent(competence::setAppreciation);
//
//        if (dto.getCategorieIds() != null) {
//            Set<Categorie> categories = new HashSet<>(categorieRepository.findAllById(dto.getCategorieIds()));
//            competence.setCategories(categories);
//        }
//
//        return convertToDTO(competenceRepository.save(competence));
//    }
//
//    public void deleteCompetence(Long id) {
//        competenceRepository.deleteById(id);
//    }
//
//    private CompetenceDTO convertToDTO(Competence competence) {
//        Set<Long> categoryIds = competence.getCategories() != null
//                ? competence.getCategories().stream().map(Categorie::getId).collect(Collectors.toSet())
//                : new HashSet<>();
//
//        return new CompetenceDTO(
//                competence.getId(),
//                competence.getIntitule(),
//                competence.getNote(),
//                competence.getAppreciation() != null ? competence.getAppreciation().getId() : null,
//                categoryIds
//        );
//    }
}

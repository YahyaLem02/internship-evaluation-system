package org.example.backend.services;

import org.example.backend.dto.CategorieDTO;
import org.example.backend.entities.Categorie;
import org.example.backend.entities.Competence;
import org.example.backend.repositories.CategorieRepository;
import org.example.backend.repositories.CompetenceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CategorieService {

    @Autowired
    private CategorieRepository categorieRepository;

    @Autowired
    private CompetenceRepository competenceRepository;

    public List<CategorieDTO> getAllCategories() {
        return categorieRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public CategorieDTO getCategorieById(Long id) {
        return categorieRepository.findById(id)
                .map(this::convertToDTO)
                .orElse(null);
    }

    public CategorieDTO createCategorie(CategorieDTO dto) {
        Categorie categorie = new Categorie();
        categorie.setIntitule(dto.getIntitule());
        categorie.setValeur(dto.getValeur());

        competenceRepository.findById(dto.getCompetenceId())
                .ifPresent(categorie::setCompetence);

        return convertToDTO(categorieRepository.save(categorie));
    }

    public CategorieDTO updateCategorie(Long id, CategorieDTO dto) {
        Optional<Categorie> optional = categorieRepository.findById(id);
        if (optional.isEmpty()) return null;

        Categorie categorie = optional.get();
        categorie.setIntitule(dto.getIntitule());
        categorie.setValeur(dto.getValeur());

        competenceRepository.findById(dto.getCompetenceId())
                .ifPresent(categorie::setCompetence);

        return convertToDTO(categorieRepository.save(categorie));
    }

    public void deleteCategorie(Long id) {
        categorieRepository.deleteById(id);
    }

    private CategorieDTO convertToDTO(Categorie categorie) {
        return new CategorieDTO(
                categorie.getId(),
                categorie.getIntitule(),
                categorie.getValeur(),
                categorie.getCompetence() != null ? categorie.getCompetence().getId() : null
        );
    }
}

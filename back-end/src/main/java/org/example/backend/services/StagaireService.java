package org.example.backend.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.backend.dto.StagiaireDTO;
import org.example.backend.entities.Stagiaire;
import org.example.backend.repositories.StagaireRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StagaireService {

    @Autowired
    private StagaireRepository stagiaireRepository;

    @Autowired
    private ModelMapper modelMapper;

    public StagiaireDTO create(StagiaireDTO dto) {
        Stagiaire stagiaire = modelMapper.map(dto, Stagiaire.class);
        return modelMapper.map(stagiaireRepository.save(stagiaire), StagiaireDTO.class);
    }

    public List<StagiaireDTO> findAll() {
        return stagiaireRepository.findAll().stream()
                .map(s -> modelMapper.map(s, StagiaireDTO.class))
                .collect(Collectors.toList());
    }

    public Optional<StagiaireDTO> findById(Long id) {
        return stagiaireRepository.findById(id)
                .map(s -> modelMapper.map(s, StagiaireDTO.class));
    }

    @Transactional
    public StagiaireDTO updateStagiaire(Long id, StagiaireDTO stagiaireDTO) {
        Stagiaire existing = stagiaireRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stagiaire not found with id: " + id));

        // Mise à jour des champs sauf l'ID
        existing.setNom(stagiaireDTO.getNom());
        existing.setPrenom(stagiaireDTO.getPrenom());
        existing.setEmail(stagiaireDTO.getEmail());
        existing.setInstitution(stagiaireDTO.getInstitution());

        // Mise à jour du mot de passe uniquement s’il est présent
        if (stagiaireDTO.getMotDePasse() != null && !stagiaireDTO.getMotDePasse().isBlank()) {
            existing.setMotDePasse(stagiaireDTO.getMotDePasse());
        }

        Stagiaire updated = stagiaireRepository.save(existing);
        return modelMapper.map(updated, StagiaireDTO.class);
    }


    public void delete(Long id) {
        stagiaireRepository.deleteById(id);
    }
}

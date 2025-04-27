package org.example.backend.services;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.example.backend.dto.TuteurDTO;
import org.example.backend.entities.Tuteur;
import org.example.backend.repositories.TuteurRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TuteurService {

    @Autowired
    private TuteurRepository tuteurRepository;

    @Autowired
    private ModelMapper modelMapper;

    public TuteurDTO createTuteur(TuteurDTO tuteurDTO) {
        Tuteur tuteur = modelMapper.map(tuteurDTO, Tuteur.class);
        Tuteur saved = tuteurRepository.save(tuteur);
        return modelMapper.map(saved, TuteurDTO.class);
    }

    public TuteurDTO getTuteurById(Long id) {
        Tuteur tuteur = tuteurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tuteur not found"));
        return modelMapper.map(tuteur, TuteurDTO.class);
    }

    public List<TuteurDTO> getAllTuteurs() {
        return tuteurRepository.findAll().stream()
                .map(t -> modelMapper.map(t, TuteurDTO.class))
                .collect(Collectors.toList());
    }

    @Transactional
    public TuteurDTO updateTuteur(Long id, TuteurDTO tuteurDTO) {
        Tuteur existing = tuteurRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tuteur not found with id: " + id));

        // On met à jour les champs sauf l'ID
        existing.setNom(tuteurDTO.getNom());
        existing.setPrenom(tuteurDTO.getPrenom());
        existing.setEmail(tuteurDTO.getEmail());
        existing.setEntreprise(tuteurDTO.getEntreprise());

        // Mettre à jour le mot de passe uniquement s’il est présent
        if (tuteurDTO.getMotDePasse() != null && !tuteurDTO.getMotDePasse().isBlank()) {
            existing.setMotDePasse(tuteurDTO.getMotDePasse());
        }

        // Tu peux aussi gérer la liste d'appréciations si besoin
        // existing.setAppreciations(...);

        Tuteur updated = tuteurRepository.save(existing);
        return modelMapper.map(updated, TuteurDTO.class);
    }

    public void deleteTuteur(Long id) {
        tuteurRepository.deleteById(id);
    }
}

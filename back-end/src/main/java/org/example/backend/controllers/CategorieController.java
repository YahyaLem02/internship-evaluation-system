package org.example.backend.controllers;

import org.example.backend.dto.CategorieDTO;
import org.example.backend.services.CategorieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categorie")
public class CategorieController {

    @Autowired
    private CategorieService categorieService;

    @GetMapping
    public List<CategorieDTO> getAll() {
        return categorieService.getAllCategories();
    }

    @GetMapping("/{id}")
    public CategorieDTO getById(@PathVariable Long id) {
        return categorieService.getCategorieById(id);
    }

    @PostMapping("/add")
    public CategorieDTO create(@RequestBody CategorieDTO dto) {
        return categorieService.createCategorie(dto);
    }

    @PutMapping("/{id}")
    public CategorieDTO update(@PathVariable Long id, @RequestBody CategorieDTO dto) {
        return categorieService.updateCategorie(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categorieService.deleteCategorie(id);
    }
}

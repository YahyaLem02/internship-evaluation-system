package org.example.backend.controllers;

import org.example.backend.dto.PeriodeDTO;
import org.example.backend.services.PeriodeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/periode")
public class PeriodeController {

    @Autowired
    private PeriodeService periodeService;

    @GetMapping
    public List<PeriodeDTO> getAll() {
        return periodeService.getAllPeriodes();
    }

    @GetMapping("/{stagiaireId}/{stageId}")
    public PeriodeDTO get(@PathVariable Long stagiaireId, @PathVariable Long stageId) {
        return periodeService.getPeriode(stagiaireId, stageId);
    }

    @PostMapping("/add")
    public PeriodeDTO create(@RequestBody PeriodeDTO dto) {
        return periodeService.createPeriode(dto);
    }

    @PutMapping("/{stagiaireId}/{stageId}")
    public PeriodeDTO update(@PathVariable Long stagiaireId,
                             @PathVariable Long stageId,
                             @RequestBody PeriodeDTO dto) {
        return periodeService.updatePeriode(stagiaireId, stageId, dto);
    }

    @DeleteMapping("/{stagiaireId}/{stageId}")
    public void delete(@PathVariable Long stagiaireId, @PathVariable Long stageId) {
        periodeService.deletePeriode(stagiaireId, stageId);
    }
}

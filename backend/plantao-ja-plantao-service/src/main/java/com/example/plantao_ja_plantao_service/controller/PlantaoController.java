package com.example.plantao_ja_plantao_service.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.plantao_ja_plantao_service.model.Plantao;
import com.example.plantao_ja_plantao_service.model.PlantaoRequestDTO;
import com.example.plantao_ja_plantao_service.service.PlantaoService;

@RestController
@RequestMapping("/plantoes")
@CrossOrigin(origins = "http://localhost:5173") // Permitir o seu front-end em React/Vue
public class PlantaoController {

    @Autowired
    private PlantaoService plantaoService;

    @PostMapping
    public ResponseEntity<?> createPlantao(@RequestBody PlantaoRequestDTO dto) {
        try {
            Plantao novoPlantao = plantaoService.save(dto);
            return ResponseEntity.status(HttpStatus.CREATED).body(novoPlantao);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePlantao(@RequestBody PlantaoRequestDTO dto, @PathVariable Long id) {
        try {
            return ResponseEntity.ok(plantaoService.update(dto, id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePlantao(@PathVariable Long id) {
        try {
            plantaoService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/fechar")
    public ResponseEntity<?> fecharCaptacao(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(plantaoService.fecharCaptacao(id));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
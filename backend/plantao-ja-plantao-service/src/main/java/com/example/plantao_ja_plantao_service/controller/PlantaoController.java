package com.example.plantao_ja_plantao_service.controller;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.transaction.annotation.Transactional; // 🚨 IMPORTANTE

import com.example.plantao_ja_plantao_service.model.Plantao;
import com.example.plantao_ja_plantao_service.model.PlantaoRequestDTO;
import com.example.plantao_ja_plantao_service.model.PlantaoStatus;
import com.example.plantao_ja_plantao_service.repository.PlantaoRepository;
import com.example.plantao_ja_plantao_service.service.PlantaoService;

@RestController
@RequestMapping("/plantoes")
public class PlantaoController {

    @Autowired
    private PlantaoService plantaoService;

    @Autowired
    private PlantaoRepository plantaoRepository;

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

    // --- ADICIONADO: GET Geral para a Dashboard do Médico e do Gestor ---
    @GetMapping
    public ResponseEntity<List<Plantao>> getAllPlantoes() {
        return ResponseEntity.ok(plantaoService.findAll());
    }

    // --- ADICIONADO: GET Filtrado por Hospital (útil para o Painel do Gestor) ---
    @GetMapping("/hospital/{hospitalId}")
    public ResponseEntity<List<Plantao>> getPlantoesPorHospital(@PathVariable UUID hospitalId) {
        return ResponseEntity.ok(plantaoService.findByHospitalId(hospitalId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Plantao> getById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(plantaoService.findById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
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

    // Rota: PATCH /plantoes/{id}/aceitar?medicoId=5
    @PatchMapping("/{id}/aceitar")
    public ResponseEntity<?> aceitarMedico(@PathVariable Long id, @RequestParam Long medicoId, @RequestParam Long gestorId) {
        try {
            return ResponseEntity.ok(plantaoService.aceitarMedico(id, medicoId, gestorId));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Rota: PATCH /plantoes/{id}/status?novoStatus=FECHADO
    @PatchMapping("/{id}/status")
    public ResponseEntity<?> alterarStatus(@PathVariable Long id, @RequestParam PlantaoStatus novoStatus) {
        try {
            return ResponseEntity.ok(plantaoService.alterarStatus(id, novoStatus));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{plantaoId}/inscrever/{medicoId}")
    @Transactional
    public Plantao inscreverMedico(Long plantaoId, Long medicoId) {
        // 1. Busca o plantão direto do banco
        Plantao plantao = plantaoRepository.findById(plantaoId)
                .orElseThrow(() -> new RuntimeException("Plantão não encontrado"));

        // 2. Valida o status
        if (!"ABERTO".equals(plantao.getStatus())) {
            throw new IllegalStateException("Este plantão não está mais aceitando inscrições.");
        }

        // 3. Adiciona o ID do médico na lista (O JPA rastreia essa alteração automaticamente)
        if (!plantao.getMedicoInscritosIds().contains(medicoId)) {
            plantao.getMedicoInscritosIds().add(medicoId);
        }

        // 4. Salva e força o banco a atualizar imediatamente com o flush
        return plantaoRepository.saveAndFlush(plantao); 
    }
}
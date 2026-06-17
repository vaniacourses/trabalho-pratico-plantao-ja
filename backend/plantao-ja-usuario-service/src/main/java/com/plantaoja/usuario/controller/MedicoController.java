package com.plantaoja.usuario.controller;

import com.plantaoja.usuario.dto.MedicoCreate;
import com.plantaoja.usuario.dto.MedicoResponse;
import com.plantaoja.usuario.service.MedicoService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/medicos")
public class MedicoController {

    private final MedicoService medicoService;

    @PostMapping
    public ResponseEntity<String> cadastrarMedico(@RequestBody MedicoCreate medicoCreate) {
        return ResponseEntity.ok(medicoService.cadastrarMedico(medicoCreate));
    }

    @GetMapping
    public ResponseEntity<List<MedicoResponse>> listarMedicos() {
        return ResponseEntity.ok(medicoService.listarMedicos());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MedicoResponse> buscarPorId(@PathVariable Long id) {
        MedicoResponse medico = medicoService.buscarPorId(id);
        if (medico == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(medico);
    }
}
package br.com.plantao.plantao_ja.controller;

import br.com.plantao.plantao_ja.model.endereco.EnderecoRequestDTO;
import br.com.plantao.plantao_ja.model.endereco.EnderecoResponseDTO;
import br.com.plantao.plantao_ja.model.hospital.HospitalRequestDTO;
import br.com.plantao.plantao_ja.model.hospital.HospitalResponseDTO;
import br.com.plantao.plantao_ja.service.EnderecoService;
import br.com.plantao.plantao_ja.service.HospitalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/endereco")
public class EnderecoController {

    @Autowired
    private EnderecoService enderecoService;

    @GetMapping("/{id}")
    public ResponseEntity<EnderecoResponseDTO> findById(@PathVariable Long id){
        return ResponseEntity.ok(EnderecoResponseDTO.fromEntity(enderecoService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<EnderecoResponseDTO> createHospital(@RequestBody EnderecoRequestDTO endereco){
        return ResponseEntity.status(HttpStatus.CREATED).body(EnderecoResponseDTO.fromEntity(enderecoService.save(endereco)));
    }

}

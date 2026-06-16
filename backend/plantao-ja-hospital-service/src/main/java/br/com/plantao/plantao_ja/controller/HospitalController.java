package br.com.plantao.plantao_ja.controller;

import br.com.plantao.plantao_ja.model.hospital.HospitalRequestDTO;
import br.com.plantao.plantao_ja.model.hospital.HospitalResponseDTO;
import br.com.plantao.plantao_ja.service.HospitalService;
import jakarta.websocket.server.PathParam;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/hospital")
@CrossOrigin(origins = "http://localhost:5173")
public class HospitalController {

    @Autowired
    private HospitalService hospitalService;

    @GetMapping
    public ResponseEntity<Page<HospitalResponseDTO>> listarTodos(
            @PageableDefault(size = 10, sort = "nome")
            Pageable pageable) {

        return ResponseEntity.ok(
                hospitalService.findAll(pageable)
        );
    }

    @GetMapping("/{id}")
    public ResponseEntity<HospitalResponseDTO> findById(@PathVariable String id){
        return ResponseEntity.ok(HospitalResponseDTO.fromEntity(hospitalService.findById(id)));
    }

    @PostMapping
    public ResponseEntity<HospitalResponseDTO> createHospital(@RequestBody HospitalRequestDTO hospital){
        return ResponseEntity.status(HttpStatus.CREATED).body(HospitalResponseDTO.fromEntity(hospitalService.save(hospital)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<HospitalResponseDTO> updateHospital(@RequestBody HospitalRequestDTO hospital, @PathVariable String id){
        return ResponseEntity.ok(HospitalResponseDTO.fromEntity(hospitalService.update(hospital, id)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity deleteHospital(@PathVariable String id){

        hospitalService.delete(id);

        return ResponseEntity.noContent().build();
    }

}

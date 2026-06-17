package com.example.plantao_ja_plantao_service.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.plantao_ja_plantao_service.model.Plantao;
import com.example.plantao_ja_plantao_service.model.PlantaoRequestDTO;
import com.example.plantao_ja_plantao_service.repository.PlantaoRepository;

@Service
public class PlantaoService {

    @Autowired
    private PlantaoRepository plantaoRepository;

    // Ferramenta do Spring para fazer requisições HTTP para outros microsserviços
    private final RestTemplate restTemplate = new RestTemplate();
    
    
    @Value("${hospital.api.url:http://localhost:8080/hospital/}")
    private String hospitalServiceUrl;

    public Plantao findById(Long id) {
        return plantaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantão não encontrado"));
    }

    public Plantao save(PlantaoRequestDTO dto) {
        try {
            // Alterado para usar a variável em vez da string fixa
            restTemplate.getForEntity(hospitalServiceUrl + dto.hospitalId(), String.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("O Hospital informado não existe no sistema!");
        }

        // 2. Validações de Negócio
        if (dto.dataInicio().isAfter(dto.dataFim())) {
            throw new IllegalArgumentException("A data de início deve ser anterior à data de término.");
        }

        // 3. Criar e Salvar o Plantão
        Plantao plantao = new Plantao();
        plantao.setHospitalId(dto.hospitalId());
        plantao.setDataInicio(dto.dataInicio());
        plantao.setDataFim(dto.dataFim());
        plantao.setRemuneracao(dto.remuneracao());
        plantao.setStatus("ABERTO");

        return plantaoRepository.save(plantao);
    }

    public Plantao update(PlantaoRequestDTO dto, Long id) {
        Plantao existente = this.findById(id);

        if (dto.dataInicio().isAfter(dto.dataFim())) {
            throw new IllegalArgumentException("A data de início deve ser anterior à data de término.");
        }

        existente.setDataInicio(dto.dataInicio());
        existente.setDataFim(dto.dataFim());
        existente.setRemuneracao(dto.remuneracao());
        
        return plantaoRepository.save(existente);
    }

    public void delete(Long id) {
        Plantao plantao = this.findById(id);
        plantaoRepository.delete(plantao);
    }

    public Plantao fecharCaptacao(Long id) {
        Plantao plantao = this.findById(id);
        if ("FECHADO".equals(plantao.getStatus())) {
            throw new IllegalStateException("Este plantão já está fechado.");
        }
        plantao.setStatus("FECHADO");
        return plantaoRepository.save(plantao);
    }
}
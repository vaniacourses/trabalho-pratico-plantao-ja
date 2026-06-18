package com.example.plantao_ja_plantao_service.service;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import com.example.plantao_ja_plantao_service.model.Plantao;
import com.example.plantao_ja_plantao_service.model.PlantaoRequestDTO;
import com.example.plantao_ja_plantao_service.model.PlantaoStatus;
import com.example.plantao_ja_plantao_service.repository.PlantaoRepository;

@Service
public class PlantaoService {

    @Autowired
    private PlantaoRepository plantaoRepository;

    // Ferramenta do Spring para fazer requisições HTTP para outros microsserviços
    private final RestTemplate restTemplate = new RestTemplate();
    
    
    @Value("${hospital.url:http://hospital-service:8081/hospital/}")
    private String hospitalServiceUrl;

    public List<Plantao> findAll() {
        return plantaoRepository.findAll();
    }

    public Plantao findById(Long id) {
        return plantaoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plantão não encontrado"));
    }

    public Plantao save(PlantaoRequestDTO dto) {
        try {
            // CORRIGIDO: Se a URL do properties terminar com "/", removemos para concatenar sem erros
            String urlBase = hospitalServiceUrl.endsWith("/") ? hospitalServiceUrl : hospitalServiceUrl + "/";
            restTemplate.getForEntity(urlBase + dto.hospitalId(), String.class);
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("O Hospital informado não existe no sistema!");
        } catch (Exception e) {
            // Uma trava temporária super útil para debug se a rede Docker der timeout
            throw new RuntimeException("Erro de comunicação interna ao validar Hospital: " + e.getMessage());
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
        plantao.setStatus(PlantaoStatus.ABERTO);
        plantao.setEspecialidade(dto.especialidade());
        return plantaoRepository.save(plantao);
    }
    
    public List<Plantao> findByHospitalId(UUID hospitalId) {
        return plantaoRepository.findByHospitalId(hospitalId);
    }

    public Plantao inscreverMedico(Long plantaoId, Long medicoId) {
        Plantao plantao = this.findById(plantaoId);

        if (plantao.getStatus() != PlantaoStatus.ABERTO && plantao.getStatus() != PlantaoStatus.ATIVO) {
            throw new IllegalStateException("Não é possível se inscrever: este plantão não está com captação ativa.");
        }

        if (plantao.getMedicoInscritosIds().contains(medicoId)) {
            throw new IllegalArgumentException("Médico já está inscrito neste plantão.");
        }

        plantao.getMedicoInscritosIds().add(medicoId);
        return plantaoRepository.save(plantao);
    }

    // --- NOVA LÓGICA: Gestor aceita um médico inscrito ---
    // --- LÓGICA PROTEGIDA: Apenas o gestor dono do hospital pode aceitar ---
    public Plantao aceitarMedico(Long plantaoId, Long medicoId, Long gestorIdLogado) {
        Plantao plantao = this.findById(plantaoId);

        // 1. Validação básica de inscrição
        if (!plantao.getMedicoInscritosIds().contains(medicoId)) {
            throw new IllegalArgumentException("Este médico não realizou inscrição neste plantão.");
        }

        // 2. REGRA DE OURO: Ir ao HospitalService e validar se o hospital pertence a ESTE gestor
        try {
            // Buscamos o JSON do hospital associado ao plantão
            String hospitalJson = restTemplate.getForObject(hospitalServiceUrl + plantao.getHospitalId(), String.class);
            
            // Aqui fazemos uma checagem rápida se o id do gestor logado está dentro do JSON do hospital
            // (O ideal é mapear para um HospitalDTO, mas contendo a checagem de texto ou DTO funciona)
            String buscaGestor = "\"gestorId\":" + gestorIdLogado;
            if (hospitalJson == null || !hospitalJson.contains(buscaGestor)) {
                throw new IllegalStateException("Acesso Negado: Você não é o gestor responsável por este hospital!");
            }
        } catch (HttpClientErrorException.NotFound e) {
            throw new RuntimeException("O Hospital deste plantão não foi localizado no sistema.");
        }

        // 3. Se passou pela trava, move da lista de inscritos para a de aceitos
        plantao.getMedicoInscritosIds().remove(medicoId);
        
        if (!plantao.getMedicoAceitosIds().contains(medicoId)) {
            plantao.getMedicoAceitosIds().add(medicoId);
        }

        return plantaoRepository.save(plantao);
    }

    // --- NOVA LÓGICA: Alterar Status Geral de forma dinâmica ---
    public Plantao alterarStatus(Long id, PlantaoStatus novoStatus) {
        Plantao plantao = this.findById(id);
        plantao.setStatus(novoStatus);
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
    
}
package br.com.plantao.plantao_ja.service;

import br.com.plantao.plantao_ja.model.endereco.Endereco;
import br.com.plantao.plantao_ja.model.endereco.EnderecoRequestDTO;
import br.com.plantao.plantao_ja.model.hospital.Hospital;
import br.com.plantao.plantao_ja.model.hospital.HospitalRequestDTO;
import br.com.plantao.plantao_ja.repository.EnderecoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class EnderecoService {

    @Autowired
    private EnderecoRepository enderecoRepository;

    public Endereco findById(Long id) {
        return enderecoRepository.findById(id).get();
    }

    public Endereco save(EnderecoRequestDTO endereco) {
        return enderecoRepository.save(endereco.toEntity());
    }

}

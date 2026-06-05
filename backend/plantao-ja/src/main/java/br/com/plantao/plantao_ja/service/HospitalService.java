package br.com.plantao.plantao_ja.service;

import br.com.plantao.plantao_ja.model.hospital.Hospital;
import br.com.plantao.plantao_ja.model.hospital.HospitalRequestDTO;
import br.com.plantao.plantao_ja.model.hospital.HospitalResponseDTO;
import br.com.plantao.plantao_ja.repository.HospitalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class HospitalService {

    @Autowired
    private HospitalRepository hospitalRepository;

    public Hospital findById(String id) {
        return hospitalRepository.findObjById(id);
    }

    public Hospital save(HospitalRequestDTO hospital) {
        return hospitalRepository.save(hospital.toEntity());
    }

    public Hospital update(HospitalRequestDTO hospital, String id) {

        Hospital novoHospital = this.findById(id);

        novoHospital.setNome(hospital.nome());
        novoHospital.setCnpj(hospital.cnpj());
        novoHospital.setNotaMedia(hospital.notaMedia());
        novoHospital.setStatusCadastro(hospital.statusCadastro());
        novoHospital.setEndereco(hospital.endereco());

        return hospitalRepository.save(novoHospital);
    }

    public void delete(String id) {
        this.findById(id);
        hospitalRepository.delete(findById(id));
    }

    public Page<HospitalResponseDTO> findAll(Pageable pageable) {
        return hospitalRepository
                .findAll(pageable)
                .map(HospitalResponseDTO::fromEntity);
    }


}

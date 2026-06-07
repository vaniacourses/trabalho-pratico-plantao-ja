package br.com.plantao.plantao_ja.repository;

import br.com.plantao.plantao_ja.exception.ObjetoNotFoundException;
import br.com.plantao.plantao_ja.model.hospital.Hospital;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface HospitalRepository extends JpaRepository<Hospital, UUID> {

    default Hospital findObjById(String id){
        return findById(UUID.fromString(id)).orElseThrow(() -> new ObjetoNotFoundException("Hospital com o ID: %s não foi encontrado".formatted(id)));
    };

}

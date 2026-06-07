package br.com.plantao.plantao_ja.model.hospital;

import br.com.plantao.plantao_ja.model.endereco.Endereco;

import java.util.UUID;

public record HospitalResponseDTO(UUID id, String nome, String cnpj, float notaMedia, String statusCadastro, Endereco endereco, Long gestorId) {

    public static HospitalResponseDTO fromEntity(Hospital hospital) {
        return new HospitalResponseDTO(hospital.getId(),
                hospital.getNome(),
                hospital.getCnpj(),
                hospital.getNotaMedia(),
                hospital.getStatusCadastro(),
                hospital.getEndereco(),
                hospital.getGestorId());
    }
}

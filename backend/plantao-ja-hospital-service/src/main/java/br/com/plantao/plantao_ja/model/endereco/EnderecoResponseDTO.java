package br.com.plantao.plantao_ja.model.endereco;

import br.com.plantao.plantao_ja.model.endereco.Endereco;
import br.com.plantao.plantao_ja.model.hospital.HospitalResponseDTO;

public record EnderecoResponseDTO(Long id, String cep, String rua,int numero,String complemento) {

    public static EnderecoResponseDTO fromEntity(Endereco endereco) {
        return new EnderecoResponseDTO(endereco.getId(),
                endereco.getCep(),
                endereco.getRua(),
                endereco.getNumero(),
                endereco.getComplemento());
    }
}

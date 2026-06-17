package br.com.plantao.plantao_ja.model.hospital;

import br.com.plantao.plantao_ja.model.endereco.Endereco;

public record EnderecoResponseDTO(Long id, String cep, String rua,String numero,String complemento) {

    public static EnderecoResponseDTO fromEntity(Endereco hospital) {
        return new EnderecoResponseDTO(

        );
    }
}

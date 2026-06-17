package br.com.plantao.plantao_ja.repository;

import br.com.plantao.plantao_ja.model.endereco.Endereco;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface EnderecoRepository extends JpaRepository<Endereco, Long> {


}

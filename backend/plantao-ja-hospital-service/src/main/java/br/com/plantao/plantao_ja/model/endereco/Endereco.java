package br.com.plantao.plantao_ja.model.endereco;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name="tb_endereco")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Endereco {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NonNull
    private String cep;

    @NonNull
    private String rua;

    private Long numero;

    private String complemento;
}

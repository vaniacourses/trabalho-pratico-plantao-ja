package com.plantaoja.usuario.service;

import com.plantaoja.usuario.dto.MedicoCreate;
import com.plantaoja.usuario.dto.MedicoResponse;
import com.plantaoja.usuario.model.MedicoProfile;
import com.plantaoja.usuario.model.Usuario;
import com.plantaoja.usuario.repository.MedicoRepository;
import com.plantaoja.usuario.repository.UsuarioRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@AllArgsConstructor
@Service
public class MedicoService {

    private final MedicoRepository medicoRepository;
    private final UsuarioRepository usuarioRepository;


    public String cadastrarMedico(MedicoCreate medicoCreate) {
        // 1. Cria o registro base na tabela tb_usuario primeiro
        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(medicoCreate.getNome());
        novoUsuario.setEmail(medicoCreate.getEmail());
        novoUsuario.setSenha((medicoCreate.getSenha())); // Criptografa
        novoUsuario.setRole(com.plantaoja.usuario.util.Role.MEDICO); // Já crava a role do cara
        novoUsuario.setAtivo(true);
        
        Usuario usuarioSalvo = usuarioRepository.save(novoUsuario);

        // 2. Valida o CRM antes de salvar o perfil
        if (medicoRepository.existsByCrm(medicoCreate.getCrm())) {
            return "CRM já cadastrado!";
        }

        // 3. Salva o perfil médico apontando para o id recém-criado
        MedicoProfile medico = new MedicoProfile(
            null,
            usuarioSalvo,
            medicoCreate.getCrm(),
            medicoCreate.getEspecialidade()
        );

        medicoRepository.save(medico);
        return "Médico cadastrado com sucesso!";
    }

    public List<MedicoResponse> listarMedicos() {
        return medicoRepository.findAll()
            .stream()
            .map(this::toResponse)
            .toList();
    }

    public MedicoResponse buscarPorId(Long id) {
        MedicoProfile medico = medicoRepository.findById(id).orElse(null);
        if (medico == null) {
            return null;
        }
        return toResponse(medico);
    }

    private MedicoResponse toResponse(MedicoProfile medico) {
        return new MedicoResponse(
            medico.getId(),
            medico.getUser().getId(),
            medico.getUser().getNome(),
            medico.getUser().getEmail(),
            medico.getCrm(),
            medico.getEspecialidade()
        );
    }
}
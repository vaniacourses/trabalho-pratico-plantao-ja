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
        Usuario usuario = usuarioRepository.findById(medicoCreate.getUserId()).orElse(null);

        if (usuario == null) {
            return "Usuário não encontrado!";
        }

        if (medicoRepository.findByUserId(usuario.getId()).isPresent()) {
            return "Usuário já possui perfil médico!";
        }

        if (medicoRepository.existsByCrm(medicoCreate.getCrm())) {
            return "CRM já cadastrado!";
        }

        MedicoProfile medico = new MedicoProfile(
            null,
            usuario,
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
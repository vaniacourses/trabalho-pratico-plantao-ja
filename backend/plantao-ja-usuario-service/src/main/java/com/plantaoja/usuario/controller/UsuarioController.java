package com.plantaoja.usuario.controller;

import com.plantaoja.usuario.dto.UsuarioCreate;
import com.plantaoja.usuario.model.Usuario;
import com.plantaoja.usuario.service.UsuarioService;
import com.plantaoja.usuario.util.InfoUsuario;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("usuarios")   
public class UsuarioController {

    private final UsuarioService usuarioService;

    @GetMapping
    public List<Usuario> recuperaUsuarios() {
        return usuarioService.recuperarUsuarios();
    }

    @PostMapping
    public InfoUsuario cadastrarUsuario(@RequestBody @Valid UsuarioCreate usuarioCreate) {
        return usuarioService.cadastrarUsuario(usuarioCreate);
    }
}
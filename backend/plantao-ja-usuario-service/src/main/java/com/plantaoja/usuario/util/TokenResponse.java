package com.plantaoja.usuario.util;

public record TokenResponse(String token, long idUsuario, String nome, String role) {
}

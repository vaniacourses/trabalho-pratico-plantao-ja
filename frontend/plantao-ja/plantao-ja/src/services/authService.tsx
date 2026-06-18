// services/authService.ts
import type { TokenResponse, UsuarioLogin, UsuarioCreate, MedicoCreate, InfoUsuario } from "../types";

const BASE_URL = "http://localhost:8080"; // Porta padrão do seu Spring Boot

export const authService = {
    // Rota: /autenticacao/login
    login: async (credentials: UsuarioLogin): Promise<TokenResponse> => {
        const res = await fetch(`${BASE_URL}/autenticacao/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });
        
        if (!res.ok) throw new Error("Credenciais inválidas ou erro no servidor.");
        return res.json();
    },

    // Rota: /usuarios (Cadastro do usuário base)
    cadastrarUsuario: async (payload: UsuarioCreate): Promise<InfoUsuario> => {
        const res = await fetch(`${BASE_URL}/usuarios`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro de comunicação ao registrar usuário.");
        return res.json();
    },

    // Rota: /medicos (Cria o perfil complementar usando o userId gerado)
    vincularPerfilMedico: async (payload: MedicoCreate): Promise<string> => {
        const res = await fetch(`${BASE_URL}/medicos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (!res.ok) throw new Error("Erro ao salvar perfil médico.");
        return res.text(); // O controlador retorna uma String pura
    }
};
// src/services/usuarioService.ts

// 💡 CORRIGIDO: Deixamos a raiz do Gateway para poder acessar múltiplos controllers
const API_BASE_URL = "http://localhost:8080"; 

export const usuarioService = {
    
    // 💡 1. LOGIN REAL: Conecta com o seu AuthenticationController do Java
    login: async (email: string, senha: string) => {
        // URL Final Correta: http://localhost:8080/autenticacao/login
        const response = await fetch(`${API_BASE_URL}/autenticacao/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }) // Passa email e senha pro DTO UsuarioLogin
        });

        if (!response.ok) {
            throw new Error("E-mail ou senha incorretos no servidor.");
        }

        const dadosAutenticados = await response.json();
        
        // Guarda as informações essenciais que o React precisa para renderizar as telas
        localStorage.setItem("user", JSON.stringify({
            id: dadosAutenticados.id,
            nome: dadosAutenticados.nome,
            role: dadosAutenticados.role // Aqui virá "MEDICO" ou "GESTOR"
        }));

        return dadosAutenticados;
    },

    // 💡 2. CADASTRO DE MÉDICO REAL: Conecta com o seu MedicoController do Java
        cadastrarMedico: async (dadosMedico: { nome: string; email: string; password?: string; senha?: string; crm: string; especialidade: string }) => {
            // 💡 CORRIGIDO: Usando crases (backticks) e a rota certa (/medicos) para bater no MedicoController

            // 💡 SOLUÇÃO: Garante que o Spring receberá a propriedade 'senha', 
        // não importa se no React o estado se chama 'password' ou 'senha'
            const payloadParaOJava = {
                nome: dadosMedico.nome,
                email: dadosMedico.email,
                senha: dadosMedico.senha || dadosMedico.password, // Pega o que estiver preenchido
                crm: dadosMedico.crm,
                especialidade: dadosMedico.especialidade
            };
            const response = await fetch(`${API_BASE_URL}/medicos`, { 
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payloadParaOJava) // Passa o objeto para o DTO MedicoCreate
            });

            if (!response.ok) {
                const erroMsg = await response.text();
                throw new Error(erroMsg || "Erro ao cadastrar médico no banco do Docker.");
            }

            return response.text(); 
        }
};
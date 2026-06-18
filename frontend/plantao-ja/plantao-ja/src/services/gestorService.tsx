// services/gestorService.ts

const BASE_URL = "http://localhost:8082"; // porta do usuario-service

export interface GestorPayload {
  nome: string;
  email: string;
  senha: string;
}

export interface InfoUsuario {
  valido: boolean;
  duplicado: boolean;
  mensagem: string;
}

export const gestorService = {
  create: async (payload: GestorPayload): Promise<InfoUsuario> => {
    const res = await fetch(`${BASE_URL}/usuarios`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, role: "GESTOR" }),
    });
    if (!res.ok) throw new Error("Erro ao cadastrar gestor");
    return res.json();
  },
};
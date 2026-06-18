// services/medicoService.ts (novo arquivo)

const USUARIO_SERVICE_URL = "http://localhost:8082"; // porta do usuario-service

export interface MedicoResponse {
  id: number;
  userId: number;
  nomeUsuario: string;
  emailUsuario: string;
  crm: string;
  especialidade: string;
}

export const medicoService = {
  getAll: async (): Promise<MedicoResponse[]> => {
    const res = await fetch(`${USUARIO_SERVICE_URL}/medicos`);
    if (!res.ok) throw new Error("Erro ao buscar médicos.");
    return res.json();
  },
};
// services/hospitalService.ts
import type { HospitalPayload } from "../types";
import type { SpringPage } from "../types";
import type { Hospital } from "../types";

const BASE_URL = "http://localhost:5002"; // porta padrão do Spring Boot

export const hospitalService = {
  getAll: async (page = 0, size = 10): Promise<SpringPage<Hospital>> => {
    const res = await fetch(`${BASE_URL}/hospitais`);
    if (!res.ok) throw new Error("Erro ao buscar hospitais");
    return res.json();
    // ⬆️ retorna a Page inteira — seu hook vai acessar .content
  },

  create: async (payload: HospitalPayload): Promise<Hospital> => {
    const res = await fetch(`${BASE_URL}/hospital`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("Erro ao criar hospital");
    return res.json();
  },

  delete: async (hospitalId: string) => {
    const res = await fetch(`${BASE_URL}/hospital/${hospitalId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Erro ao criar hospital");
  },

  update: async (hospitalId: string, payload: HospitalPayload) => {
    const res = await fetch(`${BASE_URL}/hospital/${hospitalId}`,{
        method: "PUT",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Erro ao criar hospital");
    return res.json();
  }

  // ... update e delete seguem o mesmo padrão
};
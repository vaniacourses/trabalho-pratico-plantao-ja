import type { PlantaoRequestDTO, Plantao } from "../types";

// DEIXE A URL BASE APENAS ATÉ A PORTA:
export const API_BASE_URL = "http://localhost:8080/plantoes"; // MOCK: json-server
// export const API_BASE_URL = "http://localhost:8080/api/v1"; // FUTURO: API Gateway

export const plantaoService = {

    // URL Final: http://localhost:5004/plantoes
    getAll: async (): Promise<Plantao[]> => {
        const response = await fetch(`${API_BASE_URL}`);
        if (!response.ok) {
            throw new Error("Não foi possível carregar a lista de plantões.");
        }
        return response.json();
    },

    getByHospitalId: async (hospitalId: string): Promise<Plantao[]> => {
        const response = await fetch(`${API_BASE_URL}/hospital/${hospitalId}`)
        if(response.ok) return response.json();
        throw new Error("Erro ao carregar plantões deste hospital.")
    },

    // 2. CORRIGIDO: Mapeia o @PostMapping do Controller
    // URL Final: http://localhost:5004/plantoes
    cadastrar: async (dto: PlantaoRequestDTO): Promise<Plantao> => {
        const response = await fetch(`${API_BASE_URL}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(dto),
        });

        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg || "Erro ao cadastrar plantão.");
        }

        return response.json();
    },

    // PATCH /plantoes/{id}/inscrever?medicoId={id} (Médico se candidata)
    inscreverMedico: async (plantaoId: number, medicoId: string): Promise<Plantao> => {
        const res = await fetch(`${API_BASE_URL}/${plantaoId}/inscrever?medicoId=${medicoId}`, {
            method: "PATCH"
        });
        if (!res.ok) {
            const erroMsg = await res.text();
            throw new Error(erroMsg || "Erro ao realizar inscrição.");
        }
        return res.json();
    },

    // PATCH /plantoes/{id}/aceitar?medicoId={id}&gestorId={id} (Gestor aceita o médico)
    aceitarMedico: async (plantaoId: number, medicoId: number, gestorId: number): Promise<Plantao> => {
        const res = await fetch(`${API_BASE_URL}/${plantaoId}/aceitar?medicoId=${medicoId}&gestorId=${gestorId}`, {
            method: "PATCH"
        });
        if (!res.ok) {
            const erroMsg = await res.text();
            throw new Error(erroMsg || "Acesso negado ou erro ao aceitar médico.");
        }
        return res.json();
    },

    // PATCH /plantoes/{id}/status?novoStatus=FECHADO (Muda status do plantão)
    alterarStatus: async (plantaoId: number, novoStatus: "ABERTO" | "FECHADO" | "ATIVO" | "INATIVO"): Promise<Plantao> => {
        const res = await fetch(`${API_BASE_URL}/${plantaoId}/status?novoStatus=${novoStatus}`, {
            method: "PATCH"
        });
        if (!res.ok) throw new Error("Erro ao atualizar o status do plantão.");
        return res.json();
    },

    // 3. CORRIGIDO: Mapeia o @PutMapping("/{id}")
    // URL Final: http://localhost:5004/plantoes/1
    atualizar: async (id: number, dto: PlantaoRequestDTO): Promise<Plantao> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
        });
        if (!response.ok) throw new Error("Erro ao atualizar plantão.");
        return response.json();
    },

    // 4. CORRIGIDO: Mapeia o @DeleteMapping("/{id}")
    // URL Final: http://localhost:5004/plantoes/1
    deletar: async (id: number): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar plantão.");
    }
};
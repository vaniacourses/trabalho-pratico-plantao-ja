import type { PlantaoRequestDTO, Plantao } from "../types";

// DEIXE A URL BASE APENAS ATÉ A PORTA:
export const API_BASE_URL = "http://localhost:5004"; // MOCK: json-server
// export const API_BASE_URL = "http://localhost:8080/api/v1"; // FUTURO: API Gateway

export const plantaoService = {
    // 1. ADICIONADO: GET que a sua Dashboard nova está usando para listar!
    // URL Final: http://localhost:5004/plantoes
    getAll: async (): Promise<Plantao[]> => {
        const response = await fetch(`${API_BASE_URL}/plantoes`);
        if (!response.ok) {
            throw new Error("Não foi possível carregar a lista de plantões.");
        }
        return response.json();
    },

    // 2. CORRIGIDO: Mapeia o @PostMapping do seu Controller
    // URL Final: http://localhost:5004/plantoes
    cadastrar: async (dto: PlantaoRequestDTO): Promise<Plantao> => {
        const response = await fetch(`${API_BASE_URL}/plantoes`, {
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

    // 3. CORRIGIDO: Mapeia o @PutMapping("/{id}")
    // URL Final: http://localhost:5004/plantoes/1
    atualizar: async (id: number, dto: PlantaoRequestDTO): Promise<Plantao> => {
        const response = await fetch(`${API_BASE_URL}/plantoes/${id}`, {
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
        const response = await fetch(`${API_BASE_URL}/plantoes/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) throw new Error("Erro ao deletar plantão.");
    }
};
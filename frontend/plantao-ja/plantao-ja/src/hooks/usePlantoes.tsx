import { useState } from "react";
import type { PlantaoRequestDTO, Plantao } from "../types";
import { plantaoService } from "../services/plantaoService";

export const usePlantoes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const criarPlantao = async (dto: PlantaoRequestDTO): Promise<Plantao | null> => {
        setLoading(true);
        setError(null);
        try {
            const novoPlantao = await plantaoService.cadastrar(dto);
            return novoPlantao;
        } catch (err: any) {
            setError(err.message || "Ocorreu um erro ao salvar o plantão.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    return {
        criarPlantao,
        loading,
        error
    };
};
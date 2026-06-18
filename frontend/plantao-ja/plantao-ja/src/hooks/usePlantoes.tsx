import { useState } from "react";
import type { PlantaoRequestDTO, Plantao } from "../types";
import { plantaoService } from "../services/plantaoService";

export const usePlantoes = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // 1. Listar todos os plantões (Usado na Dashboard do Médico)
    const listarTodosPlantoes = async (): Promise<Plantao[]> => {
        setLoading(true);
        setError(null);
        try {
            return await plantaoService.getAll();
        } catch (err: any) {
            setError(err.message || "Erro ao carregar os plantões.");
            return [];
        } finally {
            setLoading(false);
        }
    };

    // 2. Listar plantões filtrados por Hospital (Usado no Painel do Gestor)
    const listarPlantoesPorHospital = async (hospitalId: string): Promise<Plantao[]> => {
        setLoading(true);
        setError(null);
        try {
            return await plantaoService.getByHospitalId(hospitalId);
        } catch (err: any) {
            setError(err.message || "Erro ao carregar os plantões do hospital.");
            return [];
        } finally {
            setLoading(false);
        }
    };

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

    const inscreverMedico = async (plantaoId: number, hospitalId: string) => {
        setLoading(true);
        setError(null);
        try{
            const plantaoInscrito = await plantaoService.inscreverMedico(plantaoId, hospitalId);
            return plantaoInscrito
        } catch(e:any) {
            setError(e.message || "Erro na inscrição de médico no plantão.")
            return null
        }finally {
            setLoading(false);
        }
    }

// 5. ADICIONADO: Gestor aceita candidatura de um médico
    const aceitarMedico = async (plantaoId: number, medicoId: number, gestorId: number): Promise<Plantao | null> => {
        setLoading(true);
        setError(null);
        try {
            const plantaoAtualizado = await plantaoService.aceitarMedico(plantaoId, medicoId, gestorId);
            return plantaoAtualizado;
        } catch (err: any) {
            setError(err.message || "Erro ao aprovar o médico para este plantão.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    // 6. ADICIONADO: Mudar status dinamicamente (ABERTO, FECHADO, ATIVO, INATIVO)
    const alterarStatusPlantao = async (plantaoId: number, novoStatus: "ABERTO" | "FECHADO" | "ATIVO" | "INATIVO"): Promise<Plantao | null> => {
        setLoading(true);
        setError(null);
        try {
            return await plantaoService.alterarStatus(plantaoId, novoStatus);
        } catch (err: any) {
            setError(err.message || "Erro ao atualizar status da vaga.");
            return null;
        } finally {
            setLoading(false);
        }
    };

    const deletarPlantao = async (plantaoId: number) => {
        setLoading(true);
        setError(null);
        try {
            await plantaoService.deletar(plantaoId)
        } catch(e: any){
            setError(e.message || "Não conseguiu deletar plantão.")
            return false;
        } finally {
            setLoading(false);
        }
    };

    return {
        listarTodosPlantoes,
        listarPlantoesPorHospital,
        criarPlantao,
        inscreverMedico,
        aceitarMedico,
        alterarStatusPlantao,
        deletarPlantao,
        loading,
        error
    };
};
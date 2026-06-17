import { useState, useEffect } from "react";
import type { Hospital, HospitalPayload, LoadingState } from "../types";
import { hospitalService } from "../services/hospitalService";

interface UseHospitaisReturn {
  hospitais: Hospital[];
  loading: LoadingState;
  error: string | null;
  totalPages: number;
  page: number;
  setPage: (p: number) => void;
  criarHospital: (payload: HospitalPayload) => Promise<void>;
  editarHospital: (id: string, payload: HospitalPayload) => Promise<void>;
  deletarHospital: (id: string) => Promise<void>;
  refetch: () => void;
}

export function useHospitais(): UseHospitaisReturn {
  const [hospitais, setHospitais] = useState<Hospital[]>([]);
  const [loading, setLoading]     = useState<LoadingState>("idle");
  const [error, setError]         = useState<string | null>(null);
  const [page, setPage]           = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchHospitais = async () => {
  setLoading("loading");
  try {
      const data = await hospitalService.getAll(page);
      setTotalPages(data.totalPages);
      setHospitais(data.content); // ← aqui está a diferença
      setLoading("success");
  }
  catch (e){
    setError("Não foi possível carregar hospitais.")
    setLoading("error")
  }
};

  useEffect(() => { fetchHospitais(); }, [page]);

  const criarHospital = async (payload: HospitalPayload) => {
    await hospitalService.create(payload);
    // Recarrega a lista para manter a ordenação do backend
    await fetchHospitais();
  };

  const editarHospital = async (id: string, payload: HospitalPayload) => {
    const atualizado = await hospitalService.update(id, payload);
    setHospitais(prev => prev.map(h => h.id === id ? atualizado : h));
  };

  const deletarHospital = async (id: string) => {
    await hospitalService.delete(id);
    setHospitais(prev => prev.filter(h => h.id !== id));
  };

  return {
    hospitais,
    loading,
    error,
    totalPages,
    page,
    setPage,
    criarHospital,
    editarHospital,
    deletarHospital,
    refetch: fetchHospitais,
  };
}


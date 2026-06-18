import type { HospitalPayload, SpringPage, Hospital } from "../types";

// Aponta para a raiz do recurso hospitais no json-server
const BASE_URL = "http://localhost:8080/hospital"; 

export const hospitalService = {
  // 1. GET: Retorna o objeto envelopado exatamente como está no JSON
  getAll: async (page = 0, size = 10): Promise<SpringPage<Hospital>> => {
    const res = await fetch(`${BASE_URL}?page=${page}&size=${size}`);
    if (!res.ok) throw new Error("Erro ao buscar hospitais");
    return res.json(); 
  },

  // 2. CREATE: Faz a mágica de ler a estrutura atual, injetar o novo registro e atualizar o bloco
  create: async (payload: HospitalPayload): Promise<Hospital> => {
    // Passo A: Busca o estado atual do objeto envelopado
    const res = await fetch(BASE_URL, {
      method: "POST", 
      headers: { 
        "Content-Type": "application/json" 
      },
      body: JSON.stringify(payload), // Envia apenas { nome, gestorId }
    });
    if (!res.ok) throw new Error("Erro ao ler banco de dados.");
    return res.json();
  },

  // 3. DELETE: Varre o content, remove o alvo e salva o bloco atualizado
  delete: async (hospitalId: string): Promise<void> => {
    const getRes = await fetch(BASE_URL);
    if (!getRes.ok) throw new Error("Erro ao acessar banco de dados para remoção.");
    const estruturaAtual: SpringPage<Hospital> = await getRes.json();

    const novoContent = estruturaAtual.content.filter(h => h.id !== hospitalId);
    
    const novaEstrutura: SpringPage<Hospital> = {
      ...estruturaAtual,
      content: novoContent,
      totalElements: novoContent.length,
      totalPages: Math.ceil(novoContent.length / 10),
    };

    const putRes = await fetch(BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaEstrutura),
    });

    if (!putRes.ok) throw new Error("Erro ao remover o hospital do banco estruturado.");
  },

  // 4. UPDATE: Acha o hospital dentro do content, altera os dados e salva o bloco
  update: async (hospitalId: string, payload: HospitalPayload): Promise<Hospital> => {
    const getRes = await fetch(BASE_URL);
    if (!getRes.ok) throw new Error("Erro ao acessar banco de dados para atualização.");
    const estruturaAtual: SpringPage<Hospital> = await getRes.json();

    let hospitalAtualizado: Hospital | null = null;

    const novoContent = estruturaAtual.content.map(h => {
      if (h.id === hospitalId) {
        hospitalAtualizado = { ...h, ...payload };
        return hospitalAtualizado;
      }
      return h;
    });

    if (!hospitalAtualizado) throw new Error("Hospital não localizado para atualização.");

    const novaEstrutura: SpringPage<Hospital> = {
      ...estruturaAtual,
      content: novoContent
    };

    const putRes = await fetch(BASE_URL, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(novaEstrutura),
    });

    if (!putRes.ok) throw new Error("Erro ao salvar atualização no banco estruturado.");

    return hospitalAtualizado;
  }
};
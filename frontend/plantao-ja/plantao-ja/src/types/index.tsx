// types/index.ts

export interface PlantaoRequestDTO {
    dataInicio: string;    // Formato ISO string para o LocalDateTime do Java (ex: "2026-06-18T07:00:00")
    dataFim: string;       // Formato ISO string
    remuneracao: number;   // Mapeia para o BigDecimal do Java
    status: string;        // Ex: "ABERTO", "FINALIZADO"
    hospitalId: string;    // UUID do hospital que gerou o plantão
}

export interface Plantao extends PlantaoRequestDTO {
    id: number;            // Gerado automaticamente pelo json-server / Banco de Dados
}


export interface Endereco {
  id?: number;
  cep: string;
  rua: string;
  numero: number;
  complemento?: string;
}

export interface Hospital {
  id: string;           // UUID
  nome: string;
  cnpj: string;
  notaMedia: number;
  statusCadastro: string;
  endereco: Endereco;
  gestorId: number;
}

export type HospitalPayload = Omit<Hospital, "id" | "notaMedia">;

// Tipagem da Page do Spring — reutilizável para qualquer entidade
export interface SpringPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;       // página atual (0-based)
  size: number;
}

export type LoadingState = "idle" | "loading" | "success" | "error";
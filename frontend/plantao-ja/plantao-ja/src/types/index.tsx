// types/index.ts

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
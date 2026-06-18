// types/index.ts

export type EspecialidadeMedica = 
    | "CLINICA_GERAL"
    | "PEDIATRIA"
    | "CARDIOLOGIA"
    | "ORTOPEDIA"
    | "ANESTESIOLOGIA"
    | "GINECOLOGIA";

export interface PlantaoRequestDTO {
    dataInicio: string;    // Formato ISO string para o LocalDateTime do Java (ex: "2026-06-18T07:00:00")
    dataFim: string;       // Formato ISO string
    remuneracao: number;   // Mapeia para o BigDecimal do Java
    especialidade: EspecialidadeMedica;        // Ex: "ABERTO", "FINALIZADO"
    hospitalId: string;    // UUID do hospital que gerou o plantão
}

export interface Plantao extends PlantaoRequestDTO {
    id: number;            // Gerado automaticamente pelo json-server / Banco de Dados
    status: "ABERTO" | "FECHADO" | "ATIVO" | "INATIVO"; // Alinhado com o Enum de status do Java
    medicoInscritosIds: number[];   // IDs dos médicos inscritos
    medicoAceitosIds: number[];     // IDs dos médicos aceitos
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

// types/index.ts (Adicionar ao final do arquivo existente)

export type Role = "USER" | "ADMIN" | "MEDICO";

// Resposta do AuthenticationController.login
export interface TokenResponse {
    token: string;
    id: number; // Mapeia o Long ID do banco
    nome: string;
    role: string;
}

// Envio para o endpoint de login
export interface UsuarioLogin {
    email: string;
    senha?: string;
}

// Payload para criar Usuario Base (Mapeia o UsuarioCreate do Java)
export interface UsuarioCreate {
    nome: string;
    email: string;
    senha?: string;
}

// Payload para criar Perfil do Médico (Mapeia o MedicoCreate do Java)
export interface MedicoCreate {
    userId: number;
    crm: string;
    especialidade?: string;
}

// Resposta do cadastro de usuário (Mapeia o InfoUsuario do Java)
export interface InfoUsuario {
    sucesso: boolean;
    erro: boolean;
    mensagem: string;
}
import { useEffect, useState } from "react";

const API_URL = "http://localhost:8082/hospital";

type Hospital = {
  id?: string;
  nome: string;
  cnpj: string;
  notaMedia: number;
  statusCadastro: string;
  gestorId: number;
  endereco: {
    id?: number;
    cep: string;
    rua: string;
    numero: number;
    complemento: string;
  };
};

const nomes = [
  "Hospital Municipal Niteroi",
  "Hospital Sao Lucas",
  "Hospital Santa Maria",
  "Hospital Oceano",
  "Hospital Rio Care",
  "Hospital Plantao Ja",
];

const ruas = [
  "Rua das Flores",
  "Avenida Central",
  "Rua Professor Marcos",
  "Rua da Praia",
  "Avenida Roberto Silveira",
  "Rua Moreira Cesar",
];

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomItem<T>(arr: T[]): T {
  return arr[randomInt(0, arr.length - 1)];
}

const cnpjsValidos = [
  "11.444.777/0001-61",
  "45.723.174/0001-10",
  "71.506.168/0001-11",
  "20.018.183/0001-80",
  "54.550.752/0001-55",
];

function gerarCnpjValido() {
  return randomItem(cnpjsValidos);
}

function gerarCepFake() {
  return `${randomInt(10000, 99999)}-${randomInt(100, 999)}`;
}

function gerarHospitalAleatorio(): Hospital {
  return {
    nome: `${randomItem(nomes)} ${randomInt(1, 99)}`,
    cnpj: gerarCnpjValido(),
    notaMedia: Number((Math.random() * 5).toFixed(1)),
    statusCadastro: "ATIVO",
    gestorId: randomInt(1, 10),
    endereco: {
      cep: gerarCepFake(),
      rua: randomItem(ruas),
      numero: randomInt(1, 999),
      complemento: `Bloco ${String.fromCharCode(65 + randomInt(0, 3))}`,
    },
  };
}

export default function HospitaisTestPage() {
  const [hospitais, setHospitais] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [mensagem, setMensagem] = useState("");

  async function carregarHospitais() {
    setLoading(true);
    setMensagem("");
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setHospitais(data.content ?? []);
    } catch {
      setMensagem("Erro ao carregar hospitais.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    carregarHospitais();
  }, []);

  async function adicionarHospitalAleatorio() {
    const hospital = gerarHospitalAleatorio();
    setMensagem("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hospital),
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        throw new Error(erroTexto || "Falha ao adicionar hospital");
      }

      setMensagem(`Hospital "${hospital.nome}" adicionado com sucesso.`);
      await carregarHospitais();
    } catch (e: any) {
      setMensagem(`Erro ao adicionar hospital: ${e.message}`);
    }
  }

  async function removerHospital(id: string) {
    setMensagem("");

    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const erroTexto = await res.text();
        throw new Error(erroTexto || "Falha ao remover hospital");
      }

      setMensagem("Hospital removido com sucesso.");
      await carregarHospitais();
    } catch (e: any) {
      setMensagem(`Erro ao remover hospital: ${e.message}`);
    }
  }

  async function adicionarTresHospitais() {
    try {
      for (let i = 0; i < 3; i++) {
        const hospital = gerarHospitalAleatorio();
        await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hospital),
        });
      }

      setMensagem("3 hospitais aleatórios enviados.");
      await carregarHospitais();
    } catch {
      setMensagem("Erro ao adicionar os 3 hospitais.");
    }
  }

  return (
    <div style={{ padding: 24, fontFamily: "Arial, sans-serif" }}>
      <h1>Teste CRUD de Hospitais</h1>

      <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
        <button onClick={carregarHospitais}>Atualizar lista</button>
        <button onClick={adicionarHospitalAleatorio}>Adicionar hospital aleatório</button>
        <button onClick={adicionarTresHospitais}>Adicionar 3 aleatórios</button>
      </div>

      {mensagem && <p>{mensagem}</p>}
      {loading && <p>Carregando...</p>}

      <h2>Hospitais cadastrados</h2>

      {hospitais.length === 0 ? (
        <p>Nenhum hospital cadastrado.</p>
      ) : (
        <div style={{ display: "grid", gap: 12 }}>
          {hospitais.map((hospital) => (
            <div
              key={hospital.id}
              style={{
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 12,
              }}
            >
              <strong>{hospital.nome}</strong>
              <p>CNPJ: {hospital.cnpj}</p>
              <p>Nota média: {hospital.notaMedia}</p>
              <p>Status: {hospital.statusCadastro}</p>
              <p>Gestor ID: {hospital.gestorId}</p>
              <p>
                Endereço: {hospital.endereco?.rua}, {hospital.endereco?.numero} - {hospital.endereco?.cep}
              </p>
              <p>Complemento: {hospital.endereco?.complemento}</p>

              <button onClick={() => hospital.id && removerHospital(hospital.id)}>
                Apagar
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
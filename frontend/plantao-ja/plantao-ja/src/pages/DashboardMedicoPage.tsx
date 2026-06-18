import React, { useState, useEffect } from 'react';
import { plantaoService } from '../services/plantaoService';
import { hospitalService } from '../services/hospitalService';
import type { Plantao, Hospital, LoadingState } from '../types';
import './DashboardMedicoPage.css';

const DashboardMedicoPage: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    // Estados para carregar os dados reais das APIs via hooks/services
    const [plantoes, setPlantoes] = useState<Plantao[]>([]);
    const [hospitais, setHospitais] = useState<Hospital[]>([]);
    const [loading, setLoading] = useState<LoadingState>("idle");
    const [error, setError] = useState<string | null>(null);
    
    // Estado para gerenciar as inscrições locais feitas pelo médico
    const [inscricoes, setInscricoes] = useState<number[]>([]);
    

    // Carrega os dados de ambos os microserviços de forma assíncrona
    useEffect(() => {
        const carregarDadosDoSistema = async () => {
            setLoading("loading");
            setError(null);
            try {
                const [dadosPlantoes, respostaHospitais] = await Promise.all([
                    plantaoService.getAll(),
                    hospitalService.getAll()
                ]);

                setPlantoes(dadosPlantoes || []);
                // Extrai a lista de dentro do envelope do SpringPage (.content)
                setHospitais(respostaHospitais?.content || []);
                setLoading("success");
            } catch (err: any) {
                setError("Erro ao sincronizar banco de dados de oportunidades.");
                setLoading("error");
            }
        };

        carregarDadosDoSistema();
    }, []);

    // Helper: Varre a lista de hospitais para encontrar o Nome Real correspondente ao UUID
    const obterNomeHospital = (hospitalId: string): string => {
        const encontrado = hospitais.find(h => h.id === hospitalId);
        return encontrado ? encontrado.nome : "Hospital Geral Parceiro";
    };

    // Helper: Formata LocalDateTime do Java ("2026-06-18T07:00:00") para o padrão brasileiro
    const formatarDataHora = (isoString: string): { data: string; hora: string } => {
        try {
            const dataObjeto = new Date(isoString);
            if (isNaN(dataObjeto.getTime())) return { data: isoString, hora: "" };
            return {
                data: dataObjeto.toLocaleDateString('pt-BR'),
                hora: dataObjeto.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
            };
        } catch {
            return { data: isoString, hora: "" };
        }
    };

    // 💡 CORRIGIDO: Agora a candidatura bate na rota PATCH do plantao-service via Gateway
    const handleCandidatar = async (plantaoId: number) => {
        // Pegamos o ID do médico logado direto do objeto guardado no Login
        const medicoId = user.id; 

        if (!medicoId) {
            alert("Erro: Usuário não identificado. Faça login novamente.");
            return;
        }

        try {
            // Dispara a chamada PATCH para: http://localhost:8080/plantoes/{plantaoId}/inscrever?medicoId={medicoId}
            const plantaoAtualizado = await plantaoService.inscreverMedico(plantaoId, medicoId.toString());
            
            // Atualiza a lista local de inscrições com o ID do plantão retornado
            setInscricoes(prev => [...prev, plantaoId]);
            
            // Opcional: Atualiza o estado de plantões para refletir o médico na lista imediatamente
            setPlantoes(prev => prev.map(p => p.id === plantaoId ? plantaoAtualizado : p));

            alert("Inscrição realizada com sucesso! O gestor do hospital já consegue ver você na lista de candidatos.");
        } catch (err: any) {
            alert(err.message || "Erro ao realizar inscrição no servidor.");
        }
    };

    // Filtra apenas para garantir que o médico veja vagas com status aberto
    const plantoesDisponiveis = plantoes.filter(plantao => {
        return plantao.status === "ABERTO" || plantao.status === "ATIVO";
    });

    return (
        <div className="med-dashboard-container">
            {/* Header da Dashboard do Médico */}
            <header className="med-dashboard-header">
                <div className="med-header-info">
                    <h1>Olá, Dr(a). {user.nome || "Médico"}</h1>
                    <span className="med-badge">CRM Ativo</span>
                </div>
                <p className="med-header-subtitle">Encontre e candidate-se a plantões disponíveis na rede.</p>
            </header>

            {/* Listagem de Plantões Reais de acordo com o Banco */}
            <section className="plantoes-section">
                <h2>📅 Vagas Disponíveis ({plantoesDisponiveis.length})</h2>
                
                {loading === "loading" && <p className="loading-text">Sincronizando escalas com o barramento...</p>}
                {error && <p className="error-text">{error}</p>}
                
                {loading === "success" && plantoesDisponiveis.length === 0 ? (
                    <div className="no-results">
                        <p>Nenhum plantão ativo disponível no momento.</p>
                    </div>
                ) : (
                    <div className="plantoes-grid">
                        {plantoesDisponiveis.map((plantao) => {
                                                    
                            // 💡 INTEGRADO COM O BACKEND: 
                            // Ele estará desabilitado se o médico acabou de clicar OU se o ID dele já consta na lista vinda do MySQL
                            const jaInscrito = inscricoes.includes(plantao.id) || plantao.medicoInscritosIds?.includes(Number(user.id));
                            
                            const nomeHospital = obterNomeHospital(plantao.hospitalId);
                            const inicio = formatarDataHora(plantao.dataInicio);
                            const fim = formatarDataHora(plantao.dataFim);

                            return (
                                <div key={plantao.id} className={`plantao-card ${jaInscrito ? 'card-disabled' : ''}`}>
                                    <div className="plantao-card-header">
                                        <span className="spec-badge">Oportunidade</span>
                                        <span className="price-tag">
                                            {plantao.remuneracao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                        </span>
                                    </div>
                                    
                                    <div className="plantao-card-body">
                                        <h3>{nomeHospital}</h3>
                                        <p className="location">🏥 Unidade Hospitalar Conveniada</p>
                                        
                                        <div className="time-info">
                                            <p>📆 <strong>Data:</strong> {inicio.data}</p>
                                            <p>⏰ <strong>Horário:</strong> {inicio.hora} até {fim.hora}</p>
                                        </div>
                                    </div>   
                                    <div className="plantao-card-footer">
                                        <button 
                                            onClick={() => handleCandidatar(plantao.id)}
                                            className={`btn-action ${jaInscrito ? 'btn-success' : 'btn-apply'}`}
                                            disabled={jaInscrito}
                                        >
                                            {jaInscrito ? "✓ Aguardando Gestor" : "Candidatar-se ao Plantão"}
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </section>
        </div>
    );
};

export default DashboardMedicoPage;
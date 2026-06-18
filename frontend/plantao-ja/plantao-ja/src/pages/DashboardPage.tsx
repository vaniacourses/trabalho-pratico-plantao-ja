import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHospitais } from '../hooks/useHospitals';
import { plantaoService } from '../services/plantaoService'; // Voltamos para o service para chamadas assíncronas dentro do useEffect
import type { Plantao, Hospital, LoadingState } from '../types';
import './DashboardPage.css'; 

const DashboardPage = () => {
    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    // 1. Dados reais dos Hospitais vindos do Hook existente
    const { hospitais = [], loading: hospitaisLoading, error: hospitaisError } = useHospitais() as {
        hospitais: Hospital[];
        loading: LoadingState;
        error: string | null;
    };

    // 2. Estados para gerenciar os Plantões reais
    const [plantoes, setPlantoes] = useState<Plantao[]>([]);
    const [plantoesLoading, setPlantoesLoading] = useState<LoadingState>("idle");
    const [plantoesError, setPlantoesError] = useState<string | null>(null);

    // 3. CORRIGIDO: useEffect correto que escuta a carga dos hospitais do gestor
    useEffect(() => {
        const buscarPlantoesDosHospitais = async () => {
            // Só dispara a busca se os hospitais já tiverem carregado com sucesso
            if (hospitaisLoading !== "success" || hospitais.length === 0) return;

            setPlantoesLoading("loading");
            try {
                // Faz requisições em paralelo para cada hospital que o gestor possui
                const promessas = hospitais.map(hospital => 
                    plantaoService.getByHospitalId(hospital.id)
                );
                
                // Aguarda o retorno de todas as listas: [[plantao1], [plantao2]]
                const resultados = await Promise.all(promessas);
                
                // Achata os arrays em uma única lista de plantões
                const todosPlantoes = resultados.flat();
                
                setPlantoes(todosPlantoes || []);
                setPlantoesLoading("success");
            } catch (err: any) {
                setPlantoesError("Não foi possível sincronizar a escala de plantões.");
                setPlantoesLoading("error");
            }
        };

        buscarPlantoesDosHospitais();
    }, [hospitais, hospitaisLoading]); // Executa a lógica assim que os hospitais terminam de carregar

    // Helper: Cruza o hospitalId do Plantão com a lista de Hospitais para descobrir o Nome Real
    const obterNomeHospital = (hospitalId: string): string => {
        const encontrado = hospitais.find(h => h.id === hospitalId);
        return encontrado ? encontrado.nome : "Hospital não identificado";
    };

    // Helper: Formata a string LocalDateTime ("2026-06-18T07:00:00") para exibição amigável brasileira
    const formatarDataHora = (isoString: string): { data: string; hora: string } => {
        try {
            const dataObjeto = new Date(isoString);
            if (isNaN(dataObjeto.getTime())) return { data: isoString, hora: "" };
            
            const data = dataObjeto.toLocaleDateString('pt-BR');
            const hora = dataObjeto.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            return { data, hora };
        } catch {
            return { data: isoString, hora: "" };
        }
    };

    // Filtros dinâmicos baseados no 'status' real mapeado no JSON / Spring Boot
    const plantoesAtivosReais = plantoes.filter(p => p.status === "ABERTO" || p.status === "ATIVO");
    const historicoPlantoesReais = plantoes.filter(p => p.status !== "ABERTO" && p.status !== "ATIVO");

    return (
        <div className="dashboard-container">
            {/* Header com dados do Gestor e as Ações de Navegação */}
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>Olá, Dr(a). {user.nome || "Gestor"}</h1>
                    <p className="badge-role">Painel do Gestor</p>
                </div>
                <div className="header-actions">
                    <Link to="/signin-hospital" className="btn-dash btn-secondary-dash">
                        🏥 Cadastrar Hospital
                    </Link>
                    <Link to="/cadastrar-plantao" className="btn-dash btn-primary-dash">
                        📅 Novo Plantão
                    </Link>
                </div>
            </header>

            <main className="dashboard-grid">
                {/* Coluna Principal: Hospitais e Plantões Ativos Reais */}
                <section className="main-content">
                    
                    {/* Seção de Hospitais Cadastrados (Dados Reais) */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Meus Hospitais Cadastrados</h2>
                        </div>
                        <div className="card-body">
                            {hospitaisLoading === "loading" && <p className="loading-text">A carregar hospitais...</p>}
                            {hospitaisError && <p className="error-text">{hospitaisError}</p>}
                            
                            {hospitaisLoading === "success" && hospitais.length === 0 && (
                                <p className="empty-text">Nenhum hospital cadastrado ainda.</p>
                            )}
                            
                            {hospitais.length > 0 && (
                                <div className="hospitals-list">
                                    {hospitais.map(hospital => (
                                        <div key={hospital.id} className="hospital-item">
                                            <div>
                                                <h3>{hospital.nome}</h3>
                                                <span className="hospital-cnpj">CNPJ: {hospital.cnpj || "Não informado"}</span>
                                            </div>
                                            <span className={`status-badge ${hospital.statusCadastro?.toLowerCase() === 'ativo' ? 'active' : 'inactive'}`}>
                                                {hospital.statusCadastro || "Pendente"}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Seção de Plantões Ativos Reais */}
                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>⚡ Plantões Ativos em Captação</h2>
                        </div>
                        <div className="card-body">
                            {plantoesLoading === "loading" && <p className="loading-text">A carregar plantões do servidor...</p>}
                            {plantoesError && <p className="error-text">{plantoesError}</p>}
                            
                            {plantoesLoading === "success" && plantoesAtivosReais.length === 0 && (
                                <p className="empty-text">Não há plantões ativos publicados no momento para os seus hospitais.</p>
                            )}

                            {plantoesAtivosReais.length > 0 && (
                                <div className="shifts-list">
                                    {plantoesAtivosReais.map(plantao => {
                                        const inicioFormatado = formatarDataHora(plantao.dataInicio);
                                        const fimFormatado = formatarDataHora(plantao.dataFim);
                                        
                                        return (
                                            <div key={plantao.id} className="shift-item">
                                                <div className="shift-info">
                                                    {/* Tornando a especialidade dinâmica de acordo com o enum retornado do Java */}
                                                    <span className="shift-specialty">
                                                        {plantao.especialidade ? plantao.especialidade.replace('_', ' ') : "Plantão Geral"}
                                                    </span>
                                                    <span className="shift-hospital">
                                                        📍 {obterNomeHospital(plantao.hospitalId)}
                                                    </span>
                                                </div>
                                                <div className="shift-datetime">
                                                    <span>{inicioFormatado.data}</span>
                                                    <small>{inicioFormatado.hora} até {fimFormatado.hora}</small>
                                                </div>
                                                <div className="shift-price">
                                                    {plantao.remuneracao.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* Coluna Lateral: Histórico de Plantões Inativos Reais */}
                <aside className="sidebar-content">
                    <div className="dashboard-card sticky-card">
                        <div className="card-header">
                            <h2>📜 Histórico de Plantões (Inativos)</h2>
                        </div>
                        <div className="card-body">
                            {plantoesLoading === "loading" && <p className="loading-text">A carregar histórico...</p>}
                            
                            {plantoesLoading === "success" && historicoPlantoesReais.length === 0 && (
                                <p className="empty-text">Nenhum plantão arquivado.</p>
                            )}

                            {historicoPlantoesReais.length > 0 && (
                                <div className="history-list">
                                    {historicoPlantoesReais.map(historico => {
                                        const inicio = formatarDataHora(historico.dataInicio);
                                        return (
                                            <div key={historico.id} className="history-item">
                                                <div>
                                                    <h4>{obterNomeHospital(historico.hospitalId)}</h4>
                                                    <small>{inicio.data}</small>
                                                </div>
                                                <span className={`history-status ${historico.status.toLowerCase() === 'concluido' ? 'done' : 'canceled'}`}>
                                                    {historico.status}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </aside>
            </main>
        </div>
    );
};

export default DashboardPage;
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useHospitais } from '../hooks/useHospitals';
import { plantaoService } from '../services/plantaoService';
import type { Plantao, Hospital, LoadingState } from '../types';
import './DashboardPage.css';
import { medicoService } from '../services/medicoService';
import type { MedicoResponse } from '../services/medicoService';

const DashboardPage = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    const [medicos, setMedicos] = useState<MedicoResponse[]>([]);

    useEffect(() => {
        medicoService.getAll().then(setMedicos).catch(() => {});
    }, []);

    const obterMedico = (medicoId: number) => {
        return medicos.find(m => Number(m.userId) === Number(medicoId));
    };

    const { hospitais = [], loading: hospitaisLoading, error: hospitaisError } = useHospitais() as {
        hospitais: Hospital[];
        loading: LoadingState;
        error: string | null;
    };

    // Só os hospitais que pertencem ao gestor logado
    const meusHospitais = hospitais.filter(h => Number(h.gestorId) === Number(user.id));

    const [plantoes, setPlantoes] = useState<Plantao[]>([]);
    const [plantoesLoading, setPlantoesLoading] = useState<LoadingState>("idle");
    const [plantoesError, setPlantoesError] = useState<string | null>(null);

    const buscarPlantoesDosHospitais = async () => {
        if (hospitaisLoading !== "success" || meusHospitais.length === 0) return;

        setPlantoesLoading("loading");
        try {
            const promessas = meusHospitais.map(hospital =>
                plantaoService.getByHospitalId(hospital.id)
            );
            const resultados = await Promise.all(promessas);
            const todosPlantoes = resultados.flat();

            setPlantoes(todosPlantoes || []);
            setPlantoesLoading("success");
        } catch (err: any) {
            setPlantoesError("Não foi possível sincronizar a escala de plantões.");
            setPlantoesLoading("error");
        }
    };

    useEffect(() => {
        buscarPlantoesDosHospitais();
    }, [hospitaisLoading]);

    const obterNomeHospital = (hospitalId: string): string => {
        const encontrado = meusHospitais.find(h => h.id === hospitalId);
        return encontrado ? encontrado.nome : "Hospital não identificado";
    };

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

    const handleAceitar = async (plantaoId: number, medicoId: number) => {
        try {
            const plantaoAtualizado = await plantaoService.aceitarMedico(plantaoId, medicoId, user.id);
            setPlantoes(prev => prev.map(p => p.id === plantaoId ? plantaoAtualizado : p));
        } catch (err: any) {
            alert(err.message || "Erro ao aceitar médico.");
        }
    };

    const plantoesAtivosReais = plantoes.filter(p => p.status === "ABERTO" || p.status === "ATIVO");
    const historicoPlantoesReais = plantoes.filter(p => p.status !== "ABERTO" && p.status !== "ATIVO");

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-info">
                    <h1>Olá, {user.nome || "Gestor"}</h1>
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
                <section className="main-content">

                    <div className="dashboard-card">
                        <div className="card-header">
                            <h2>Meus Hospitais Cadastrados</h2>
                        </div>
                        <div className="card-body">
                            {hospitaisLoading === "loading" && <p className="loading-text">A carregar hospitais...</p>}
                            {hospitaisError && <p className="error-text">{hospitaisError}</p>}

                            {hospitaisLoading === "success" && meusHospitais.length === 0 && (
                                <p className="empty-text">Nenhum hospital cadastrado ainda.</p>
                            )}

                            {meusHospitais.length > 0 && (
                                <div className="hospitals-list">
                                    {meusHospitais.map(hospital => (
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
                                        const inscritos = plantao.medicoInscritosIds || [];
                                        const aceitos = plantao.medicoAceitosIds || [];

                                        return (
                                            <div key={plantao.id} className="shift-item-wrapper">
                                                <div className="shift-item">
                                                    <div className="shift-info">
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

                                                {inscritos.length > 0 && (
                                                    <div className="candidatos-box">
                                                        <p className="candidatos-title">Médicos inscritos (aguardando aprovação):</p>
                                                        {inscritos.map(medicoId => {
                                                            const medico = obterMedico(medicoId);
                                                            return (
                                                                <div key={medicoId} className="candidato-item">
                                                                    <div>
                                                                        <strong>{medico?.nomeUsuario || `Médico #${medicoId}`}</strong>
                                                                        <br />
                                                                        <small>{medico?.especialidade || 'Clínica Geral'} · CRM {medico?.crm || 'Não Informado'}</small>
                                                                    </div>
                                                                    <button className="btn-aceitar" onClick={() => handleAceitar(plantao.id, medicoId)}>
                                                                        Aceitar
                                                                    </button>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                )}

                                                {aceitos.length > 0 && (
                                                    <div className="aceitos-box">
                                                        <p className="aceitos-title">Médicos confirmados:</p>
                                                        <div className="aceitos-badges-list">
                                                            {aceitos.map(medicoId => {
                                                                const medicoConfirmado = obterMedico(medicoId);
                                                                return (
                                                                    <span key={medicoId} className="aceito-badge">
                                                                        ✓ {medicoConfirmado?.nomeUsuario || `Médico #${medicoId}`} (CRM: {medicoConfirmado?.crm || 'S/N'})
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    </div>
                </section>

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
import React, { useState } from 'react';
import './DashboardMedicoPage.css';

interface Plantao {
    id: number;
    hospital: string;
    especialidade: string;
    cidade: string;
    estado: string;
    data: string;
    horario: string;
    valor: string;
}

const DashboardMedicoPage: React.FC = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    // Mock de plantões disponíveis cadastrados pelos gestores
    const [plantoes, setPlantoes] = useState<Plantao[]>([
        { id: 1, hospital: "Hospital Central de Niterói", especialidade: "Pediatria", cidade: "Niterói", estado: "RJ", data: "19/06/2026", horario: "07:00 - 19:00", valor: "R$ 1.200,00" },
        { id: 2, hospital: "UPA Zona Sul", especialidade: "Clínica Geral", cidade: "Niterói", estado: "RJ", data: "20/06/2026", horario: "19:00 - 07:00", valor: "R$ 1.400,00" },
        { id: 3, hospital: "Hospital Barra D'Or", especialidade: "Cardiologia", cidade: "Rio de Janeiro", estado: "RJ", data: "21/06/2026", horario: "08:00 - 20:00", valor: "R$ 1.800,00" },
        { id: 4, hospital: "Hospital Copa Star", especialidade: "Clínica Geral", cidade: "Rio de Janeiro", estado: "RJ", data: "22/06/2026", horario: "07:00 - 19:00", valor: "R$ 1.500,00" },
        { id: 5, hospital: "Santa Casa", especialidade: "Ortopedia", cidade: "São Gonçalo", estado: "RJ", data: "25/06/2026", horario: "19:00 - 07:00", valor: "R$ 1.600,00" },
    ]);

    // Estados de controle dos Filtros
    const [filtroEspecialidade, setFiltroEspecialidade] = useState("");
    const [filtroCidade, setFiltroCidade] = useState("");
    const [inscricoes, setInscricoes] = useState<number[]>([]);

    // Ação de Candidatar-se / Aceitar Vaga (Envia para aprovação do gestor)
    const handleCandidatar = (id: number) => {
        if (inscricoes.includes(id)) return;
        setInscricoes([...inscricoes, id]);
        alert("Inscrição realizada com sucesso! O gestor do hospital será notificado para aprovação.");
    };

    // Filtragem em tempo real
    const plantoesFiltrados = plantoes.filter(plantao => {
        const matchesEspecialidade = filtroEspecialidade === "" || plantao.especialidade === filtroEspecialidade;
        const matchesCidade = filtroCidade === "" || plantao.cidade.toLowerCase().includes(filtroCidade.toLowerCase());
        return matchesEspecialidade && matchesCidade;
    });

    return (
        <div className="med-dashboard-container">
            {/* Header da Dashboard do Médico */}
            <header className="med-dashboard-header">
                <div className="med-header-info">
                    <h1>Olá, Dr(a). {user.nome || "Médico"}</h1>
                    <span className="med-badge">CRM Ativo</span>
                </div>
                <p className="med-header-subtitle">Encontre e candidate-se a plantões disponíveis na sua região.</p>
            </header>

            {/* Seção de Filtros de Busca */}
            <section className="search-filter-card">
                <h2>🔍 Filtrar Oportunidades</h2>
                <div className="filter-form-row">
                    <div className="filter-group">
                        <label>Especialidade</label>
                        <select 
                            value={filtroEspecialidade} 
                            onChange={(e) => setFiltroEspecialidade(e.target.value)}
                        >
                            <option value="">Todas as Especialidades</option>
                            <option value="Clínica Geral">Clínica Geral</option>
                            <option value="Pediatria">Pediatria</option>
                            <option value="Cardiologia">Cardiologia</option>
                            <option value="Ortopedia">Ortopedia</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Cidade / Localização</label>
                        <input 
                            type="text" 
                            placeholder="Ex: Niterói" 
                            value={filtroCidade}
                            onChange={(e) => setFiltroCidade(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Listagem de Plantões */}
            <section className="plantoes-section">
                <h2>📅 Vagas Disponíveis ({plantoesFiltrados.length})</h2>
                
                {plantoesFiltrados.length === 0 ? (
                    <div className="no-results">
                        <p>Nenhum plantão encontrado para os filtros selecionados.</p>
                    </div>
                ) : (
                    <div className="plantoes-grid">
                        {plantoesFiltrados.map((plantao) => {
                            const jaInscrito = inscricoes.includes(plantao.id);
                            return (
                                <div key={plantao.id} className={`plantao-card ${jaInscrito ? 'card-disabled' : ''}`}>
                                    <div className="plantao-card-header">
                                        <span className="spec-badge">{plantao.especialidade}</span>
                                        <span className="price-tag">{plantao.valor}</span>
                                    </div>
                                    
                                    <div className="plantao-card-body">
                                        <h3>{plantao.hospital}</h3>
                                        <p className="location">📍 {plantao.cidade} - {plantao.estado}</p>
                                        
                                        <div className="time-info">
                                            <p>📆 <strong>Data:</strong> {plantao.data}</p>
                                            <p>⏰ <strong>Horário:</strong> {plantao.horario}</p>
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
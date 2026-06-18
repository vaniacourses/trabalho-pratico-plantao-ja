import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { usePlantoes } from "../hooks/usePlantoes";
import { useHospitais } from "../hooks/useHospitals"; 
import "./CadastrarPlantaoPage.css"; 

const CadastrarPlantaoPage: React.FC = () => {
    const navigate = useNavigate();
    const { criarPlantao, loading, error } = usePlantoes();
    const { hospitais } = useHospitais(); 

    // Estados locais do formulário
    const [hospitalSelecionado, setHospitalSelecionado] = useState("");
    const [dataInicio, setDataInicio] = useState("");
    const [dataFim, setDataFim] = useState("");
    const [remuneracao, setRemuneracao] = useState("");
    const [especialidade, setEspecialidade] = useState(""); 
    const [sucesso, setSucesso] = useState(false);


    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        if (!hospitalSelecionado) {
            alert("Por favor, selecione um hospital.");
            return;
        }

        // DTO idêntico ao "PlantaoRequestDTO" esperado pelo seu controller Java
        const dto = {
            dataInicio: dataInicio, // Formato string ISO capturado pelo datetime-local
            dataFim: dataFim,
            remuneracao: Number(remuneracao), // Converte para número (BigDecimal no Java)
            especialidade: especialidade as any, // Ou: especialidade as EspecialidadeMedica
            hospitalId: hospitalSelecionado // UUID do hospital selecionado
        };

        const resultado = await criarPlantao(dto);
        if (resultado) {
            setSucesso(true);
        }
    };

    return (
        <div className="cadastro-plantao-container">
            <div className="cadastro-plantao-card">
                <header className="cadastro-plantao-header">
                    <h1>📅 Publicar Novo Plantão</h1>
                    <p>Preencha os dados abaixo para disponibilizar a vaga na rede de médicos.</p>
                </header>

                {error && <div className="error-alert-box">{error}</div>}

                {!sucesso ? (
                    <form onSubmit={handleSubmit} className="cadastro-plantao-form">
                        
                        {/* Seleção de Hospital Vinculado ao Gestor */}
                        <div className="plantao-form-group">
                            <label htmlFor="hospital">Hospital da Escala</label>
                            <select
                                id="hospital"
                                value={hospitalSelecionado}
                                onChange={(e) => setHospitalSelecionado(e.target.value)}
                                required
                            >
                                <option value="">Selecione o hospital cadastrado...</option>
                                {hospitais.map((h) => (
                                    <option key={h.id} value={h.id}>
                                        {h.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Bloco de Valor/Remuneração */}
                        <div className="plantao-form-group">
                            <label htmlFor="remuneracao">Remuneração Oferecida (R$)</label>
                            <div className="input-with-prefix">
                                <span className="currency-prefix">R$</span>
                                <input
                                    type="number"
                                    id="remuneracao"
                                    placeholder="Ex: 1500"
                                    min="0"
                                    step="0.01"
                                    value={remuneracao}
                                    onChange={(e) => setRemuneracao(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="plantao-form-group">
                            <label htmlFor="especialidade">Especialidade Exigida</label>
                            <select
                                id="especialidade"
                                value={especialidade}
                                onChange={(e) => setEspecialidade(e.target.value)}
                                required
                            >
                                <option value="">Selecione a especialidade do plantão...</option>
                                <option value="CLINICA_GERAL">Clínica Geral</option>
                                <option value="PEDIATRIA">Pediatria</option>
                                <option value="CARDIOLOGIA">Cardiologia</option>
                                <option value="ORTOPEDIA">Ortopedia</option>
                                <option value="ANESTESIOLOGIA">Anestesiologia</option>
                                <option value="GINECOLOGIA">Ginecologia</option>
                            </select>
                        </div>

                        {/* Datas de Início e Término em Grid Lado a Lado */}
                        <div className="plantao-form-row">
                            <div className="plantao-form-group split-60">
                                <label htmlFor="dataInicio">Data e Hora de Início</label>
                                <input
                                    type="datetime-local"
                                    id="dataInicio"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="plantao-form-group split-40">
                                <label htmlFor="dataFim">Previsão de Término</label>
                                <input
                                    type="datetime-local"
                                    id="dataFim"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        {/* Ações do Formulário */}
                        <div className="plantao-form-actions">
                            <Link to="/dashboard" className="btn-plantao-cancel">
                                Cancelar
                            </Link>
                            <button type="submit" className="btn-plantao-submit" disabled={loading}>
                                {loading ? "Processando..." : "Publicar Plantão"}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="cadastro-plantao-success">
                        <div className="success-icon-circle">✓</div>
                        <h2>Plantão Publicado!</h2>
                        <p>A oferta foi salva com sucesso no barramento na porta 5004 e está pronta para receber candidaturas médicos de plantão.</p>
                        
                        <div className="success-actions">
                            <Link to="/dashboard" className="btn-plantao-submit text-center">
                                Voltar para o Painel Geral
                            </Link>
                            <button onClick={() => setSucesso(false)} className="btn-plantao-link">
                                Cadastrar outro plantão
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CadastrarPlantaoPage;
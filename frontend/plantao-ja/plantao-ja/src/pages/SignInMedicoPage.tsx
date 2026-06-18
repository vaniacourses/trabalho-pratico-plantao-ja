import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // 💡 CORRIGIDO: Import do Hook correto de navegação
import { usuarioService } from "../services/usuarioService";
import './SignInMedicoPage.css';

interface SignInMedicoPageProps {
    title?: string;
}

const SignInMedicoPage: React.FC<SignInMedicoPageProps> = ({ title = "Cadastro de Médico" }) => {
    
    // Hook para redirecionar o usuário após o cadastro
    const navigate = useNavigate(); 

    // 1. Definição dos estados sincronizados com o formulário
    const [nome, setNome] = useState(""); 
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState(""); // 💡 Alinhado para 'senha' para casar com o Java
    const [crm, setCrm] = useState("");     // Lembre-se de adicionar o input de CRM no HTML se for obrigatório no seu Java
    const [especialidade, setEspecialidade] = useState("");

    // 💡 CORRIGIDO: O tipo correto do evento de submit no React é React.FormEvent
    const handleSubmit = async (e: React.FormEvent) => { 
        e.preventDefault();
        try {
            // CHAMADA REAL PARA O JAVA VIA GATEWAY:
            // Enviamos o objeto completo contendo exatamente o que o seu MedicoCreate espera
            await usuarioService.cadastrarMedico({ 
                nome, 
                email, 
                senha, 
                crm: crm || "000000-SP", // Fallback caso seu Java exija CRM e você ainda não tenha o input na tela
                especialidade 
            });
            
            alert("Médico cadastrado com sucesso no banco MySQL do Docker!");
            navigate("/login"); // Redireciona o médico para a tela de Login real
        } catch (error: any) {
            alert(error.message || "Erro ao cadastrar.");
        }
    };

    return (
        <div className="signin-page">
            <div className="signin-card">
                <div className="signin-header">
                    <span className="signin-icon">👨‍⚕️</span>
                    <h1>{title}</h1>
                    <p className="signin-subtitle">Preencha os dados para criar seu acesso</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="nome">Nome completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Dr. João Silva" value={nome}
                            onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="medico@hospital.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    {/* 💡 ADICIONADO: Input de CRM opcional/obrigatório para não quebrar a validação do Back-end */}
                    <div className="input-group">
                        <label htmlFor="crm">CRM</label>
                        <input type="text" id="crm" name="crm" placeholder="123456-SP" value={crm}
                            onChange={(e) => setCrm(e.target.value)} required />
                    </div>

                    <div className="input-group">
                        <label htmlFor="especialidade">Especialidade</label>
                        <input type="text" id="especialidade" name="especialidade" placeholder="ex: Cardiologia" value={especialidade}
                            onChange={(e) => setEspecialidade(e.target.value)} required />
                    </div>
                    
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="senha" placeholder="••••••••" value={senha}
                            onChange={(e) => setSenha(e.target.value)} required />
                    </div>
                    
                    <button className="signin-btn" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    );
};

export default SignInMedicoPage;
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { gestorService } from "../services/gestorService";
import './SignInGestorPage.css'

interface SignInGestorPageProps {
    title?: string;
}

const SignInGestorPage: React.FC<SignInGestorPageProps> = ({ title = "Cadastro de Gestor" }) => {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [feedback, setFeedback] = useState("")

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setFeedback("Cadastrando...")

        try {
            const resultado = await gestorService.create({ nome, email, senha: password });

            if (resultado.valido) {
                setFeedback("Gestor cadastrado com sucesso!")
                setNome("")
                setPassword("")
                setEmail("")
                setTimeout(() => navigate("/login"), 1200);
            } else {
                setFeedback(resultado.mensagem || "Não foi possível cadastrar.")
            }
        } catch (error) {
            console.error("Connection error:", error);
            setFeedback("Erro de conexão com o servidor.")
        }
    }

    return (
        <div className="signin-page">
            <div className="signin-card">
                <div className="signin-header">
                    <span className="signin-icon">🏥</span>
                    <h1>{title}</h1>
                    <p className="signin-subtitle">Preencha os dados para criar seu acesso</p>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="nome">Nome completo</label>
                        <input type="text" id="nome" name="nome" placeholder="Maria Souza" value={nome}
                            onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="gestor@hospital.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="senha" placeholder="••••••••" value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="signin-btn" type='submit'>Cadastrar</button>
                </form>
                {feedback && <p className="signin-feedback">{feedback}</p>}
            </div>
        </div>
    )
}

export default SignInGestorPage
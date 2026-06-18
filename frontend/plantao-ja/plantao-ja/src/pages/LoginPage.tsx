import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import './LoginPage.css'

interface LoginPageProps {
    title?: string;
}

const URL_LOGIN = "http://localhost:8082/autenticacao/login";

const LoginPage: React.FC<LoginPageProps> = ({ title = "Login" }) => {
    const navigate = useNavigate();
    const [option, setOption] = useState("Login para Gestor");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState("");

    const executarLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setStatus("Verificando...");

        try {
            const response = await fetch(URL_LOGIN, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    senha: password
                })
            });

            if (response.ok) {
                const data = await response.json();

                if (!data || !data.token) {
                    setStatus("Falha na resposta: Token não encontrado.");
                    return;
                }

                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify({
                    id: data.idUsuario,
                    nome: data.nome,
                    role: data.role
                }));

                setStatus("Sucesso!");
                setEmail('');
                setPassword("");

                if (data.role === "MEDICO") {
                    navigate("/dashboard-medico");
                } else {
                    navigate("/dashboard");
                }
            } else if (response.status === 401 || response.status === 403) {
                setStatus("E-mail ou senha inválidos.");
            } else {
                setStatus("Erro ao tentar fazer login no servidor.");
            }
        } catch (error) {
            console.error("Connection error:", error);
            setStatus("Não foi possível conectar ao servidor.");
        }
    };

    const handleOption = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setOption(prev => prev === "Login para Gestor" ? "Login para Medico" : "Login para Gestor");
        setEmail("");
        setPassword("");
        setStatus("");
    };

    const isGestor = option === "Login para Gestor";

    return (
        <div className="login-page">
            <div className="login-card">
                <header>
                    <span className="login-brand-icon">🏥</span>
                    <h1>{title}</h1>
                    <p className="login-subtitle">Sistema de Gestão Hospitalar</p>
                </header>

                <div className="login-tabs">
                    <button className={`login-tab ${isGestor ? "active" : ""}`} onClick={handleOption}>
                        {option}
                    </button>
                </div>

                <form onSubmit={executarLogin}>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder={isGestor ? "Seu email de gestor" : "doutor@gmail.com"} value={email}
                            onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="senha" placeholder="••••••••" value={password}
                            onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button className="login-btn" type='submit'>Entrar</button>
                </form>

                {status && <p className="login-status">{status}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
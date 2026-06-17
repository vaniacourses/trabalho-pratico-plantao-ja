import React, { useState } from  "react";
import {useNavigate} from "react-router-dom";

import './LoginPage.css'

interface LoginPageProps {
    title?: string;
}

const urlGestor = "http://localhost:5001/gestor"
const urlMedico = "http://localhost:5003/medico"

const LoginPage: React.FC<LoginPageProps> = ({ title = "Login"}) => {
    const navigate = useNavigate() 
    const [option, setOption] = useState("Login para Gestor")
    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState("");  

    const handleLoginGestor = async (e: React.SubmitEvent) => {
        e.preventDefault();
        setStatus("Verificando...");

        try {
        const response = await fetch(`${urlGestor}?email=${email}`);

        if (response.ok) {
            const gestores = await response.json()
            const gestor = gestores[0];
            console.log(gestores[0])
            if (!gestor) {
                alert("Usuário não encontrado");
                setStatus("");
                return;
            }

            if (gestor.password !== password) {
                alert("Senha inválida");
                return;
            }
            localStorage.setItem(
            "user",
            JSON.stringify(gestor)
            );

            navigate("/dashboard");
        } else {
            setStatus("Submission failed. Server returned an error.");
        }
        } catch (error) {
            console.error("Connection error:", error);
            setStatus("Could not connect to the backend server.");
        }
    };

    const handleLoginMedico = async (e: React.FormEvent) => {
        e.preventDefault(); 
        setStatus("Verificando...");

        try {
            const response = await fetch(`${urlMedico}?email=${email}`);

            if (response.ok) {
                const medicos = await response.json();
                const data = medicos[0]; // Ajustado para pegar o primeiro registro do array, igual ao gestor
                
                if(!data) {
                    alert("Médico não cadastrado!");
                    setStatus("");
                    return;
                }

                if (data.password !== password) {
                    alert("Senha inválida!");
                    setStatus("");
                    return;
                }

                localStorage.setItem("user", JSON.stringify(data));
                setStatus("Sucesso!");
                setEmail(''); 
                setPassword("");
                
                // Redireciona o médico para o painel dele
                navigate("/dashboard-medico");
            } else {
                setStatus("Submission failed. Server returned an error.");
            }
        } catch (error) {
            console.error("Connection error:", error);
            setStatus("Could not connect to the backend server.");
        }
    };

    const handleOption = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        setOption(prev => prev === "Login para Gestor" ? "Login para Medico" : "Login para Gestor")
        setEmail("")
        setPassword("")
        setStatus("")
    }

    const isGestor = option === "Login para Gestor"

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
                {isGestor ? (
                    <form onSubmit={handleLoginGestor}>
                        <div id="login-gestor" className="input-group">
                            <p>Digite o seu Email:</p>
                            <input type="email" name="email" placeholder="Seu email de gestor" id="email" value={email} 
                            onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div id="login-gestor" className="input-group">
                            <p>Digite a sua Senha:</p>
                        <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                        onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button className="login-btn" type='submit'>Entrar</button>
                    </form>) : (
                    <form onSubmit={handleLoginMedico}>
                        <div id="login-medico" className="input-group">
                            <p>Digite o seu Email:</p>
                            <input type="email" name="email" placeholder="douto@gmail.com" id="email" value={email} 
                            onChange={(e) => setEmail(e.target.value)}/>
                        </div>
                        <div id="login-medico" className="input-group">
                            <p>Digite a sua Senha:</p>
                            <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                            onChange={(e) => setPassword(e.target.value)}/>
                        </div>
                        <button type='submit' className="login-btn">Entrar</button>
                    </form>
                    )}
                {status && <p className="login-status">{status}</p>}
            </div>
        </div>
    );
};

export default LoginPage;
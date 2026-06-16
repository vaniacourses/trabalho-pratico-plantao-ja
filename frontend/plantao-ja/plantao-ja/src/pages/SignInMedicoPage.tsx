import React, { useState } from  "react";
import './SignInMedicoPage.css'

interface SignInMedicoPageProps {
    title?: string;
}

const url = "http://localhost:5003/medico"

const SignInMedicoPage: React.FC<SignInMedicoPageProps> = ({title = "Cadastro de Medico"}) => {

    const [nome, setNome] = useState(""); //1.Define o estado
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [status] = useState(true)
    const [especialidade, setEspecialidade] = useState("")

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        const medico = { nome, password, email, status, especialidade}
        try {
            const response = await fetch ( url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(medico)
            })
            await response.json();
            setNome("")
            setPassword("")
            setEmail("")
            setEspecialidade("")
        } catch(error) {
            console.error("Connection error:", error);
        }
    } 

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
                            onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="medico@hospital.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="especialidade">Especialidade</label>
                        <input type="text" id="especialidade" name="especialidade" placeholder="ex: Cardiologia" value={especialidade}
                            onChange={(e) => setEspecialidade(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="senha" placeholder="••••••••" value={password}
                            onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <button className="signin-btn" type="submit">Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export default SignInMedicoPage
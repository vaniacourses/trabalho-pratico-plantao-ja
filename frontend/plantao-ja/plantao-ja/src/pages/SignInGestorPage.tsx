import React, { useState } from  "react";
import './SignInGestorPage.css'

interface SignInGestorPageProps {
    title?: string;
}

const url = "http://localhost:5001/gestor"

const SignInGestorPage: React.FC<SignInGestorPageProps> = ({title = "Cadastro de Gestor"}) => {

    const [nome, setNome] = useState(""); //1.Define o estado
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [status] = useState(true)
    const [cargo, setCargo] = useState("")

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        const gestor = { nome, password, email, status, cargo}
        try {
            const response = await fetch ( url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(gestor)
            })
            await response.json();
            setNome("")
            setPassword("")
            setEmail("")
            setCargo("")
        } catch(error) {
            console.error("Connection error:", error);
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
                            onChange={(e) => setNome(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" placeholder="gestor@hospital.com" value={email}
                            onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="cargo">Cargo</label>
                        <input type="text" id="cargo" name="cargo" placeholder="ex: Diretor Administrativo" value={cargo}
                            onChange={(e) => setCargo(e.target.value)} />
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

export default SignInGestorPage
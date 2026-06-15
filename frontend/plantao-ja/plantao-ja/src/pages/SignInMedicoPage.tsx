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
        status: true
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
        <div id="root">
            <h1>{title}</h1>
            <div className="signin-box">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nome" placeholder="Usuário" id="user-id" value={nome} 
                    onChange={(e) => setNome(e.target.value)}/>
                    <input type="email" name="email" placeholder="seu_email@exemplo.com" id="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" name="especialidade" placeholder="Sua especialidade" id="especialidade" value={especialidade} 
                    onChange={(e) => setEspecialidade(e.target.value)}/>
                    <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit'>Cadastrar</button>
                </form>
            </div>
        </div>
    )
}

export default SignInMedicoPage
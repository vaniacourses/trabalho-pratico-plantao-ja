import React, { useState } from  "react";
import './SignInGestorPage.css'

interface SignInGestorPageProps {
    title?: string;
}

const url = "http://localhost:5001/gestor"

const SignInGestorPage: React.FC<SignInGestorPageProps> = ({title = "Sign In de Gestor"}) => {

    const [nome, setNome] = useState(""); //1.Define o estado
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")
    const [status, setStatus] = useState(true)
    const [cargo, setCargo] = useState("")

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        status: true
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
        <>
            <h1>{title}</h1>
            <div className="signin-box">
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nome" placeholder="Usuário" id="user-id" value={nome} 
                    onChange={(e) => setNome(e.target.value)}/>
                    <input type="email" name="email" placeholder="seu_email@exemplo.com" id="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                    <input type="text" name="cargo" placeholder="Seu cargo no hospital" id="cargo" value={cargo} 
                    onChange={(e) => setCargo(e.target.value)}/>
                    <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit'>Submit Form</button>
                </form>
            </div>
        </>
    )
}

export default SignInGestorPage
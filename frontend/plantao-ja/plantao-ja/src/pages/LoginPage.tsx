import React, { useState } from  "react";
import './LoginPage.css'

interface LoginPageProps {
    title?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ title = "Login"}) => {
    const [text, setText] = useState(""); //1.Define o estado
    const [password, setPassword] = useState("")
    const handleSubmit = (e: React.SubmitEvent) => {
        e.preventDefault(); // Impede a página de recarregar e quebrar o React
        console.log("Dados enviados:", { text, password });
        // Aqui você faz a chamada de login ou usa o React Router
    };
    return (
        <>
            <header>
                <h1>{title}</h1>
            </header>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Usuário" id="user-id" value={text} 
                    onChange={(e) =>setText(e.target.value)}/>
                    <input type="password" placeholder="Senha" id="password" value={password} 
                    onChange={(e) =>setPassword(e.target.value)}/>
                    <button type='submit'>Submit Form</button>
                </form>
            </div>
        </>
    );
};

export default LoginPage;
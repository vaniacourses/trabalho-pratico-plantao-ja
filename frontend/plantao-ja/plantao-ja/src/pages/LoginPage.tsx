import React, { useState } from  "react";
import './LoginPage.css'

interface LoginPageProps {
    title?: string;
}

const LoginPage: React.FC<LoginPageProps> = ({ title = "Login"}) => {
    const [text, setText] = useState(""); //1.Define o estado
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState("");   
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault(); // Impede a página de recarregar e quebrar o React
        console.log("Dados enviados:", { text, password });
        // Aqui você faz a chamada de login ou usa o React Router
        setStatus("Submitting...");

        try {
        const response = await fetch("http://localhost:8000/", {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({text, password}),
        });

        if (response.ok) {
            const data = await response.json();
            setStatus(`Success: ${data.message}`);
            setText(''); 
            setPassword("");// Clear form
        } else {
            setStatus("Submission failed. Server returned an error.");
        }
        } catch (error) {
            console.error("Connection error:", error);
            setStatus("Could not connect to the backend server.");
        }
    };
    return (
        <>
            <header>
                <h1>{title}</h1>
            </header>
            <div>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="nome" placeholder="Usuário" id="user-id" value={text} 
                    onChange={(e) =>setText(e.target.value)}/>
                    <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                    onChange={(e) =>setPassword(e.target.value)}/>
                    <button type='submit'>Submit Form</button>
                </form>
                {status && <p>{status}</p>}
            </div>
        </>
    );
};

export default LoginPage;
import React, { useState } from  "react";
import {useNavigate} from "react-router-dom";
import './LoginPage.css'

interface LoginPageProps {
    title?: string;
}

const urlGestor = "http://localhost:5001/gestor"
const urlMedico = "http://localhost:5001/medico"

const LoginPage: React.FC<LoginPageProps> = ({ title = "Login"}) => {
    const navigate = useNavigate() 
    const [option, setOption] = useState("Login para Gestor")
    const [email, setEmail] = useState(""); //1.Define o estado
    const [password, setPassword] = useState("")
    const [status, setStatus] = useState("");  

    const handleLoginGestor = async (e: React.SubmitEvent) => {
        e.preventDefault(); // Impede a página de recarregar e quebrar o React
        // Aqui você faz a chamada de login ou usa o React Router
        setStatus("Submitting...");

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

    const handleLoginMedico = async (e: React.SubmitEvent) => {
        e.preventDefault(); // Impede a página de recarregar e quebrar o React
        const medico = { email, password }
        console.log(email, password)
        // Aqui você faz a chamada de login ou usa o React Router
        setStatus("Submitting...");

        try {
        const response = await fetch(urlMedico, {
            method: "POST",
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify(medico),
        });

        if (response.ok) {
            const data = await response.json();
            setStatus(`Success: ${data.message}`);
            setEmail(''); 
            setPassword("");// Clear form
        } else {
            setStatus("Submission failed. Server returned an error.");
        }
        } catch (error) {
            console.error("Connection error:", error);
            setStatus("Could not connect to the backend server.");
        }
    };

    const handleOption = async (e: React.SubmitEvent) => {
        e.preventDefault()
        if (option==="Login para Gestor") {
            setOption("Login para Medico")
        }
        else {
            setOption("Login para Gestor")
        }
    }

    return (
        <>
            <header>
                <h1>{title}</h1>
            </header>
            {option!=="Login para Gestor" && <div id="login-gestor">
                <form onSubmit={handleLoginGestor}>
                    <p>Digite o seu Email:</p>
                    <input type="email" name="email" placeholder="Seu email de gestor" id="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                    <p>Digite a sua Senha:</p>
                    <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit'>Login</button>
                </form>
                {status && <p>{status}</p>}
            </div>}
            {option!=="Login para Medico" && <div id="login-medico">
                <form onSubmit={handleLoginMedico}>
                    <p>Digite o seu Email:</p>
                    <input type="email" name="email" placeholder="Seu email de medico" id="email" value={email} 
                    onChange={(e) => setEmail(e.target.value)}/>
                    <p>Digite a sua Senha:</p>
                    <input type="password" name="senha" placeholder="Senha" id="password" value={password} 
                    onChange={(e) => setPassword(e.target.value)}/>
                    <button type='submit'>Login</button>
                </form>
                {status && <p>{status}</p>}
            </div>}
            <form onSubmit={handleOption}>
                <input type="submit" name="login-gestor" value={option}/>
            </form>
        </>
    );
};

export default LoginPage;
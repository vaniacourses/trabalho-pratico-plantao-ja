import React, { useState } from  "react";
import { Link } from "react-router-dom";
import { useHospitais } from "../hooks/useHospitals";
//import './SignInHospitalPage.css'

interface SignInHospitalPageProps {
    title?: string;
}

const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const SignInHospitalPage: React.FC<SignInHospitalPageProps> = ({title = "Cadastro de Hospital"}) => {

    const [nome, setNome] = useState(""); //1.Define o estado
    const [cnpj, setCnpj] = useState("")
    const [cep, setCep] = useState("")
    const [rua, setRua] = useState("")
    const [numero, setNumero] = useState("")
    const [cidade, setCidade] = useState("")
    const [estado, setEstado] = useState("")
    const [complemento, setComplemento] = useState("")
    const [status, setStatus] = useState(true)

    const { criarHospital } = useHospitais();

    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault()
        status: true
        const endereco = {cep, rua, numero: Number(numero), complemento}
        const hospital = { nome, cnpj, statusCadastro:"ATIVO", notaMedia:0, endereco, gestorId: user.id}
        try {
            await criarHospital(hospital);
            setNome("")
            setCnpj("")
            setCep("")
            setRua("")
            setNumero("")
            setCidade("")
            setEstado("")
            setComplemento("")
            setStatus(false)
        } catch(error) {
            console.error("Connection error:", error);
        }
    } 

    return (
        <div id="root">
            <h1>{title}</h1>
            <div className="signin-box">
                {status&&<form onSubmit={handleSubmit}>
                    <p>Nome:</p>
                    <input type="text" name="nome" placeholder="Nome" id="user-id" value={nome} 
                    onChange={(e) => setNome(e.target.value)}/>
                    <p>CNPJ:</p>
                    <input type="text" name="cnpj" placeholder="xxxxx" id="cnpj" value={cnpj} 
                    onChange={(e) => setCnpj(e.target.value)}/>
                    <p>CEP:</p>
                    <input type="text" name="cep" placeholder="CEP do hospital" id="cep" value={cep} 
                    onChange={(e) => setCep(e.target.value)}/>
                    <p>Rua:</p>
                    <input type="text" name="rua" placeholder="Rua/Av/Rod xxxxxx" id="rua" value={rua} 
                    onChange={(e) => setRua(e.target.value)}/>
                    <p>Número:</p>
                    <input type="text" name="numero" placeholder="Ex.: 84" id="numero" value={numero} 
                    onChange={(e) => setNumero(e.target.value)}/>
                    <p>Cidade:</p>
                    <input type="text" name="cidade" placeholder="Ex.: Niterói" id="cidade" value={cidade} 
                    onChange={(e) => setCidade(e.target.value)}/>
                    <p>Estado:</p>
                    <input type="text" name="estado" placeholder="Ex: RJ" id="estado" value={estado} 
                    onChange={(e) => setEstado(e.target.value)}/>
                    <p>Complemento:</p>
                    <input type="text" name="complemento" placeholder="Ex: Em frente a Baía de Guanabara" id="complemento" value={complemento} 
                    onChange={(e) => setComplemento(e.target.value)}/>
                    <button type='submit'>Cadastrar</button>
                </form>}
                {!status&&<h2>
                    Hospital cadastrado com sucesso!<br/>
                    <Link to="/dashboard">Voltar</Link>
                    </h2>}
            </div>
        </div>
    )
}

export default SignInHospitalPage;
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useHospitais } from "../hooks/useHospitals";
import './SignInHospitalPage.css';

interface SignInHospitalPageProps {
    title?: string;
}

const user = JSON.parse(
  localStorage.getItem("user") || "{}"
);

const SignInHospitalPage: React.FC<SignInHospitalPageProps> = ({ title = "Cadastro de Hospital" }) => {

    const [nome, setNome] = useState(""); 
    const [cnpj, setCnpj] = useState("");
    const [cep, setCep] = useState("");
    const [rua, setRua] = useState("");
    const [numero, setNumero] = useState("");
    const [cidade, setCidade] = useState("");
    const [estado, setEstado] = useState("");
    const [complemento, setComplemento] = useState("");
    const [status, setStatus] = useState(true);

    const { criarHospital } = useHospitais();

    const handleSubmit = async (e: React.SubmitEvent) => { // Ajustado para FormEvent
        e.preventDefault();
        
        const endereco = { cep, rua, numero: Number(numero), complemento };
        const hospital = { nome, cnpj, statusCadastro: "ATIVO", notaMedia: 0, endereco, gestorId: user.id };
        
        try {
            await criarHospital(hospital);
            setNome("");
            setCnpj("");
            setCep("");
            setRua("");
            setNumero("");
            setCidade("");
            setEstado("");
            setComplemento("");
            setStatus(false);
        } catch (error) {
            console.error("Connection error:", error);
        }
    };

    return (
        <div className="signin-container"> {/* Mudado de id="root" para classe específica para evitar conflito global */}
            <div className="signin-box">
                <h1>{title}</h1>
                
                {status && (
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="user-id">Nome:</label>
                            <input type="text" name="nome" placeholder="Nome do hospital" id="user-id" value={nome} 
                            onChange={(e) => setNome(e.target.value)} required />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cnpj">CNPJ:</label>
                            <input type="text" name="cnpj" placeholder="xx.xxx.xxx/xxxx-xx" id="cnpj" value={cnpj} 
                            onChange={(e) => setCnpj(e.target.value)} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group size-70">
                                <label htmlFor="cep">CEP:</label>
                                <input type="text" name="cep" placeholder="00000-000" id="cep" value={cep} 
                                onChange={(e) => setCep(e.target.value)} required />
                            </div>
                            <div className="form-group size-30">
                                <label htmlFor="numero">Número:</label>
                                <input type="text" name="numero" placeholder="Ex.: 84" id="numero" value={numero} 
                                onChange={(e) => setNumero(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="rua">Rua:</label>
                            <input type="text" name="rua" placeholder="Rua / Av / Rodoviária" id="rua" value={rua} 
                            onChange={(e) => setRua(e.target.value)} required />
                        </div>

                        <div className="form-row">
                            <div className="form-group size-70">
                                <label htmlFor="cidade">Cidade:</label>
                                <input type="text" name="cidade" placeholder="Ex.: Niterói" id="cidade" value={cidade} 
                                onChange={(e) => setCidade(e.target.value)} required />
                            </div>
                            <div className="form-group size-30">
                                <label htmlFor="estado">Estado:</label>
                                <input type="text" name="estado" placeholder="Ex: RJ" id="estado" value={estado} 
                                onChange={(e) => setEstado(e.target.value)} required />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="complemento">Complemento:</label>
                            <input type="text" name="complemento" placeholder="Ex: Próximo ao hospital X" id="complemento" value={complemento} 
                            onChange={(e) => setComplemento(e.target.value)} />
                        </div>

                        <button type='submit' className="btn-submit">Cadastrar Hospital</button>
                    </form>
                )}

                {!status && (
                    <div className="success-message">
                        <h2>Hospital cadastrado com sucesso!</h2>
                        <Link to="/dashboard" className="btn-back">Voltar para o Dashboard</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SignInHospitalPage;
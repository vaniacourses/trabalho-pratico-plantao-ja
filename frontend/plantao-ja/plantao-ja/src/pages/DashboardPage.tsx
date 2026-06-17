import { Link } from 'react-router-dom';
import { useHospitais } from '../hooks/useHospitals';


const DashboardPage = () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const { hospitais, loading, error } = useHospitais();

    return (
        <>
            <h1>Bem-vindo {user.nome}</h1>

            
                <p>
                    <Link to="/signin-hospital">Cadastrar Hospital</Link>
                </p>
                {loading === "loading" && <p>Carregando hospitais...</p>}
                {error && <p>{error}</p>}
                {hospitais.map(hospital => (
                    <div key={hospital.id}>
                        <h2>{hospital.nome}</h2>
                        <p>{hospital.statusCadastro}</p>
                    </div>
                ))}
                <p>
                    Cadastrar Plantão
                </p>

        </>
    );
};

export default DashboardPage;
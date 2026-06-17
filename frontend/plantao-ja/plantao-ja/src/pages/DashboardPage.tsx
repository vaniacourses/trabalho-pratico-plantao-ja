import { Link } from 'react-router-dom';


const DashboardPage = () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );


    return (
        <>
            <h1>Bem-vindo {user.nome}</h1>

            
                <p>
                    <Link to="/signin-hospital">Cadastrar Hospital</Link>
                </p>

                <p>
                    Cadastrar Plantão
                </p>

        </>
    );
};

export default DashboardPage;
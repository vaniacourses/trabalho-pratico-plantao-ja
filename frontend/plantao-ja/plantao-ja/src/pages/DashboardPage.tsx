const DashboardPage = () => {

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    return (
        <>
            <h1>Bem-vindo {user.nome}</h1>

            <p>
                Cadastrar Hospital
            </p>

            <p>
                Cadastrar Plantão
            </p>
        </>
    );
};

export default DashboardPage;
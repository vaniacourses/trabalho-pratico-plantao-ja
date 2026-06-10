import requests

#usando o inspector, descobri que o TJERJ tem um endpoint HTTP utilizado pelo front-end público do site que é usada para buscar processos. A URL é a seguinte:
BASE_URL = "https://www3.tjrj.jus.br/consultaprocessual/api/processos"

def buscar_processos_por_nome(nome: str):
    payload = {
        "anoInicial": 2025,
        "anoFinal": 2026,
        "origem": "1",
        "codCom": None,
        "codComp": None,
        "nome": nome,
        "comarca": "TODAS",
        "competencia": "01",
        "totalProcessoPesquisa": 300,
        "tipoConsulta": "publica",
        "isPortalDeServicos": 1,
        "isPortal": "S",
        "pIsProcAtivos": "N",
        "secao": "RJ",
        "tipoSegundaInstancia": "1",
        "validarSecao": True,
        "aba": "nome",
        "radio": "1"
    }

    try:
        response = requests.post(
            f"{BASE_URL}/por-nome-parte",
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"erro": "Falha ao consultar TJERJ", "detalhe": str(e)}

def buscar_processos_por_cpf(cpf: str):
    payload = {
        "anoInicial": 2025,
        "anoFinal": 2026,
        "origem": "1",
        "codCom": None,
        "codComp": None,
        "cpfcnpj": cpf,
        "comarca": "201",
        "competencia": "01",
        "totalProcessoPesquisa": 300,
        "tipoConsulta": "publica",
        "isPortalDeServicos": 1,
        "isPortal": "S",
        "pIsProcAtivos": "N",
        "secao": "RJ",
        "tipoSegundaInstancia": "1",
        "validarSecao": True,
        "aba": "cpfcnpj",
        "radio": "1"
    }

    try:
        response = requests.post(
            f"{BASE_URL}/por-cpf-cnpj",
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"erro": "Falha ao consultar TJERJ", "detalhe": str(e)}
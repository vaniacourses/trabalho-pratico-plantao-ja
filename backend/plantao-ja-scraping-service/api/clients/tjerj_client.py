import requests

#usando o inspector, descobri que o TJERJ tem uma API interna que é usada para buscar processos por nome de parte. A URL é a seguinte:
BASE_URL = "https://www3.tjrj.jus.br/consultaprocessual/api/processos/por-nome-parte"

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

    response = requests.post(BASE_URL, json=payload, timeout=30)
    response.raise_for_status()
    return response.json()
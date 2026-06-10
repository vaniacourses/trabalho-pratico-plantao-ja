import requests
import unicodedata
#usando o inspector, descobri que o TJERJ tem um endpoint HTTP utilizado pelo front-end público do site que é usada para buscar processos. A URL é a seguinte:
API_URL = "https://www3.tjrj.jus.br/consultaprocessual/api/processos"

def normalizar_nome(texto: str) -> str:
    if not texto:
        return ""

    texto = texto.strip()
    texto = texto.strip("{}")
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return " ".join(texto.casefold().split())

def filtraPorNomeExato(nome_busca: str, processos: list) -> list:
    nome_normalizado = normalizar_nome(nome_busca)
    resultados_filtrados = []

    for processo in processos:
        personagens = processo.get("personagensResumido", [])

        for personagem in personagens:
            nome_personagem = personagem.get("nome")

            if nome_personagem and normalizar_nome(nome_personagem) == nome_normalizado:
                resultados_filtrados.append(processo)
                break

    return resultados_filtrados


def buscar_processos_por_nome(nome: str):
    payload = {
        "anoInicial": 2000,
        "anoFinal": 2026,
        "origem": "1",
        "codCom": None,
        "codComp": None,
        "nome": nome,
        "comarca": "TODAS",
        "competencia": "01",
        "totalProcessoPesquisa": 3000,
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
            f"{API_URL}/por-nome-parte",
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        resultado = response.json()
        if isinstance(resultado, list):
            return filtraPorNomeExato(nome, resultado)
        return resultado

    except requests.RequestException as e:
        return {"erro": "Falha ao consultar TJERJ", "detalhe": str(e)}


def buscar_processos_por_cpf(cpf: str):
    payload = {
        "anoInicial": 2000,
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
            f"{API_URL}/por-cpf-cnpj",
            json=payload,
            timeout=30
        )
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        return {"erro": "Falha ao consultar TJERJ", "detalhe": str(e)}
import requests
import unicodedata
from abc import ABC, abstractmethod

API_URL = "https://www3.tjrj.jus.br/consultaprocessual/api/processos"


def normalizar_texto(texto: str) -> str:
    if not texto:
        return ""
    texto = texto.strip()
    texto = texto.strip("{}")
    texto = unicodedata.normalize("NFKD", texto)
    texto = "".join(c for c in texto if not unicodedata.combining(c))
    return " ".join(texto.casefold().split())

def contem_indicacao_falecido(texto: str) -> bool:
    texto_normalizado = normalizar_texto(texto)
    indicadores = [
        "falecido",
        "falecida"
    ]
    return any(indicador in texto_normalizado for indicador in indicadores)

#region Mini strategy para filtragem
class FiltroProcesso(ABC):
    @abstractmethod
    def aceitar(self, processo: dict) -> bool:
        pass

    def filtrar(self, processos: list) -> list:
        return [processo for processo in processos if self.aceitar(processo)]


class FiltroNomeReuVivo(FiltroProcesso):
    def __init__(self, nome_busca: str):
        self.nome_busca = normalizar_texto(nome_busca)

    def aceitar(self, processo: dict) -> bool:
        nome_reu = normalizar_texto(processo.get("nomeReu", ""))
        if nome_reu != self.nome_busca:
            return False

        if contem_indicacao_falecido(processo.get("nomeReu", "")):
            return False

        return True


class FiltroCpfReuVivo(FiltroProcesso):
    def aceitar(self, processo: dict) -> bool:
        nome_reu = processo.get("nomeReu", "")
        if not nome_reu:
            return False

        if contem_indicacao_falecido(nome_reu):
            return False

        return True
#endregion

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
            filtro = FiltroNomeReuVivo(nome)
            return filtro.filtrar(resultado)

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
        resultado = response.json()

        if isinstance(resultado, list):
            filtro = FiltroCpfReuVivo()
            return filtro.filtrar(resultado)

        return resultado

    except requests.RequestException as e:
        return {"erro": "Falha ao consultar TJERJ", "detalhe": str(e)}
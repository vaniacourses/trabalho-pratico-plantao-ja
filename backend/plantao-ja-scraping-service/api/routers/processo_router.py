from fastapi import APIRouter
from api.strategies.consulta_por_nome import ConsultaPorNomeStrategy
from api.strategies.consulta_por_cpf import ConsultaPorCpfStrategy

router = APIRouter(prefix="/processos", tags=["Processos"])

@router.get("/nome/{nome}")
def consultar_processo_por_nome(nome: str):
    strategy = ConsultaPorNomeStrategy()
    return strategy.consultar(nome)

@router.get("/cpf/{cpf}")
def consultar_processos_por_cpf(cpf: str):
    strategy = ConsultaPorCpfStrategy()
    return strategy.consultar(cpf)
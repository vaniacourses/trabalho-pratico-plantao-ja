from api.strategies.consulta_strategy import ConsultaStrategy
from api.clients.tjerj_client import buscar_processos_por_cpf

class ConsultaPorCpfStrategy(ConsultaStrategy):
    def consultar(self, valor: str) -> dict:
        resultado = buscar_processos_por_cpf(valor)
        return {
            "tipo_consulta": "cpf",
            "criterio": valor,
            "resultado": resultado
        }
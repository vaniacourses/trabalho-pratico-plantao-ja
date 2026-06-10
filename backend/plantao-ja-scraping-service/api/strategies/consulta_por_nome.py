from api.strategies.consulta_strategy import ConsultaStrategy
from api.clients.tjerj_client import buscar_processos_por_nome

class ConsultaPorNomeStrategy(ConsultaStrategy):
    def consultar(self, valor: str) -> dict:
        resultado = buscar_processos_por_nome(valor)
        return {
            "tipo_consulta": "nome",
            "criterio": valor,
            "resultado": resultado
        }
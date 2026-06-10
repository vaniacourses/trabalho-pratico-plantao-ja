from abc import ABC, abstractmethod

class ConsultaStrategy(ABC):
    @abstractmethod
    def consultar(self, valor: str) -> dict:
        pass
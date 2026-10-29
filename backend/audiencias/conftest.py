from datetime import date

import pytest

from audiencias.models import Audiencia, Conciliadora
from audiencias.regras import Resultado, Tipo, Vara

from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


@pytest.fixture
def api(db):
    """Cliente de API já logado, usado pelos testes de API e de Excel."""
    usuario = get_user_model().objects.create_user("teste", password="senha-teste-123")
    cliente = APIClient()
    cliente.force_authenticate(user=usuario)
    return cliente

@pytest.fixture
def conciliadora(db):
    return Conciliadora.objects.create(nome="Conciliadora Teste")


@pytest.fixture
def dados(conciliadora):
    linhas = [
        (date(2026, 8, 3), Vara.PRE, Tipo.MEDIACAO, False, Resultado.FRUTIFERA),
        (date(2026, 8, 4), Vara.JEC, Tipo.CONCILIACAO, False, Resultado.INFRUTIFERA),
        (date(2026, 8, 5), Vara.PRIMEIRA, Tipo.MEDIACAO, True, Resultado.FRUTIFERA),
        (date(2026, 8, 6), Vara.SEGUNDA, Tipo.CONCILIACAO, False, Resultado.CANCELADA),
        (date(2026, 9, 1), Vara.PRE, Tipo.CONCILIACAO, False, Resultado.FRUTIFERA),
    ]
    for i, (d, vara, tipo, paga, res) in enumerate(linhas, start=1):
        Audiencia.objects.create(
            conciliadora=conciliadora, data=d, processo=f"000000{i}-00.2026.8.26.0000",
            vara=vara.value, tipo=tipo.value, paga=paga, resultado=res.value,
        )
from datetime import date

import pytest

from audiencias.models import Audiencia, Conciliadora
from audiencias.regras import Resultado, Tipo, Vara
from audiencias.relatorio import audiencias_do_mes, montar_relatorio


def test_relatorio_de_agosto(dados):
    rel = montar_relatorio(audiencias_do_mes(2026, 8))

    assert rel["total_agendadas"] == 4
    assert rel["agendadas"] == {"PRE": 1, "JEC": 1, "FAMILIA": 1, "CIVEL": 1}
    assert rel["realizadas"] == 3
    assert rel["acordos"] == 2
    assert rel["pagas"]["FAMILIA"] == 1
    assert rel["voluntarias"]["JEC"] == 1
    assert rel["resultados"]["CIVEL"]["cancelada"] == 1
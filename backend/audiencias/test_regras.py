import pytest
from audiencias.regras import (Vara, Tipo, Resultado, classificar, eh_processual,
                    foi_realizada, foi_acordo, validar_pagamento)


@pytest.mark.parametrize("vara, tipo, esperado", [
    (Vara.PRE, Tipo.MEDIACAO, "PRE"),
    (Vara.PRE, Tipo.CONCILIACAO, "PRE"),
    (Vara.JEC, Tipo.CONCILIACAO, "JEC"),
    (Vara.PRIMEIRA, Tipo.MEDIACAO, "FAMILIA"),
    (Vara.SEGUNDA, Tipo.MEDIACAO, "FAMILIA"),
    (Vara.PRIMEIRA, Tipo.CONCILIACAO, "CIVEL"),
    (Vara.SEGUNDA, Tipo.CONCILIACAO, "CIVEL"),
])
def test_classificar(vara, tipo, esperado):
    assert classificar(vara, tipo) == esperado


def test_pre_nao_eh_processual():
    assert not eh_processual(Vara.PRE)
    assert eh_processual(Vara.JEC)


def test_realizadas_e_acordos():
    assert foi_realizada(Resultado.FRUTIFERA)
    assert foi_realizada(Resultado.INFRUTIFERA)
    assert not foi_realizada(Resultado.CANCELADA)
    assert not foi_realizada(Resultado.PREJ_AUS_PARTES)
    assert foi_acordo(Resultado.FRUTIFERA)
    assert not foi_acordo(Resultado.INFRUTIFERA)


def test_jec_nao_pode_ser_paga():
    with pytest.raises(ValueError):
        validar_pagamento(Vara.JEC, paga=True)
    validar_pagamento(Vara.JEC, paga=False)
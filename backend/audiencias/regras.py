from enum import Enum


class Vara(str, Enum):
    PRE = "PRE"
    JEC = "JEC"
    PRIMEIRA = "1a VARA"
    SEGUNDA = "2a VARA"


class Tipo(str, Enum):
    CONCILIACAO = "conciliacao"
    MEDIACAO = "mediacao"


class Resultado(str, Enum):
    FRUTIFERA = "frutifera"
    INFRUTIFERA = "infrutifera"
    PREJ_AUS_REQUERIDO = "prejudicada_ausencia_requerido"
    PREJ_AUS_PARTES = "prejudicada_ausencia_partes"
    CANCELADA = "cancelada"
    REDESIGNADA = "redesignada"


def classificar(vara: Vara, tipo: Tipo) -> str:
    """Devolve PRE, JEC, FAMILIA ou CIVEL."""
    if vara == Vara.PRE:
        return "PRE"
    if vara == Vara.JEC:
        return "JEC"
    if tipo == Tipo.MEDIACAO:
        return "FAMILIA"
    return "CIVEL"


def eh_processual(vara: Vara) -> bool:
    return vara != Vara.PRE


def foi_realizada(resultado: Resultado) -> bool:
    return resultado in (Resultado.FRUTIFERA, Resultado.INFRUTIFERA)


def foi_acordo(resultado: Resultado) -> bool:
    return resultado == Resultado.FRUTIFERA


def validar_pagamento(vara: Vara, paga: bool) -> None:
    """JEC é sempre voluntário."""
    if vara == Vara.JEC and paga:
        raise ValueError("Audiência do JEC não pode ser paga.")
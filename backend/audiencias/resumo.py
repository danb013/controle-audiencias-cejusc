from .regras import Resultado, Tipo, Vara, eh_processual, foi_acordo, foi_realizada


def montar_resumo_excel(audiencias) -> dict:
    blocos = {
        bloco: {tipo.value: {r.value: 0 for r in Resultado} for tipo in Tipo}
        for bloco in ("pre", "processual")
    }
    for a in audiencias:
        bloco = "processual" if eh_processual(Vara(a.vara)) else "pre"
        blocos[bloco][Tipo(a.tipo).value][Resultado(a.resultado).value] += 1

    total = {
        bloco: sum(sum(por_tipo.values()) for por_tipo in blocos[bloco].values())
        for bloco in blocos
    }
    return {
        "total_agendadas": len(audiencias),
        "agendadas_pre": total["pre"],
        "agendadas_processual": total["processual"],
        "blocos": blocos,
        "realizadas": sum(foi_realizada(Resultado(a.resultado)) for a in audiencias),
        "acordos": sum(foi_acordo(Resultado(a.resultado)) for a in audiencias),
    }
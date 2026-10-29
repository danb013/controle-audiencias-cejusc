from collections import Counter

from .models import Audiencia
from .regras import Resultado, Tipo, Vara, classificar, foi_acordo, foi_realizada

CATEGORIAS = ("PRE", "JEC", "FAMILIA", "CIVEL")


def audiencias_do_mes(ano: int, mes: int, conciliadora_id: int | None = None):
    consulta = Audiencia.objects.filter(data__year=ano, data__month=mes)
    if conciliadora_id is not None:
        consulta = consulta.filter(conciliadora_id=conciliadora_id)
    return list(consulta)


def montar_relatorio(audiencias) -> dict:
    agendadas = Counter()
    resultados = {cat: Counter() for cat in CATEGORIAS}
    voluntarias = Counter()
    pagas = Counter()
    realizadas = 0
    acordos = 0

    for a in audiencias:
        cat = classificar(Vara(a.vara), Tipo(a.tipo))
        resultado = Resultado(a.resultado)
        agendadas[cat] += 1
        resultados[cat][resultado.value] += 1
        if a.paga:
            pagas[cat] += 1
        else:
            voluntarias[cat] += 1
        if foi_realizada(resultado):
            realizadas += 1
        if foi_acordo(resultado):
            acordos += 1

    return {
        "total_agendadas": len(audiencias),
        "agendadas": {cat: agendadas[cat] for cat in CATEGORIAS},
        "resultados": {
            cat: {r.value: resultados[cat][r.value] for r in Resultado}
            for cat in CATEGORIAS
        },
        "voluntarias": {cat: voluntarias[cat] for cat in CATEGORIAS},
        "pagas": {cat: pagas[cat] for cat in CATEGORIAS},
        "realizadas": realizadas,
        "acordos": acordos,
    }
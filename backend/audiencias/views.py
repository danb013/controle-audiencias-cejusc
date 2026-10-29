from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.db.models import ProtectedError

from django.http import FileResponse

from .excel import gerar_excel
from .resumo import montar_resumo_excel

from .models import Audiencia, Conciliadora
from .relatorio import audiencias_do_mes, montar_relatorio
from .serializers import AudienciaSerializer, ConciliadoraSerializer


class ConciliadoraViewSet(viewsets.ModelViewSet):
    queryset = Conciliadora.objects.order_by("nome")
    serializer_class = ConciliadoraSerializer

    def destroy(self, request, *args, **kwargs):
        try:
            return super().destroy(request, *args, **kwargs)
        except ProtectedError:
            return Response(
                {"erro": "Esta conciliadora tem audiências cadastradas e não pode ser excluída."},
                status=409,
            )


class AudienciaViewSet(viewsets.ModelViewSet):
    serializer_class = AudienciaSerializer

    def get_queryset(self):
        consulta = Audiencia.objects.select_related("conciliadora").order_by("data", "id")
        filtros = self.request.query_params
        if filtros.get("ano"):
            consulta = consulta.filter(data__year=filtros["ano"])
        if filtros.get("mes"):
            consulta = consulta.filter(data__month=filtros["mes"])
        if filtros.get("conciliadora"):
            consulta = consulta.filter(conciliadora_id=filtros["conciliadora"])
        return consulta


@api_view(["GET"])
def relatorio(request):
    try:
        ano = int(request.query_params["ano"])
        mes = int(request.query_params["mes"])
        conciliadora = request.query_params.get("conciliadora")
        conciliadora_id = int(conciliadora) if conciliadora else None
    except (KeyError, ValueError):
        return Response({"erro": "Informe ano e mes (números)."}, status=400)

    if not 1 <= mes <= 12:
        return Response({"erro": "mes deve ficar entre 1 e 12."}, status=400)

    return Response(montar_relatorio(audiencias_do_mes(ano, mes, conciliadora_id)))

@api_view(["GET"])
def baixar_excel(request):
    try:
        ano = int(request.query_params["ano"])
        mes = int(request.query_params["mes"])
        sentencas = int(request.query_params.get("sentencas") or 0)
    except (KeyError, ValueError):
        return Response(
            {"erro": "Informe ano e mes (números). Se enviar sentencas, também deve ser número."},
            status=400,
        )

    if not (1 <= mes <= 12 and 1 <= ano <= 9999 and sentencas >= 0):
        return Response({"erro": "Valores fora do intervalo permitido."}, status=400)

    resumo = montar_resumo_excel(audiencias_do_mes(ano, mes))
    arquivo = gerar_excel(resumo, ano, mes, sentencas)
    nome = f"RESUMO - MOV-JUD - AUDIÊNCIAS - {mes:02d}-{ano}.xlsx"
    return FileResponse(
        arquivo,
        as_attachment=True,
        filename=nome,
        content_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    )
import calendar
import random
from datetime import date, timedelta

from django.conf import settings
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand, CommandError

from audiencias.models import Audiencia, Conciliadora
from audiencias.regras import Resultado, Tipo, Vara

PESO_VARA = {"PRE": 35, "JEC": 30}  # as demais varas pesam 17
PESO_RESULTADO = {
    "frutifera": 34,
    "infrutifera": 26,
    "prejudicada_ausencia_requerido": 8,
    "prejudicada_ausencia_partes": 4,
    "cancelada": 10,
    "redesignada": 18,
}


def dias_uteis(ano, mes, ate=None):
    for dia in range(1, calendar.monthrange(ano, mes)[1] + 1):
        d = date(ano, mes, dia)
        if d.weekday() < 5 and (ate is None or d <= ate):
            yield d


class Command(BaseCommand):
    help = "Recria os dados FICTICIOS da demonstracao (so funciona com CEJUSC_DEMO=1)."

    def handle(self, *args, **opcoes):
        if not settings.DEMO:
            raise CommandError("Este comando so roda no modo de demonstracao (CEJUSC_DEMO=1).")

        Audiencia.objects.all().delete()
        Conciliadora.objects.all().delete()

        concs = [
            Conciliadora.objects.create(nome="Conciliadora Exemplo A"),
            Conciliadora.objects.create(nome="Conciliadora Exemplo B"),
        ]

        varas = list(Vara)
        tipos = list(Tipo)
        resultados = list(Resultado)
        pesos_vara = [PESO_VARA.get(v.value, 17) for v in varas]
        pesos_res = [PESO_RESULTADO.get(r.value, 5) for r in resultados]

        hoje = date.today()
        anterior = hoje.replace(day=1) - timedelta(days=1)
        periodos = [(anterior.year, anterior.month, None), (hoje.year, hoje.month, hoje)]

        novas, contador = [], 1
        for ano, mes, ate in periodos:
            dias = list(dias_uteis(ano, mes, ate))
            if not dias:
                continue
            rng = random.Random(f"{ano}-{mes}")  # mesmo mes, mesmos dados
            for _ in range(min(26, len(dias) * 2)):
                vara = rng.choices(varas, pesos_vara)[0]
                dia = rng.choice(dias)
                novas.append(Audiencia(
                    conciliadora=rng.choice(concs),
                    data=dia,
                    # numeros propositalmente invalidos (digito 00): nao existem de verdade
                    processo=f"{contador:07d}-00.{dia.year}.8.26.0000",
                    vara=vara.value,
                    tipo=rng.choice(tipos).value,
                    paga=(vara.value != "JEC") and rng.random() < 0.3,  # JEC nunca e paga
                    resultado=rng.choices(resultados, pesos_res)[0].value,
                ))
                contador += 1
        Audiencia.objects.bulk_create(novas)

        User = get_user_model()
        usuario, _ = User.objects.get_or_create(
            username=settings.DEMO_USUARIO, defaults={"first_name": "Visitante"}
        )
        usuario.set_password(settings.DEMO_SENHA)
        usuario.is_staff = False
        usuario.is_superuser = False
        usuario.save()

        self.stdout.write(f"Demo pronta: {len(novas)} audiencias ficticias.")
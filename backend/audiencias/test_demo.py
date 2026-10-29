import pytest
from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.core.management.base import CommandError

from audiencias.models import Audiencia, Conciliadora


def test_recusa_fora_do_modo_demo(db, settings):
    settings.DEMO = False
    with pytest.raises(CommandError):
        call_command("popular_demo")


def test_popula_dados_ficticios(db, settings):
    settings.DEMO = True
    call_command("popular_demo")
    call_command("popular_demo")  # rodar de novo nao duplica nada
    assert Conciliadora.objects.count() == 2
    assert Audiencia.objects.count() > 10
    assert not Audiencia.objects.filter(vara="JEC", paga=True).exists()
    visitante = get_user_model().objects.get(username=settings.DEMO_USUARIO)
    assert not visitante.is_staff and not visitante.is_superuser
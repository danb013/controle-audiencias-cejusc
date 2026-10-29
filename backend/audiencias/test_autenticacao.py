import pytest
from django.contrib.auth import get_user_model
from django.core.cache import cache
from rest_framework.test import APIClient

ENDPOINTS = [
    "/api/conciliadoras/",
    "/api/audiencias/",
    "/api/relatorio/?ano=2026&mes=8",
    "/api/excel/?ano=2026&mes=8",
]


@pytest.fixture(autouse=True)
def limpar_cache():
    cache.clear()  # zera o contador de tentativas entre os testes


@pytest.fixture
def usuaria(db):
    return get_user_model().objects.create_user("ana", password="senha-forte-123")


def entrar(client, senha):
    return client.post("/api/auth/entrar/", {"usuario": "ana", "senha": senha}, format="json")


@pytest.mark.parametrize("url", ENDPOINTS)
def test_api_exige_login(db, url):
    assert APIClient().get(url).status_code == 403


def test_login_correto_libera_a_api(usuaria):
    client = APIClient()
    resposta = entrar(client, "senha-forte-123")
    assert resposta.status_code == 200
    assert resposta.json()["autenticado"] is True
    assert client.get("/api/conciliadoras/").status_code == 200


def test_senha_errada_nao_entra(usuaria):
    client = APIClient()
    assert entrar(client, "errada").status_code == 401
    assert client.get("/api/conciliadoras/").status_code == 403


def test_bloqueia_apos_varias_tentativas(usuaria):
    client = APIClient()
    for _ in range(5):
        assert entrar(client, "errada").status_code == 401
    # mesmo com a senha certa, fica bloqueado por alguns minutos
    assert entrar(client, "senha-forte-123").status_code == 429


def test_sair_encerra_a_sessao(usuaria):
    client = APIClient()
    entrar(client, "senha-forte-123")
    client.post("/api/auth/sair/")
    assert client.get("/api/conciliadoras/").status_code == 403


def test_sessao_informa_se_esta_logado(usuaria):
    client = APIClient()
    assert client.get("/api/auth/sessao/").json() == {"autenticado": False}
    entrar(client, "senha-forte-123")
    assert client.get("/api/auth/sessao/").json()["usuario"] == "ana"
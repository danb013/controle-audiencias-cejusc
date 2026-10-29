import pytest
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient


@pytest.fixture
def api(db):
    usuario = get_user_model().objects.create_user("teste", password="senha-teste-123")
    cliente = APIClient()
    cliente.force_authenticate(user=usuario)
    return cliente

def audiencia_valida(conciliadora, **extra):
    base = {
        "conciliadora": conciliadora.id,
        "data": "2026-08-10",
        "processo": "0000099-00.2026.8.26.0000",
        "vara": "1a VARA",
        "tipo": "mediacao",
        "paga": False,
        "resultado": "frutifera",
    }
    base.update(extra)
    return base

def test_cadastra_audiencia(api, conciliadora):
    r = api.post("/api/audiencias/", audiencia_valida(conciliadora), format="json")
    assert r.status_code == 201
    assert r.json()["categoria"] == "FAMILIA"


def test_jec_paga_e_recusada(api, conciliadora):
    dados = audiencia_valida(conciliadora, vara="JEC", tipo="conciliacao", paga=True)
    r = api.post("/api/audiencias/", dados, format="json")
    assert r.status_code == 400
    assert "paga" in r.json()


def test_resultado_invalido_e_recusado(api, conciliadora):
    r = api.post("/api/audiencias/", audiencia_valida(conciliadora, resultado="talvez"), format="json")
    assert r.status_code == 400


def test_lista_filtra_por_mes(api, dados):
    r = api.get("/api/audiencias/?ano=2026&mes=8")
    assert len(r.json()) == 4


def test_endpoint_do_relatorio(api, dados):
    r = api.get("/api/relatorio/?ano=2026&mes=8")
    assert r.status_code == 200
    assert r.json()["total_agendadas"] == 4
    assert r.json()["acordos"] == 2


def test_relatorio_sem_parametros(api):
    assert api.get("/api/relatorio/").status_code == 400

def test_edita_audiencia(api, conciliadora):
    criada = api.post("/api/audiencias/", audiencia_valida(conciliadora), format="json").json()
    r = api.put(
        f"/api/audiencias/{criada['id']}/",
        audiencia_valida(conciliadora, resultado="infrutifera"),
        format="json",
    )
    assert r.status_code == 200
    assert r.json()["resultado"] == "infrutifera"


def test_edicao_nao_permite_jec_paga(api, conciliadora):
    criada = api.post("/api/audiencias/", audiencia_valida(conciliadora), format="json").json()
    r = api.put(
        f"/api/audiencias/{criada['id']}/",
        audiencia_valida(conciliadora, vara="JEC", paga=True),
        format="json",
    )
    assert r.status_code == 400


def test_cadastra_e_edita_conciliadora(api, db):
    criada = api.post("/api/conciliadoras/", {"nome": "Maria"}, format="json")
    assert criada.status_code == 201
    r = api.put(f"/api/conciliadoras/{criada.json()['id']}/", {"nome": "Maria Silva"}, format="json")
    assert r.json()["nome"] == "Maria Silva"


def test_nome_duplicado_e_recusado(api, conciliadora):
    r = api.post("/api/conciliadoras/", {"nome": conciliadora.nome}, format="json")
    assert r.status_code == 400


def test_nao_apaga_conciliadora_com_audiencias(api, dados, conciliadora):
    r = api.delete(f"/api/conciliadoras/{conciliadora.id}/")
    assert r.status_code == 409


def test_apaga_conciliadora_sem_audiencias(api, conciliadora):
    r = api.delete(f"/api/conciliadoras/{conciliadora.id}/")
    assert r.status_code == 204
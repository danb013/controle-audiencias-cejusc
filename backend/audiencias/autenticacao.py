import json

from django.conf import settings
from django.contrib.auth import authenticate, login, logout
from django.core.cache import cache
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie
from django.views.decorators.http import require_GET, require_POST

MAX_TENTATIVAS = 5
BLOQUEIO_SEGUNDOS = 300


def _dados_usuario(user):
    return {
        "autenticado": True,
        "usuario": user.get_username(),
        "nome": user.get_full_name() or user.get_username(),
        "demo": settings.DEMO,
    }


def _chave(request, usuario):
    ip = request.META.get("REMOTE_ADDR", "")
    return f"login:{ip}:{usuario.lower()}"


@require_GET
@ensure_csrf_cookie  # garante o cookie CSRF que o React vai reenviar
def sessao(request):
    if request.user.is_authenticated:
        return JsonResponse(_dados_usuario(request.user))
    resposta = {"autenticado": False}
    if settings.DEMO:  # a tela de login mostra o acesso de visitante
        resposta["demo"] = {"usuario": settings.DEMO_USUARIO, "senha": settings.DEMO_SENHA}
    return JsonResponse(resposta)


@require_POST
@csrf_protect
def entrar(request):
    try:
        dados = json.loads(request.body or b"{}")
    except ValueError:
        return JsonResponse({"detail": "Requisição inválida."}, status=400)

    usuario = str(dados.get("usuario", "")).strip()
    senha = str(dados.get("senha", ""))
    chave = _chave(request, usuario)

    # Na demonstração a senha é pública: o bloqueio só atrapalharia os visitantes
    if not settings.DEMO and cache.get(chave, 0) >= MAX_TENTATIVAS:
        return JsonResponse(
            {"detail": "Muitas tentativas. Aguarde 5 minutos e tente de novo."},
            status=429,
        )

    user = authenticate(request, username=usuario, password=senha)
    if user is None:
        if not settings.DEMO:
            cache.set(chave, cache.get(chave, 0) + 1, BLOQUEIO_SEGUNDOS)
        # mesma mensagem para usuário inexistente e senha errada (não revela qual)
        return JsonResponse({"detail": "Usuário ou senha incorretos."}, status=401)

    cache.delete(chave)
    login(request, user)
    return JsonResponse(_dados_usuario(user))


@require_POST
@csrf_protect
def sair(request):
    logout(request)
    return JsonResponse({"autenticado": False})
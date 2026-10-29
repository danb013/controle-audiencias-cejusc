from django.urls import include, path
from rest_framework.routers import DefaultRouter

from . import views
from . import autenticacao

router = DefaultRouter()
router.register("conciliadoras", views.ConciliadoraViewSet, basename="conciliadora")
router.register("audiencias", views.AudienciaViewSet, basename="audiencia")

urlpatterns = [
    path("relatorio/", views.relatorio),
    path("excel/", views.baixar_excel),
    path("", include(router.urls)),
    path("auth/sessao/", autenticacao.sessao),
    path("auth/entrar/", autenticacao.entrar),
    path("auth/sair/", autenticacao.sair),
]
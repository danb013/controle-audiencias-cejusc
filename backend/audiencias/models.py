from django.core.exceptions import ValidationError
from django.db import models

from .regras import Resultado, Tipo, Vara, validar_pagamento


def opcoes(enum):
    return [(item.value, item.name) for item in enum]


class Conciliadora(models.Model):
    nome = models.CharField(max_length=120, unique=True)

    def __str__(self):
        return self.nome


class Audiencia(models.Model):
    conciliadora = models.ForeignKey(
        Conciliadora, on_delete=models.PROTECT, related_name="audiencias"
    )
    data = models.DateField()
    processo = models.CharField(max_length=30)  # não é único: redesignadas repetem
    vara = models.CharField(max_length=10, choices=opcoes(Vara))
    tipo = models.CharField(max_length=20, choices=opcoes(Tipo))
    paga = models.BooleanField(default=False)
    resultado = models.CharField(max_length=40, choices=opcoes(Resultado))

    def clean(self):
        try:
            validar_pagamento(Vara(self.vara), self.paga)
        except ValueError as erro:
            raise ValidationError(str(erro))

    def __str__(self):
        return f"{self.data} - {self.processo}"
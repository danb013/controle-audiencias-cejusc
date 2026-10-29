from rest_framework import serializers

from .models import Audiencia, Conciliadora
from .regras import Tipo, Vara, classificar, validar_pagamento


class ConciliadoraSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conciliadora
        fields = ["id", "nome"]


class AudienciaSerializer(serializers.ModelSerializer):
    conciliadora_nome = serializers.CharField(source="conciliadora.nome", read_only=True)
    categoria = serializers.SerializerMethodField()

    class Meta:
        model = Audiencia
        fields = [
            "id", "conciliadora", "conciliadora_nome", "data", "processo",
            "vara", "tipo", "paga", "resultado", "categoria",
        ]

    def get_categoria(self, obj):
        return classificar(Vara(obj.vara), Tipo(obj.tipo))

    def validate(self, dados):
        # Na edição parcial, pega o que não veio da audiência já salva.
        vara = dados.get("vara", getattr(self.instance, "vara", None))
        paga = dados.get("paga", getattr(self.instance, "paga", False))
        try:
            validar_pagamento(Vara(vara), paga)
        except ValueError as erro:
            raise serializers.ValidationError({"paga": str(erro)})
        return dados
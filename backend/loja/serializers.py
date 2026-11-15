from rest_framework import serializers
from .models import Produto, PecaReparo, TaxaCartao, ConfigLoja


def _s(m):
    class S(serializers.ModelSerializer):
        class Meta:
            model = m
            fields = '__all__'
    return S


ProdutoSerializer = _s(Produto)
PecaSerializer = _s(PecaReparo)
TaxaSerializer = _s(TaxaCartao)
ConfigSerializer = _s(ConfigLoja)

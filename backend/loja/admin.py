from django.contrib import admin
from .models import Produto, PecaReparo, TaxaCartao, ConfigLoja

admin.site.register([Produto, PecaReparo, TaxaCartao, ConfigLoja])

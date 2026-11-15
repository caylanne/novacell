from django.core.management.base import BaseCommand
from loja.models import Produto, PecaReparo, TaxaCartao, ConfigLoja


class Command(BaseCommand):
    help = 'Cria dados de exemplo (valores fictícios: ajuste no app ou no /admin)'

    def handle(self, *a, **kw):
        ConfigLoja.objects.get_or_create(pk=1)
        for n in range(1, 13):  # TAXAS DE EXEMPLO: troque pelas do seu contrato Mercado Pago
            TaxaCartao.objects.get_or_create(parcelas=n, defaults={'taxa': round(4.5 + (n - 1) * 1.1, 2)})
        if not Produto.objects.exists():
            Produto.objects.create(nome='iPhone 15 128GB', marca='apple', condicao='novo', armazenamento='128GB', cor='Preto', preco=4799, destaque=True, descricao='Lacrado, 1 ano de garantia.')
            Produto.objects.create(nome='Xiaomi Redmi Note 13', marca='xiaomi', condicao='novo', armazenamento='256GB', cor='Azul', preco=1399, destaque=True, descricao='Lacrado, com nota fiscal.')
            Produto.objects.create(nome='iPhone 13 128GB', marca='apple', condicao='seminovo', armazenamento='128GB', cor='Meia-noite', bateria=91, preco=2899, destaque=True, descricao='Revisado, com garantia da loja.')
        if not PecaReparo.objects.exists():
            for m, mo, p, v in [('samsung', 'Galaxy A15', 'Tela', 280), ('motorola', 'Moto G24', 'Bateria', 120), ('xiaomi', 'Redmi Note 12', 'Tela', 260), ('apple', 'iPhone 11', 'Bateria', 220)]:
                PecaReparo.objects.create(marca=m, modelo=mo, peca=p, preco=v)
        self.stdout.write('Dados de exemplo criados.')

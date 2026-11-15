from django.db import models


class Produto(models.Model):
    MARCAS = [('apple', 'Apple'), ('xiaomi', 'Xiaomi')]
    CONDICOES = [('novo', 'Novo'), ('seminovo', 'Seminovo')]
    nome = models.CharField(max_length=120)
    marca = models.CharField(max_length=20, choices=MARCAS)
    condicao = models.CharField(max_length=10, choices=CONDICOES, default='novo')
    armazenamento = models.CharField(max_length=20, blank=True)
    cor = models.CharField(max_length=30, blank=True)
    bateria = models.PositiveSmallIntegerField(null=True, blank=True, help_text='Saúde da bateria em % (seminovos)')
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    descricao = models.TextField(blank=True)
    imagem = models.URLField(blank=True)
    destaque = models.BooleanField(default=False)
    ativo = models.BooleanField(default=True)
    atualizado = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-destaque', 'nome']

    def __str__(self):
        return f'{self.nome} ({self.condicao})'


class PecaReparo(models.Model):
    MARCAS = [('samsung', 'Samsung'), ('motorola', 'Motorola'), ('xiaomi', 'Xiaomi'), ('apple', 'Apple')]
    marca = models.CharField(max_length=20, choices=MARCAS)
    modelo = models.CharField(max_length=80)
    peca = models.CharField(max_length=60, help_text='Ex.: Tela, Bateria, Conector de carga')
    preco = models.DecimalField(max_digits=10, decimal_places=2)
    disponivel = models.BooleanField(default=True)

    class Meta:
        ordering = ['marca', 'modelo', 'peca']

    def __str__(self):
        return f'{self.marca} {self.modelo} - {self.peca}'


class TaxaCartao(models.Model):
    parcelas = models.PositiveSmallIntegerField(unique=True)
    taxa = models.DecimalField(max_digits=5, decimal_places=2, help_text='% cobrado pelo Mercado Pago nessa parcela')

    class Meta:
        ordering = ['parcelas']

    def __str__(self):
        return f'{self.parcelas}x - {self.taxa}%'


class ConfigLoja(models.Model):
    whatsapp = models.CharField(max_length=20, default='5583981405953', help_text='Só números, com 55 + DDD')
    telefone = models.CharField(max_length=30, default='(83) 981405953')
    endereco = models.CharField(max_length=200, default='Rua Bossuet Wanderley, 53 - Centro, Patos - PB')
    horario = models.CharField(max_length=120, default='Seg a Sex, 8h às 18h, Sáb 8h às 12h')

    def __str__(self):
        return 'Dados da loja'

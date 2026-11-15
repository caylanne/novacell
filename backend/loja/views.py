from decimal import Decimal, ROUND_HALF_UP

from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import viewsets, permissions
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Produto, PecaReparo, TaxaCartao, ConfigLoja
from .serializers import ProdutoSerializer, PecaSerializer, TaxaSerializer, ConfigSerializer


class StaffEdita(permissions.BasePermission):
    """Qualquer pessoa lê; só a equipe (is_staff) cria, altera e apaga."""
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS or bool(request.user and request.user.is_staff)


class ProdutoViewSet(viewsets.ModelViewSet):
    serializer_class = ProdutoSerializer
    permission_classes = [StaffEdita]

    def get_queryset(self):
        qs = Produto.objects.all()
        if not (self.request.user and self.request.user.is_staff):
            qs = qs.filter(ativo=True)
        p = self.request.query_params
        for campo in ('condicao', 'marca'):
            if p.get(campo):
                qs = qs.filter(**{campo: p[campo]})
        if p.get('q'):
            qs = qs.filter(nome__icontains=p['q'])
        if p.get('destaque'):
            qs = qs.filter(destaque=True)
        return qs


class PecaViewSet(viewsets.ModelViewSet):
    serializer_class = PecaSerializer
    permission_classes = [StaffEdita]

    def get_queryset(self):
        p = self.request.query_params
        qs = PecaReparo.objects.all()
        if p.get('marca'):
            qs = qs.filter(marca=p['marca'])
        if p.get('q'):
            qs = qs.filter(modelo__icontains=p['q'])
        return qs


class TaxaViewSet(viewsets.ModelViewSet):
    queryset = TaxaCartao.objects.all()
    serializer_class = TaxaSerializer
    permission_classes = [StaffEdita]


@api_view(['GET', 'PUT'])
@permission_classes([StaffEdita])
def config(request):
    c = ConfigLoja.objects.get_or_create(pk=1)[0]
    if request.method == 'PUT':
        s = ConfigSerializer(c, data=request.data)
        s.is_valid(raise_exception=True)
        s.save()
        return Response(s.data)
    return Response(ConfigSerializer(c).data)


@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def simulacao(request):
    """O cliente paga a taxa: total = valor / (1 - taxa%)."""
    try:
        valor = Decimal(request.query_params.get('valor', '0').replace(',', '.'))
    except Exception:
        valor = Decimal(0)
    q, out = Decimal('0.01'), []
    if valor > 0:
        for t in TaxaCartao.objects.all():
            total = (valor / (1 - t.taxa / 100)).quantize(q, ROUND_HALF_UP)
            out.append({'parcelas': t.parcelas, 'taxa': t.taxa, 'total': total,
                        'parcela': (total / t.parcelas).quantize(q, ROUND_HALF_UP)})
    return Response(out)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login(request):
    u = authenticate(username=request.data.get('username'), password=request.data.get('password'))
    if not u:
        return Response({'detail': 'Usuário ou senha inválidos.'}, status=400)
    t, _ = Token.objects.get_or_create(user=u)
    return Response({'token': t.key, 'username': u.username, 'is_staff': u.is_staff})


@api_view(['POST'])
@permission_classes([permissions.IsAdminUser])
def registrar(request):
    """Só quem já é da equipe consegue cadastrar uma nova conta de equipe."""
    un, pw = request.data.get('username'), request.data.get('password')
    if not un or not pw or len(pw) < 6:
        return Response({'detail': 'Informe usuário e senha (mínimo 6 caracteres).'}, status=400)
    if User.objects.filter(username=un).exists():
        return Response({'detail': 'Esse usuário já existe.'}, status=400)
    User.objects.create_user(un, password=pw, is_staff=True)
    return Response({'ok': True}, status=201)

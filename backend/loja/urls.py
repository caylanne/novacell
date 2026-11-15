from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

r = DefaultRouter()
r.register('produtos', views.ProdutoViewSet, basename='produto')
r.register('pecas', views.PecaViewSet, basename='peca')
r.register('taxas', views.TaxaViewSet, basename='taxa')

urlpatterns = [
    path('', include(r.urls)),
    path('config/', views.config),
    path('simulacao/', views.simulacao),
    path('auth/login/', views.login),
    path('auth/registrar/', views.registrar),
]

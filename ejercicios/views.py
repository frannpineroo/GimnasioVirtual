from django.shortcuts import render
from rest_framework import viewsets
from .models import Ejercicio
from .serializers import EjercicioSerializer

class EjercicioViewSet(viewsets.ModelViewSet):
    queryset = Ejercicio.objects.all()
    serializer_class = EjercicioSerializer
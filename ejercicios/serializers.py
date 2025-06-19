from rest_framework import serializers
from .models import Ejercicio

class EjercicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ejercicio
        fields = '__all__'
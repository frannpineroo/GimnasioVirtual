from django.shortcuts import render
from rest_framework import viewsets
from .models import Exercise
from .serializers import ExerciseSerializer
from .models import User
from .serializers import UserSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

def index(request):
    total_exercises = Exercise.objects.count()
    return render(request, 'index.html', {'total_exercises': total_exercises})

def exercise_page(request):
    return render(request, 'ejercicios.html')

def new_exercise(request):
    return render(request, 'nuevo-ejercicio.html')

def user_page(request):
    return render(request, 'usuario.html')
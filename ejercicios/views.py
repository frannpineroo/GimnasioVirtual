from django.shortcuts import render
from rest_framework import viewsets
from .models import Exercise
from .serializers import ExerciseSerializer

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

def index(request):
    total_exercises = Exercise.objects.count()
    return render(request, 'index.html', {'total_exercises': total_exercises})

def exercise_page(request):
    return render(request, 'ejercicios.html')

def new_exercise(request):
    return render(request, 'nuevo-ejercicio.html')
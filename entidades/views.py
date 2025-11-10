from django.shortcuts import render
from .models import Exercise


def index(request):
    total_exercises = Exercise.objects.count()
    return render(request, 'index.html', {'total_exercises': total_exercises})

def exercise_page(request):
    return render(request, 'ejercicios.html')

def new_exercise(request):
    return render(request, 'nuevo-ejercicio.html')
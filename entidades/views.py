from django.shortcuts import render
from .models import Exercise


def index(request):
    total_exercises = Exercise.objects.count()
    return render(request, 'index.html', {'total_exercises': total_exercises})

def exercise_page(request):
    return render(request, 'ejercicios.html')

def new_exercise(request):
    return render(request, 'nuevo-ejercicio.html')

def client_page(request):
    return render(request, 'clientes.html')

def new_client(request):
    return render(request, 'nuevo-cliente.html')

def routine_page(request):
    return render(request, 'rutinas.html')

def new_routine(request):
    return render(request, 'nueva-rutina.html')

def equipment_page(request):
    return render(request, 'equipos.html')

def new_equipment(request):
    return render(request, 'nuevo-equipo.html')
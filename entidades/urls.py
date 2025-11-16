from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import api_views, views  

router = DefaultRouter()
router.register(r'ejercicios', api_views.ExerciseViewSet)
router.register(r'entrenadores', api_views.CoachViewSet)
router.register(r'clientes', api_views.ClientViewSet)
router.register(r'asignaturas', api_views.AsignatureViewSet)
router.register(r'recordatorios', api_views.ReminderViewSet)
router.register(r'sesiones-entrenamiento', api_views.TrainingSessionViewSet)
router.register(r'rutinas', api_views.RutineViewSet)
router.register(r'dias-rutina', api_views.DayRutineViewSet)
router.register(r'ejercicios-rutina', api_views.ExerciseRutineViewSet)
router.register(r'registros-progreso', api_views.ProgressRegisterViewSet)
router.register(r'equipos', api_views.EquipmentViewSet)

urlpatterns = [
    path('clientes/active/', api_views.active_clients, name='active_clients'),
    path('clientes/', views.client_page, name='entrenador_clientes'),
    path('nuevo-cliente/', views.new_client, name='entrenador_nuevo_cliente'),
    path('ejercicios/', views.exercise_page, name='entrenador_ejercicios'),
    path('nuevo-ejercicio/', views.new_exercise, name='entrenador_nuevo_ejercicio'),
    path('rutinas/', views.routine_page, name='entrenador_rutinas'),
    path('nueva-rutina/', views.new_routine, name='entrenador_nueva_rutina'),
    path('equipos/', views.equipment_page, name='entrenador_equipos'),
    path('nuevo-equipo/', views.new_equipment, name='entrenador_nuevo_equipo'),
    
    path('', include(router.urls))
]
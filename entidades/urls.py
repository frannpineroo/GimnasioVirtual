from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import (
    ExerciseViewSet, UserViewSet, CoachViewSet, ClientViewSet, AsignatureViewSet, ReminderViewSet, TrainingSessionViewSet, RutineViewSet, DayRutineViewSet, ExerciseRutineViewSet, ProgressRegisterViewSet, EquipementViewSet, MuscleGroupViewSet
)


router = DefaultRouter()
router.register(r'ejercicios', ExerciseViewSet)
router.register(r'usuarios', UserViewSet)
router.register(r'entrenadores', CoachViewSet)
router.register(r'clientes', ClientViewSet)
router.register(r'asignaturas', AsignatureViewSet)
router.register(r'recordatorios', ReminderViewSet)
router.register(r'sesiones-entrenamiento', TrainingSessionViewSet)
router.register(r'rutinas', RutineViewSet)
router.register(r'dias-rutina', DayRutineViewSet)
router.register(r'ejercicios-rutina', ExerciseRutineViewSet)
router.register(r'registros-progreso', ProgressRegisterViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

# urlpatterns = [
#     path('', include(router.urls)),
#     path('inicio/', views.index, name='index'),
#     path('ejercicios/', views.exercise_page, name='exercise_page'),
#     path('nuevo/', views.new_exercise, name='new_exercise'),
#     path('usuario/', views.user_page, name='user_page'),
# ]

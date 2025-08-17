from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import EjercicioViewSet, UserViewSet
from . import views

router = DefaultRouter()
router.register(r'entidades', EjercicioViewSet)
router.register(r'usuarios', UserViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

urlpatterns = [
    path('', include(router.urls)),
    path('inicio/', views.index, name='index'),
    path('ejercicios/', views.exercise_page, name='exercise_page'),
    path('nuevo/', views.new_exercise, name='new_exercise'),
    path('usuario/', views.user_page, name='user_page'),
]

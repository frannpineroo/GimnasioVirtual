"""
URL configuration for gym_backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from ejercicios import views as ejercicio_views
from rest_framework.routers import DefaultRouter
from ejercicios.views import EjercicioViewSet

router = DefaultRouter()
router.registrer(r'ejercicios', EjercicioViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),
    #Vistas tradicionales
    path('', ejercicio_views.index, name='index'),
    path('ejercicios/', ejercicio_views.lista_ejercicios, name='ejercicios'),
    path('nuevo-ejercicio/', ejercicio_views.nuevo_ejercicio, name='nuevo_ejercicio'),

    #API REST
    path('api/', include(router.urls)),
]

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
from ejercicios import views as exercise_views
from rest_framework.routers import DefaultRouter
from ejercicios.views import ExerciseViewSet
from django.conf import settings
from django.conf.urls.static import static

router = DefaultRouter()
router.register(r'ejercicios', ExerciseViewSet)

urlpatterns = [
    path('', exercise_views.index, name='index'),
    path('admin/', admin.site.urls),
    path('ejercicios.html', exercise_views.exercise_page, name='ejercicios'),
    path('nuevo-ejercicio.html', exercise_views.new_exercise, name='nuevo_ejercicio'),
    #API REST
    path('api/', include(router.urls)),
]

urlpatterns += static(settings.STATIC_URL, document_root=settings.STATICFILES_DIRS[0])

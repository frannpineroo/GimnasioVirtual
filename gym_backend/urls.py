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
from django.views.generic import TemplateView
from django.conf import settings
from django.conf.urls.static import static
from django.views.decorators.cache import never_cache
from django.shortcuts import render

# Vista personalizada para el login que usa las rutas correctas de static
def login_view(request):
    return render(request, 'acceso/index.html')

# Vista para la página principal (entrenador)
def home_view(request):
    return render(request, 'entrenador/index.html')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('entidades.urls')),
    
    # CAMBIO: Ahora la raíz apunta al dashboard del entrenador
    path('', home_view, name='home'),
    
    # El login queda en /login/
    path('login/', login_view, name='login'),
    
    # Rutas principales
    path('cliente/', TemplateView.as_view(template_name='cliente/index.html'), name='cliente_dashboard'),
    path('entrenador/', TemplateView.as_view(template_name='entrenador/index.html'), name='entrenador_dashboard'),
    
    # Rutas del entrenador
    path('entrenador/clientes/', TemplateView.as_view(template_name='entrenador/clientes.html'), name='entrenador_clientes'),
    path('entrenador/ejercicios/', TemplateView.as_view(template_name='entrenador/ejercicios.html'), name='entrenador_ejercicios'),
    path('entrenador/rutinas/', TemplateView.as_view(template_name='entrenador/rutinas.html'), name='entrenador_rutinas'),
    path('entrenador/equipos/', TemplateView.as_view(template_name='entrenador/equipos.html'), name='entrenador_equipos'),
    path('entrenador/entrenadores/', TemplateView.as_view(template_name='entrenador/entrenadores.html'), name='entrenador_entrenadores'),
    path('entrenador/nuevo-ejercicio/', TemplateView.as_view(template_name='entrenador/nuevo_ejercicio.html'), name='entrenador_nuevo_ejercicio'),
    
    # Ruta para servir el CSS y JS directamente (como respaldo)
    path('static/<path:path>', never_cache(TemplateView.as_view(template_name='../static/'))),
]

# Servir archivos estáticos en desarrollo
if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
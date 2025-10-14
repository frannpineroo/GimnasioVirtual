from rest_framework import viewsets
from .serializers import ExerciseSerializer, UserSerializer, CoachSerializer, ClientSerializer, AsignatureSerializer, ReminderSerializer, TrainingSessionSerializer, RutineSerializer, DayRutineSerializer, ExerciseRutineSerializer, ProgressRegisterSerializer, ElementSerializer
from .models import Exercise, User, Coach, Client, Asignature, Reminder, TrainingSession, Rutine, DayRutine, ExerciseRutine, ProgressRegister, Element

class ExerciseViewSet(viewsets.ModelViewSet):
    queryset = Exercise.objects.all()
    serializer_class = ExerciseSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class CoachViewSet(viewsets.ModelViewSet):
    queryset = Coach.objects.all()
    serializer_class = CoachSerializer

class ClientViewSet(viewsets.ModelViewSet):
    queryset = Client.objects.all()
    serializer_class = ClientSerializer

class AsignatureViewSet(viewsets.ModelViewSet):
    queryset = Asignature.objects.all()
    serializer_class = AsignatureSerializer

class ReminderViewSet(viewsets.ModelViewSet):
    queryset = Reminder.objects.all()
    serializer_class = ReminderSerializer

class TrainingSessionViewSet(viewsets.ModelViewSet):
    queryset = TrainingSession.objects.all()
    serializer_class = TrainingSessionSerializer

class RutineViewSet(viewsets.ModelViewSet):
    queryset = Rutine.objects.all()
    serializer_class = RutineSerializer

class DayRutineViewSet(viewsets.ModelViewSet):
    queryset = DayRutine.objects.all()
    serializer_class = DayRutineSerializer

class ExerciseRutineViewSet(viewsets.ModelViewSet):
    queryset = ExerciseRutine.objects.all()
    serializer_class = ExerciseRutineSerializer

class ProgressRegisterViewSet(viewsets.ModelViewSet):
    queryset = ProgressRegister.objects.all()
    serializer_class = ProgressRegisterSerializer

class ElementViewSet(viewsets.ModelViewSet):
    queryset = Element.objects.all()
    serializer_class = ElementSerializer
from rest_framework import serializers
from .models import Exercise, User, Coach, Client,  Asignature, Reminder, TrainingSession, Rutine, DayRutine, ExerciseRutine, ProgressRegister, Equipement, MuscleGroup

class ExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = ['id', 'name', 'muscle_group', 'equipment', 'description']

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class CoachSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coach
        fields = '__all__'

class ClientSerializer(serializers.ModelSerializer):
    class Meta:
        model = Client
        fields = '__all__'

class AsignatureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignature
        fields = '__all__'

class ReminderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reminder
        fields = '__all__'

class TrainingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrainingSession
        fields = '__all__'

class RutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rutine
        fields = '__all__'

class DayRutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = DayRutine
        fields = '__all__'

class ExerciseRutineSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExerciseRutine
        fields = '__all__'

class ProgressRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgressRegister
        fields = '__all__'

class EquipementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipement
        fields = '__all__'

class MuscleGroupSerializer(serializers.ModelSerializer):   
    class Meta:
        model = MuscleGroup
        fields = '__all__'
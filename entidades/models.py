from django.db import models

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    muscle_group = models.CharField(max_length=50)
    equipment = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    equipment = models.ManyToManyField('Equipement', related_name='exercises', blank=True)
    muscle_groups = models.ManyToManyField('MuscleGroup', related_name='exercises', blank=True)

class User(models.Model):
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    dni = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    rol = models.CharField(max_length=50)
    active = models.BooleanField(default=True)

class Coach(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach')

class Client(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='client')
    experience_level = models.CharField(max_length=50, choices=[
        ('beginner', 'Beginner'),
        ('intermediate', 'Intermediate'),
        ('advanced', 'Advanced')
    ])
    goal = models.CharField(max_length=100, blank=True, null=True)
    injuries = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=50, choices=[
        ('active', 'Active'),
        ('inactive', 'Inactive')
    ], default='active')

class Asignature(models.Model):
    start_date = models.CharField(max_length=255)
    end_date = models.CharField(max_length=255)
    active = models.BooleanField(default=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='asignatures')
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='asignatures')

class Reminder(models.Model):
    datetime_reminder = models.DateTimeField()
    sent = models.CharField(max_length=10, choices=[
        ('yes', 'Yes'),
        ('no', 'No')
    ], default='no')
    asignature = models.ForeignKey(Asignature, on_delete=models.CASCADE, related_name='reminders')

class TrainingSession(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    notes = models.CharField(max_length=45)
    reminder = models.ForeignKey(Reminder, on_delete=models.CASCADE, related_name='training_sessions')

class Rutine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    time_week = models.PositiveBigIntegerField()
    is_template = models.BooleanField(max_length=45)
    time_creation = models.DateTimeField(auto_now_add=True)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='routines')

class DayRutine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.CharField(max_length=45)
    rutine = models.ForeignKey(Rutine, on_delete=models.CASCADE, related_name='day_routines')

class ExerciseRutine(models.Model):
    series = models.CharField(max_length=45)
    repetitions = models.CharField(max_length=255)
    tipe_serie = models.CharField(max_length=45, choices=[
        ('normal', 'Normal'),
        ('drop_set', 'Drop Set'),
        ('superset', 'Superset'),
        ('giant_set', 'Giant Set')
    ])
    dia_rutine = models.ForeignKey(DayRutine, on_delete=models.CASCADE, related_name='exercise_routines')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_routines')

class ProgressRegister(models.Model):
    body_weight = models.CharField(255, blank=True, null=True)
    weight_used = models.CharField(max_length=255, blank=True, null=True)
    repetitions_made = models.CharField(max_length=255, blank=True, null=True)
    rm_value = models.CharField(max_length=255, blank=True, null=True)
    session = models.ForeignKey(TrainingSession, on_delete=models.CASCADE, related_name='progress_registers')
    rutine_exercise = models.ForeignKey(ExerciseRutine, on_delete=models.CASCADE, related_name='progress_registers')

class Equipement(models.Model):
    name = models.CharField(max_length=100)

class MuscleGroup(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name



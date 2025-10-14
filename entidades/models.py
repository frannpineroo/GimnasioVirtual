from django.db import models

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    equipment = models.TextField(max_length=255, blank=True, null=True)
    muscle_group = models.TextField(max_length=255, blank=True, null=True)
    
    def __str__(self):
        return self.name

class User(models.Model):
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    dni = models.CharField(max_length=20, unique=True)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    rol = models.CharField(max_length=50)
    active = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.name} {self.last_name}"

class Coach(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='coach')
    
    def __str__(self):
        return f"Coach: {self.user.name} {self.user.last_name}"

class Client(models.Model):
    name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    dni = models.CharField(max_length=20, unique=True, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
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
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)   
    
    def __str__(self):
        return f"{self.name} {self.last_name}"
    class Meta:
        ordering = ['-created_at']

class Asignature(models.Model):
    start_date = models.DateField()
    end_date = models.DateField()
    active = models.BooleanField(default=True)
    client = models.ForeignKey(Client, on_delete=models.CASCADE, related_name='asignatures')
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='asignatures')
    
    def __str__(self):
        return f"Asignatura: {self.client} - {self.coach}"

class Reminder(models.Model):
    datetime_reminder = models.DateTimeField()
    sent = models.CharField(max_length=10, choices=[
        ('yes', 'Yes'),
        ('no', 'No')
    ], default='no')
    asignature = models.ForeignKey(Asignature, on_delete=models.CASCADE, related_name='reminders')
    
    def __str__(self):
        return f"Reminder: {self.datetime_reminder}"

class TrainingSession(models.Model):
    create_time = models.DateTimeField(auto_now_add=True)
    notes = models.CharField(max_length=45)
    reminder = models.ForeignKey(Reminder, on_delete=models.CASCADE, related_name='training_sessions')
    
    def __str__(self):
        return f"Session: {self.create_time}"

class Rutine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    time_week = models.PositiveBigIntegerField()
    is_template = models.BooleanField(default=False)
    time_creation = models.DateTimeField(auto_now_add=True)
    coach = models.ForeignKey(Coach, on_delete=models.CASCADE, related_name='routines')
    
    def __str__(self):
        return self.name

class DayRutine(models.Model):
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    order = models.CharField(max_length=45)
    rutine = models.ForeignKey(Rutine, on_delete=models.CASCADE, related_name='day_routines')
    
    def __str__(self):
        return f"{self.name} - {self.rutine.name}"

class ExerciseRutine(models.Model):
    series = models.CharField(max_length=45)
    repetitions = models.CharField(max_length=255)
    type_serie = models.CharField(max_length=45, choices=[
        ('normal', 'Normal'),
        ('drop_set', 'Drop Set'),
        ('superset', 'Superset'),
        ('giant_set', 'Giant Set')
    ])
    dia_rutine = models.ForeignKey(DayRutine, on_delete=models.CASCADE, related_name='exercise_routines')
    exercise = models.ForeignKey(Exercise, on_delete=models.CASCADE, related_name='exercise_routines')
    
    def __str__(self):
        return f"{self.exercise.name} - {self.dia_rutine.name}"

class ProgressRegister(models.Model):
    body_weight = models.CharField(max_length=255, blank=True, null=True)
    weight_used = models.CharField(max_length=255, blank=True, null=True)
    repetitions_made = models.CharField(max_length=255, blank=True, null=True)
    rm_value = models.CharField(max_length=255, blank=True, null=True)
    session = models.ForeignKey(TrainingSession, on_delete=models.CASCADE, related_name='progress_registers')
    rutine_exercise = models.ForeignKey(ExerciseRutine, on_delete=models.CASCADE, related_name='progress_registers')

    def __str__(self):
        return f"Progress: {self.session} - {self.rutine_exercise}"

from django.db import models

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    category = models.CharField(max_length=50)
    model = models.CharField(max_length=50, blank=True, null=True)
    status = models.CharField(max_length=50, choices=[
        ('available', 'Available'),
        ('in_maintenance', 'In Maintenance'),
        ('out_of_order', 'Out of Order')
        ])
    purchase_date = models.DateField(blank=True, null=True)
    condition = models.CharField(max_length=20, choices=[
        ('new', 'New'),
        ('good', 'Good'),
        ('fair', 'Fair'),
        ('poor', 'Poor')
    ])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name


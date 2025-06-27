from django.db import models

class Exercise(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    muscle_group = models.CharField(max_length=50)
    equipment = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name



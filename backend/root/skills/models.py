from django.db import models


# Create your models here.
class Skills(models.Model):
    skill = models.CharField(max_length=50, unique=True)

    def __str__(self) -> str:
        return self.skill

    def save(self, *args, **kwargs):
        if self.skill:
            self.skill = self.skill.lower()
        super().save(*args, **kwargs)

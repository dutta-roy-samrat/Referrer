from django.db import models
from skills.models import Skills
from users.models import User


# Create your models here.
class Post(models.Model):
    company_name = models.CharField(max_length=150, blank=False, null=False)
    job_title = models.CharField(max_length=150, blank=False, null=False)
    job_description = models.TextField(blank=False, null=False)
    experience = models.PositiveIntegerField(
        blank=False, null=False, verbose_name="Experience in years"
    )
    salary = models.PositiveIntegerField(
        blank=False, null=False, verbose_name="Salary in LPA"
    )
    expiry_date = models.DateField(blank=False, null=False)
    location = models.CharField(max_length=150, blank=False, null=False)
    skills = models.ManyToManyField(
        Skills,
        related_name="skills",
    )
    posted_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="posted")
    applied_by = models.ManyToManyField(User, related_name="applied_to", blank=True)

    def __str__(self):
        return f"{self.job_title}-{self.company_name}"

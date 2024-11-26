from django.contrib import admin
from .models import CustomUserModel


# Register your models here.
class CustomUserAdmin(admin.ModelAdmin):
    fields = [
        "first_name",
        "last_name",
        "email",
        "experience",
        "profile_image",
        "resume",
    ]
    list_display = [
        "first_name",
        "last_name",
        "email",
        "experience",
        "profile_image",
        "resume",
        "created_at",
        "updated_at",
    ]

    search_fields = [
        "first_name",
        "last_name",
        "email",
        "experience",
        "created_at",
        "updated_at",
    ]


admin.site.register(CustomUserModel, CustomUserAdmin)

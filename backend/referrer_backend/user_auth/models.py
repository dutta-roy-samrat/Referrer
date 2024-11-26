from django.db import models
from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import (
    AbstractBaseUser,
    PermissionsMixin,
    BaseUserManager,
)
from django.utils.translation import gettext_lazy as _


# helpers
def user_profile_image_path(instance, filename):
    return f"user_{instance.id}/profile_images/{filename}"


def user_resume_path(instance, filename):
    return f"user_{instance.id}/resumes/{filename}"


class CustomBaseUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, email, password, **extra_fields):
        if not email:
            raise ValueError("The given email must be set")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email=None, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")

        return self._create_user(email, password, **extra_fields)


# models
class CustomUserModel(AbstractBaseUser, PermissionsMixin):
    last_login = None
    first_name = models.CharField(max_length=150, blank=False, null=False)
    last_name = models.CharField(max_length=150, blank=False, null=False)
    email = models.EmailField(unique=True, max_length=254, blank=False, null=False)
    experience = models.PositiveIntegerField(blank=True, null=True)
    profile_image = models.ImageField(
        upload_to=user_profile_image_path, blank=True, null=True
    )
    resume = models.FileField(upload_to=user_resume_path, blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=_("Designates whether the user can log into this admin site."),
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=_(
            "Designates whether this user should be treated as active. "
            "Unselect this instead of deleting accounts."
        ),
    )

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = ["first_name", "last_name"]

    objects = CustomBaseUserManager()

    def __str__(self):
        return f"{self.first_name} {self.last_name}"

"""
URL configuration for root project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
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

from django.urls import path
from django.contrib.auth.views import (
    PasswordResetDoneView,
    PasswordResetCompleteView,
)
from .views import (
    RegisterView,
    LoginView,
    CustomPasswordResetView,
    CustomPasswordResetConfirmView,
    UpdateUserView,
    LogoutView,
    check_refresh_token_validation,
)

urlpatterns = [
    path("register/", RegisterView.as_view()),
    path("update-details/", UpdateUserView.as_view()),
    path("login/", LoginView.as_view()),
    path("authorization-check/", check_refresh_token_validation),
    path("password-reset/", CustomPasswordResetView.as_view(), name="password-reset"),
    path(
        "password-reset/done/",
        PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        CustomPasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "password-reset-complete/",
        PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path("logout/", LogoutView.as_view()),
]

from django.urls import path

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.contrib.auth.views import (
    PasswordResetDoneView,
    PasswordResetConfirmView,
    PasswordResetCompleteView,
)
from .views import UserInforView, CustomPasswordResetView, LogoutView

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("sign-up/", UserInforView.as_view()),
    path("check-auth/", UserInforView.as_view()),
    path("password-reset/", CustomPasswordResetView.as_view(), name="password-reset"),
    path(
        "password-reset/done/",
        PasswordResetDoneView.as_view(),
        name="password_reset_done",
    ),
    path(
        "password-reset-confirm/<uidb64>/<token>/",
        PasswordResetConfirmView.as_view(),
        name="password_reset_confirm",
    ),
    path(
        "password-reset-complete/",
        PasswordResetCompleteView.as_view(),
        name="password_reset_complete",
    ),
    path("logout/", LogoutView.as_view()),
]

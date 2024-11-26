# from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_201_CREATED
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from .serializers import UserSignUpSerializer, UserInfoSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.forms import PasswordResetForm, _unicode_ci_compare
from django.contrib.auth.views import PasswordResetView
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.tokens import default_token_generator
from rest_framework_simplejwt.tokens import AccessToken
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from datetime import datetime
from rest_framework.permissions import IsAuthenticated

UserModel = get_user_model()


@method_decorator(csrf_exempt, name="dispatch")
class UserInforView(APIView):
    def get(self, request, *args, **kwargs):
        auth_tokens = {
            "access": request.COOKIES.get("access"),
            "refresh": request.COOKIES.get("refresh"),
        }
        print(auth_tokens, "kkl",auth_tokens.get("refresh"))
        try:
            if auth_tokens.get("access"):
                print(auth_tokens["access"])
                decoded_token = AccessToken(auth_tokens["access"])
                user_id = decoded_token.get("user_id")
                print(user_id)
                user_instance = UserModel.objects.get(id=user_id)
                user_data = UserInfoSerializer(user_instance).data
                return Response(
                    {
                        "message": "Access token is valid",
                        "payload": user_data,
                        "is_authenticated": True,
                    }
                )

            elif auth_tokens.get("refresh"):
                decoded_token = RefreshToken(auth_tokens["refresh"])
                access_token = decoded_token.access_token
                response = Response(
                    {
                        "message": "Access token refreshed",
                        "new_access_token": str(access_token),
                        "is_authenticated": True,
                    },
                )
                response.set_cookie(
                    key="access",
                    value=str(access_token),
                    httponly=True,
                    secure=False,  # Set True in production
                    samesite="Strict",
                    max_age=60 * 60,  # 1 hour
                )
                return response
            else:
                print(response, "kklopop")
                return Response(
                    {"message": "No user logged in", "is_authenticated": False},
                )

        except Exception as e:
            return Response(
                {"error": "An error occurred", "details": str(e)},
                status=HTTP_400_BAD_REQUEST,
            )

    def post(self, request, *args, **kwargs):
        serializer = UserSignUpSerializer(data=request.POST)
        if serializer.is_valid():
            user = serializer.save()
            authtokenSerializer = TokenObtainPairSerializer()
            access_token = str(authtokenSerializer.get_token(user).access_token)
            refresh_token = str(RefreshToken.for_user(user))
            response = Response(
                {
                    "message": "User created successfully",
                },
                status=HTTP_201_CREATED,
            )
            response.set_cookie(
                key="access",
                value=access_token,
                httponly=True,
                secure=False,  # Set True in production
                samesite="Strict",
                max_age=60 * 60,  # 1 hour
            )
            response.set_cookie(
                key="refresh",
                value=refresh_token,
                httponly=True,
                secure=False,  # Set True in production
                samesite="Strict",
                max_age=7 * 24 * 60 * 60,  # 7 days
            )
            return response
        else:
            return Response({"errors": serializer.errors}, status=HTTP_400_BAD_REQUEST)


@method_decorator(csrf_exempt, name="dispatch")
class LoggedInView(APIView):
    def get(self, request):
        return Response({"message": "test"})


@method_decorator(csrf_exempt, name="dispatch")
class LogoutView(APIView):
    def get(self, request):
        try:
            refresh_token = request.COOKIES.get("refresh")
            if not refresh_token:
                return Response({"error": "Refresh token is required"}, status=400)

            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Logout successful"}, status=200)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class CustomPasswordResetView(PasswordResetView):
    domain_override = "localhost:3000"

    class CustomPasswordResetForm(PasswordResetForm):
        def get_users(self, email):
            UserModel = get_user_model()
            email_field_name = UserModel.get_email_field_name()
            active_users = UserModel._default_manager.filter(
                **{
                    "%s__iexact" % email_field_name: email,
                }
            )
            return (
                u
                for u in active_users
                if u.has_usable_password()
                and _unicode_ci_compare(email, getattr(u, email_field_name))
            )

    form_class = CustomPasswordResetForm

    def save(
        self,
        domain_override=None,
        subject_template_name="registration/password_reset_subject.txt",
        email_template_name="registration/password_reset_email.html",
        use_https=False,
        token_generator=default_token_generator,
        from_email=None,
        request=None,
        html_email_template_name=None,
        extra_email_context=None,
    ):
        # Override the domain when saving the form

        return super().save(
            domain_override=self.domain_override,
            subject_template_name=subject_template_name,
            email_template_name=email_template_name,
            use_https=use_https,
            token_generator=token_generator,
            from_email=from_email,
            request=request,
            html_email_template_name=html_email_template_name,
            extra_email_context=extra_email_context,
        )

import logging
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.settings import api_settings
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_200_OK,
    HTTP_401_UNAUTHORIZED,
)
from django.contrib.auth.forms import PasswordResetForm
from django.apps import apps
from django.contrib.sites.shortcuts import get_current_site
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.http import HttpResponse
from .serializers import RegisterUserSerializer

UserModel = apps.get_model(settings.AUTH_USER_MODEL)
logger = logging.getLogger(__name__)

def set_cookie(response, key, value, max_age):
    response.set_cookie(
        key=key,
        value=value,
        httponly=True,
        secure=settings.SECURE_COOKIES,
        samesite="Strict",
        max_age=max_age,
    )

def check_refresh_token_validation(request):
    refresh_token = request.COOKIES.get("refresh")
    if not refresh_token:
        logger.warning("No refresh token found in the cookies.")
        return HttpResponse(status=HTTP_400_BAD_REQUEST)
    try:
        token = RefreshToken(refresh_token)
        token.check_exp()
        return HttpResponse(status=HTTP_200_OK)
    except TokenError:
        logger.error("Invalid or expired refresh token.")
        return HttpResponse(status=HTTP_401_UNAUTHORIZED)

class RegisterView(APIView):
    authentication_classes = []

    def post(self, request):
        try:
            serializer = RegisterUserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                refresh = TokenObtainPairSerializer.get_token(user)
                response = Response(
                    {"message": "User Created Successfully"},
                    status=HTTP_201_CREATED,
                )
                set_cookie(response, "access", str(refresh.access_token), 60 * 60)
                set_cookie(response, "refresh", str(refresh), 7 * 24 * 60 * 60)
                logger.info(f"User registered successfully: {user.username}")
                return response
            else:
                logger.warning("User registration failed due to invalid data.")
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error during user registration: {str(e)}")
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

class LoginView(TokenObtainPairView):
    authentication_classes = []

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            logger.error(f"Login failed: {e.args[0]}")
            raise InvalidToken(e.args[0])

        response = Response(
            {"message": "User logged in successfully"}, status=HTTP_200_OK
        )
        tokens = serializer.validated_data
        set_cookie(
            response,
            "access",
            str(tokens.get("access")),
            int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()),
        )
        set_cookie(
            response,
            "refresh",
            str(tokens.get("refresh")),
            int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()),
        )
        logger.info(f"User logged in successfully: {request.data.get('username')}")
        return response

class CustomPasswordResetView(APIView):
    class CustomPasswordResetForm(PasswordResetForm):
        def save(self, **kwargs):
            email = self.cleaned_data["email"]
            if not kwargs.get("domain_override"):
                current_site = get_current_site(kwargs.get("request"))
                kwargs["domain"] = current_site.domain

            email_field_name = UserModel.get_email_field_name()
            for user in self.get_users(email):
                user_email = getattr(user, email_field_name)
                context = {
                    "email": user_email,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "token": kwargs["token_generator"].for_user(user).access_token,
                    "protocol": "https" if kwargs["use_https"] else "http",
                    **(kwargs.get("extra_email_context") or {}),
                }
                self.send_mail(
                    kwargs["subject_template_name"],
                    kwargs["email_template_name"],
                    context,
                    kwargs.get("from_email"),
                    user_email,
                    html_email_template_name=kwargs.get("html_email_template_name"),
                )

    authentication_classes = []

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            logger.warning("Password reset requested without providing an email.")
            return Response(
                {"error": "Email is required."}, status=HTTP_400_BAD_REQUEST
            )
        form = self.CustomPasswordResetForm(data={"email": email})
        if form.is_valid():
            opts = {
                "use_https": request.is_secure(),
                "token_generator": RefreshToken,
                "from_email": settings.DEFAULT_FROM_EMAIL,
                "email_template_name": "password_reset_email.html",
                "subject_template_name": "registration/password_reset_subject.txt",
                "request": request,
                "extra_email_context": {
                    "link_expiry_time": f"{int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()) // 60} minutes",
                },
            }
            form.save(**opts)
            logger.info(f"Password reset email sent for email: {email}")
            return Response(
                {"message": "Password reset email sent."}, status=HTTP_200_OK
            )
        else:
            logger.warning(f"Invalid email address provided: {email}")
            return Response(
                {"error": "Invalid email address."}, status=HTTP_400_BAD_REQUEST
            )

@method_decorator(csrf_exempt, name="dispatch")
class CustomPasswordResetConfirmView(APIView):
    def post(self, request, uidb64, token, *args, **kwargs):
        user = self.get_user(uidb64)
        if not user:
            logger.error("Password reset failed: Invalid user.")
            return Response({"error": "Invalid user."}, status=HTTP_400_BAD_REQUEST)

        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        if new_password != confirm_password:
            logger.warning("Passwords do not match during password reset.")
            return Response(
                {"error": "Passwords do not match."}, status=HTTP_400_BAD_REQUEST
            )

        try:
            access_token = AccessToken(token)
            if user.id == access_token["user_id"]:
                user.password = make_password(new_password)
                user.save()
                logger.info(f"Password reset successful for user: {user.username}")
                return Response(
                    {"message": "Password reset successful."}, status=HTTP_200_OK
                )
        except InvalidToken:
            logger.error("Password reset failed: Invalid or expired token.")
            return Response(
                {"error": "Invalid or expired token."}, status=HTTP_400_BAD_REQUEST
            )

class UpdateUserView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        try:
            user = request.user
            serializer = RegisterUserSerializer(user, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                logger.info(f"User details updated successfully: {user.username}")
                return Response(
                    {"message": "User details updated successfully."},
                    status=HTTP_200_OK,
                )
            return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            logger.error(f"Error updating user details: {str(e)}")
            return Response(
                {"error": "An error occurred while updating user details."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

class LogoutView(APIView):
    def post(self, request):
        response = Response(
            {"message": "User has been successfully logged out"},
            status=HTTP_200_OK,
        )
        response.delete_cookie("access", path="/")
        response.delete_cookie("refresh", path="/")
        logger.info(f"User logged out successfully: {request.user.username}")
        return response

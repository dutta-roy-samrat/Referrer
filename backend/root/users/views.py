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

from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.exceptions import ValidationError
from django.contrib.auth.forms import PasswordResetForm
from django.apps import apps
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.http import HttpResponse
from .serializers import RegisterUserSerializer
import json
from django.shortcuts import get_object_or_404

UserModel = apps.get_model(settings.AUTH_USER_MODEL)
logger = logging.getLogger(__name__)


@csrf_exempt
def check_refresh_token_validation(request):
    if request.method != 'POST':
        return HttpResponse(status=HTTP_400_BAD_REQUEST)
        
    try:
        data = json.loads(request.body)
        refresh_token = data.get('refresh')
        
        if not refresh_token:
            logger.warning("No refresh token found in request body.")
            return HttpResponse(status=HTTP_400_BAD_REQUEST)

        token = RefreshToken(refresh_token)
        token.check_exp()
        
        user = get_object_or_404(UserModel, id=token.payload.get('user_id'))
        access_token = str(AccessToken.for_user(user))
        
        response = HttpResponse(status=HTTP_200_OK)
        response["X-Access-Token"] = access_token
        logger.info(f"New access token issued for user: {user.id}")
        return response
        
    except json.JSONDecodeError:
        logger.error("Invalid JSON in request body")
        return HttpResponse(status=HTTP_400_BAD_REQUEST)
    except TokenError as e:
        logger.error(f"Invalid or expired refresh token: {str(e)}")
        return HttpResponse(status=HTTP_401_UNAUTHORIZED)
    except Exception as e:
        logger.error(f"Error during token validation: {str(e)}", exc_info=True)
        return HttpResponse(status=HTTP_500_INTERNAL_SERVER_ERROR)


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
                response["X-Access-Token"] = str(refresh.access_token)
                response["X-Refresh-Token"] = str(refresh)

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
        response["X-Access-Token"] = str(tokens.get("access"))
        response["X-Refresh-Token"] = str(tokens.get("refresh"))

        logger.info(f"User logged in successfully: {request.data.get('username')}")
        return response


class CustomPasswordResetView(APIView):
    class CustomPasswordResetForm(PasswordResetForm):
        def save(self, **kwargs):
            email = self.cleaned_data["email"]
            if not kwargs.get("domain_override"):
                kwargs["domain"] = settings.FRONTEND_DOMAIN

            email_field_name = UserModel.get_email_field_name()
            for user in self.get_users(email):
                user_email = getattr(user, email_field_name)
                context = {
                    "email": user_email,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "token": kwargs["token_generator"].for_user(user).access_token,
                    "protocol": "https" if kwargs["use_https"] else "http",
                    **(kwargs.get("extra_email_context") or {}),
                    "domain": kwargs["domain"],
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


@method_decorator(decorator=csrf_exempt, name="dispatch")
class CustomPasswordResetConfirmView(APIView):
    token_generator = AccessToken
    authentication_classes = []

    def get_user(self, uidb64):
        try:
            uid = urlsafe_base64_decode(uidb64).decode()
            user = UserModel._default_manager.get(pk=uid)
        except (
            TypeError,
            ValueError,
            OverflowError,
            UserModel.DoesNotExist,
            ValidationError,
        ):
            user = None
        return user

    def confirm_password(self, password1, password2):
        if password1 == password2:
            return True
        else:
            raise ValidationError

    def post(self, request, *args, **kwargs):
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")
        self.user = self.get_user(kwargs["uidb64"])
        token = kwargs["token"]
        if self.user is not None:
            try:
                access_token = self.token_generator(token)
                if self.user.id == access_token.get(
                    "user_id"
                ) and self.confirm_password(new_password, confirm_password):
                    self.user.password = make_password(confirm_password)
                    self.user.save()
                    return Response(
                        {"message": "Password reset done"}, status=HTTP_200_OK
                    )
                else:
                    raise ValidationError
            except InvalidToken:
                return Response(
                    {"error": "Validation Error"}, status=HTTP_400_BAD_REQUEST
                )
        else:
            Response({"error": "Invalid User"}, status=HTTP_400_BAD_REQUEST)


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
        logger.info(f"User logged out successfully: {request.user.username}")
        return response

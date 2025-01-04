from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
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
)
from django.contrib.auth.forms import PasswordResetForm

from django.contrib.sites.shortcuts import get_current_site
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.core.exceptions import ValidationError, PermissionDenied
from django.contrib.auth.hashers import make_password
from django.conf import settings

from .serializers import (
    RegisterUserSerializer,
)

UserModel = settings.AUTH_USER_MODEL

INTERNAL_RESET_SESSION_TOKEN = "_password_reset_token"


# Create your views here.
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
                response.set_cookie(
                    key="access",
                    value=str(refresh.access_token),
                    httponly=True,
                    secure=False,  # Set True in production
                    samesite="Strict",
                    max_age=60 * 60,  # 1 hour
                )
                response.set_cookie(
                    key="refresh",
                    value=str(refresh),
                    httponly=True,
                    secure=False,  # Set True in production
                    samesite="Strict",
                    max_age=7 * 24 * 60 * 60,  # 7 days
                )
                return response
            else:
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


class LoginView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        response = Response(
            {"message": "User logged in successfully"}, status=HTTP_200_OK
        )
        tokens = serializer.validated_data
        response.set_cookie(
            key="access",
            value=str(tokens.get("access")),
            httponly=True,
            secure=False,  # Set True in production
            samesite="Strict",
            max_age=int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()),
        )
        response.set_cookie(
            key="refresh",
            value=str(tokens.get("refresh")),
            httponly=True,
            secure=False,  # Set True in production
            samesite="Strict",
            max_age=int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()),
        )
        return response


class CustomTokenRefreshView(TokenRefreshView):
    def get(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh")
        if not refresh:
            return Response(
                {"detail": "Refresh token is required."}, status=HTTP_400_BAD_REQUEST
            )
        response = Response(
            {"message": "New Refresh Token created successfully"}, status=HTTP_200_OK
        )
        new_refresh_token = RefreshToken.for_user(request.user)
        response.set_cookie(
            key="access",
            value=str(new_refresh_token.access_token),
            httponly=True,
            secure=False,  # Set True in production
            samesite="Strict",
            max_age=int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()),
        )
        response.set_cookie(
            key="refresh",
            value=str(new_refresh_token),
            httponly=True,
            secure=False,  # Set True in production
            samesite="Strict",
            max_age=int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()),
        )

        return response


class CustomPasswordResetView(APIView):
    class CustomPasswordResetForm(PasswordResetForm):
        def save(
            self,
            domain_override=None,
            subject_template_name="registration/password_reset_subject.txt",
            email_template_name="registration/password_reset_email.html",
            use_https=False,
            token_generator=RefreshToken,
            from_email=None,
            request=None,
            html_email_template_name=None,
            extra_email_context=None,
        ):
            """
            Generate a one-use only link for resetting password and send it to the
            user.
            """
            email = self.cleaned_data["email"]
            if not domain_override:
                current_site = get_current_site(request)
                site_name = current_site.name
                domain = current_site.domain
            else:
                site_name = domain = domain_override
            email_field_name = UserModel.get_email_field_name()
            for user in self.get_users(email):
                user_email = getattr(user, email_field_name)
                context = {
                    "email": user_email,
                    "domain": domain,
                    "site_name": site_name,
                    "uid": urlsafe_base64_encode(force_bytes(user.pk)),
                    "user": user,
                    "token": token_generator.for_user(user).access_token,
                    "protocol": "https" if use_https else "http",
                    **(extra_email_context or {}),
                }
                self.send_mail(
                    subject_template_name,
                    email_template_name,
                    context,
                    from_email,
                    user_email,
                    html_email_template_name=html_email_template_name,
                )

    authentication_classes = []
    email_template_name = "password_reset_email.html"
    extra_email_context = {
        "link_expiry_time": f"{int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds())//60} minutes"
    }
    form_class = CustomPasswordResetForm
    from_email = None
    html_email_template_name = None
    subject_template_name = "registration/password_reset_subject.txt"
    title = "Password reset"
    token_generator = RefreshToken

    def post(self, request, *args, **kwargs):
        email = request.data.get("email")
        if not email:
            return Response(
                {"error": "Email is required."}, status=HTTP_400_BAD_REQUEST
            )
        form = self.form_class(data={"email": email})
        if form.is_valid():
            opts = {
                "use_https": self.request.is_secure(),
                "token_generator": self.token_generator,
                "from_email": self.from_email,
                "email_template_name": self.email_template_name,
                "subject_template_name": self.subject_template_name,
                "request": self.request,
                "html_email_template_name": self.html_email_template_name,
                "extra_email_context": self.extra_email_context,
                "domain_override": "localhost:3000",
            }
            form.save(**opts)
            return Response(
                {"message": "Password reset email sent."}, status=HTTP_200_OK
            )
        else:
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
                return Response(
                    {"message": "User details updated successfully."},
                    status=HTTP_200_OK,
                )
            else:
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": "An error occurred while updating user details."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

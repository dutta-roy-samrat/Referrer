# from django.utils.deprecation import MiddlewareMixin
# from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
# from rest_framework_simplejwt.views import TokenRefreshView
# from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
# from django.contrib.messages.storage.cookie import CookieStorage
# from rest_framework_simplejwt.settings import api_settings


from django.utils.deprecation import MiddlewareMixin
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.settings import api_settings


class RevalidateJWTTokenMiddleware(MiddlewareMixin):

    def _validate_token(self, token, token_class):
        if token is None:
            return None
        try:
            return token_class(token)
        except TokenError as e:
            print(f"Token validation failed: {str(e)}")
            return None

    def process_request(self, request):
        access_token = request.COOKIES.get("access")
        if not self._validate_token(access_token, AccessToken):
            refresh_token = request.COOKIES.get("refresh")
            if self._validate_token(refresh_token, RefreshToken):
                request.new_access_token_generated = True

    def process_response(self, request, response):
        if getattr(request, "new_access_token_generated", False):
            refresh_token = request.COOKIES.get("refresh")
            valid_refresh_token = self._validate_token(refresh_token, RefreshToken)
            new_access_token = str(valid_refresh_token.access_token)
            new_refresh_token = RefreshToken.for_user(request.user)

            response.set_cookie(
                key="access",
                value=new_access_token,
                httponly=True,
                secure=False,
                samesite="Strict",
                max_age=int(api_settings.ACCESS_TOKEN_LIFETIME.total_seconds()),
            )
            response.set_cookie(
                key="refresh",
                value=new_refresh_token,
                httponly=True,
                secure=False,
                samesite="Strict",
                max_age=int(api_settings.REFRESH_TOKEN_LIFETIME.total_seconds()),
            )
        return response

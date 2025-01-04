from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.tokens import AccessToken, RefreshToken


class CustomJWTAuthentication(JWTAuthentication):
    def authenticate(self, request):

        validated_token = self.get_validated_token(request)

        return self.get_user(validated_token), validated_token

    def get_validated_token(self, request):
        """
        Validates an encoded JSON web token and returns a validated token
        wrapper object.
        """
        messages = []

        access_token = request.COOKIES.get("access")
        if access_token is None:
            messages.append(
                {
                    "token_class": AccessToken.__name__,
                    "token_type": AccessToken.token_type,
                    "message": "Token not found",
                }
            )
        else:
            try:
                return AccessToken(access_token)
            except TokenError as e:
                messages.append(
                    {
                        "token_class": AccessToken.__name__,
                        "token_type": AccessToken.token_type,
                        "message": e.args[0],
                    }
                )
        refresh_token = request.COOKIES.get("refresh")
        if refresh_token is None:
            messages.append(
                {
                    "token_class": RefreshToken.__name__,
                    "token_type": RefreshToken.token_type,
                    "message": "Token not found",
                }
            )
        else:
            try:
                validated_token = RefreshToken(refresh_token).access_token
                return validated_token
            except TokenError as e:
                messages.append(
                    {
                        "token_class": RefreshToken.__name__,
                        "token_type": RefreshToken.token_type,
                        "message": e.args[0],
                    }
                )

        raise InvalidToken(
            {
                "detail": "Given token not valid for any token type",
                "messages": messages,
            }
        )

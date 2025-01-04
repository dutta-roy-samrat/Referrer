from graphene_django.views import GraphQLView
from users.authentication import CustomJWTAuthentication
from django.contrib.auth.models import AnonymousUser

class CustomGraphQLView(GraphQLView):
    def get_context(self, request):
        context = request

        # Authenticate the user using CustomJWTAuthentication
        authenticator = CustomJWTAuthentication()
        try:
            user, token = authenticator.authenticate(request)
            context.user = user
        except Exception:
            context.user = AnonymousUser()

        return context

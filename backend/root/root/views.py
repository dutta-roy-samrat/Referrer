from graphene_django.views import GraphQLView
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.contrib.auth.models import AnonymousUser

class CustomGraphQLView(GraphQLView):
    def get_context(self, request):
        context = request

        authenticator = JWTAuthentication()
        try:
            user, token = authenticator.authenticate(request)
            context.user = user
        except Exception:
            context.user = AnonymousUser()

        return context

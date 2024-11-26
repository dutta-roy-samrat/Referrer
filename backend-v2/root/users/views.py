from rest_framework.views import APIView
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_201_CREATED,
    HTTP_400_BAD_REQUEST,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework_simplejwt.tokens import RefreshToken

# Create your views here.


class RegisterView(APIView):
    def post(self, request):
        try:
            serializer = UserSerializer(data=request.data)
            if serializer.is_valid():
                user = serializer.save()
                print(user, "kkl")
                refresh = RefreshToken.for_user(user=user,)
                return Response(
                    {"refresh": str(refresh), "access": str(refresh.access_token)},
                    status=HTTP_201_CREATED,
                )
            else:
                return Response(serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

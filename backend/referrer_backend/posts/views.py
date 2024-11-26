from rest_framework.views import APIView
from .serializers import PostsSerializer
from rest_framework.response import Response
from rest_framework.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR
from user_auth.views import UserInforView
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt


# Create your views here.
@method_decorator(csrf_exempt, name="dispatch")
class PostsView(APIView):
    def get(self, request):
        pass

    def post(self, request, *args, **kwargs):
        try:
            print(request.data)
            userInfo = UserInforView().get(request)
            is_user_authenticated = userInfo.data.get("is_authenticated")
            if is_user_authenticated is None:
                return userInfo
            if is_user_authenticated is False:
                return Response(
                    {"message": "User is not authenticated"},
                    status=HTTP_400_BAD_REQUEST,
                )
            post_serializer = PostsSerializer(data=request.data)
            if post_serializer.is_valid():
                post_serializer.save()
                return Response({"message": "Post have been successfully created"})
            else:
                return Response(
                    {"errors": post_serializer.errors}, status=HTTP_400_BAD_REQUEST
                )
        except Exception as e:
            return Response({"errors": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

from django_eventstream import send_event
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .serializers import PostsSerializer
from .models import Post
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_500_INTERNAL_SERVER_ERROR,
)


class PostsView(APIView):
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        try:
            post_query_limit = (
                int(request.query_params.get("limit"))
                if request.query_params.get("limit") is not None
                else 20
            )
            send_post_starting_from = (
                int(request.query_params.get("start_from"))
                if request.query_params.get("start_from") is not None
                else 0
            )
            post_id = kwargs.get("id")
            if post_id:
                posts = Post.objects.get(id=post_id)
                posts_serializer = PostsSerializer(posts)
            else:
                posts = Post.objects.all()[send_post_starting_from:post_query_limit]
                posts_serializer = PostsSerializer(posts, many=True)
            return Response(posts_serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):

        try:
            # Serialize the incoming post data
            post_serializer = PostsSerializer(data=request.data)
            if post_serializer.is_valid():
                post_serializer.save()  # Save the new post
                # Prepare data to send via SSE
                post_data = post_serializer.data
                # Send event to all connected clients
                send_event("post", "message", post_data)
                return Response(
                    {"message": "Post successfully created"},
                    status=HTTP_201_CREATED,
                )
            return Response(post_serializer.errors, status=HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


class MyPostsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        print(request.user, "kkl")
        try:
            post_query_limit = (
                int(request.query_params.get("limit"))
                if request.query_params.get("limit") is not None
                else 20
            )
            send_post_starting_from = (
                int(request.query_params.get("start_from"))
                if request.query_params.get("start_from") is not None
                else 0
            )
            posts = Post.objects.filter(posted_by=request.user)[
                send_post_starting_from:post_query_limit
            ]
            posts_serializer = PostsSerializer(posts, many=True)
            return Response(posts_serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

from django_eventstream import send_event
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_500_INTERNAL_SERVER_ERROR,
    HTTP_404_NOT_FOUND,
)
from .serializers import PostsSerializer
from .models import Post
from users.models import User


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
            posts = request.user.posted.all()[send_post_starting_from:post_query_limit]
            posts_serializer = PostsSerializer(posts, many=True)
            return Response(posts_serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

    def post(self, request, *args, **kwargs):
        try:
            post_id = request.data.get("post_id")

            if not post_id:
                return Response(
                    {"error": "post_id is required"}, status=HTTP_400_BAD_REQUEST
                )

            try:
                post_instance = Post.objects.get(id=post_id)
            except Post.DoesNotExist:
                return Response({"error": "Post not found"}, status=HTTP_404_NOT_FOUND)

            if post_instance.applied_by.filter(id=request.user.id).exists():
                return Response(
                    {"message": "You have already applied to this post."},
                    status=HTTP_200_OK,
                )

            user_instance_updated = False
            provided_resume_data = request.data.get("resume")
            provided_experience = request.data.get("experience")

            if provided_resume_data and request.user.resume != provided_resume_data:
                request.user.resume = provided_resume_data
                user_instance_updated = True

            if provided_experience and request.user.experience != provided_experience:
                request.user.experience = provided_experience
                user_instance_updated = True

            if user_instance_updated:
                request.user.save()

            post_instance.applied_by.add(request.user)

            return Response(
                {"message": "Successfully applied to the post!"}, status=HTTP_200_OK
            )

        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)


class AppliedPostsView(APIView):
    def get(self, request):
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
            posts = request.user.applied_to.all()[
                send_post_starting_from:post_query_limit
            ]
            post_serializer = PostsSerializer(posts, many=True)
            return Response(post_serializer.data, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=HTTP_500_INTERNAL_SERVER_ERROR)

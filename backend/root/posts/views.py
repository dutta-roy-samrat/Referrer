from django_eventstream import send_event
from django.db.models import Q
from django.shortcuts import get_object_or_404
from datetime import date
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import (
    HTTP_200_OK,
    HTTP_400_BAD_REQUEST,
    HTTP_201_CREATED,
    HTTP_500_INTERNAL_SERVER_ERROR,
)
from rest_framework_simplejwt.tokens import RefreshToken
from users.serializers import RegisterUserSerializer
from users.models import User
from .serializers import PostsSerializer
from .models import Post
import logging

logger = logging.getLogger(__name__)

def get_paginated_query(queryset, limit, start_from):
    limit = int(limit) if limit else 20
    start_from = int(start_from) if start_from else 0
    return queryset[start_from : start_from + limit]

class PostsView(APIView):
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh")
            user_id = RefreshToken(refresh_token).payload.get("user_id")
        except:
            user_id = None
        try:
            post_id = kwargs.get("id")
            if post_id:
                post = get_object_or_404(Post, id=post_id)
                post_serializer = PostsSerializer(post)
                serialized_data = post_serializer.data
                serialized_data["view_only"] = False
                serialized_data["applied_by"] = []
                if user_id is not None:
                    user_instance = get_object_or_404(User, id=user_id)
                    if (
                        user_instance in post.applied_by.all()
                        or post.posted_by == user_instance
                    ):
                        serialized_data["view_only"] = True
                    if post.posted_by == user_instance:
                        serialized_data["applied_by"] = [
                            RegisterUserSerializer(user).data
                            for user in post.applied_by.all()
                        ]
                return Response(serialized_data, status=HTTP_200_OK)
            if user_id is not None:
                user_instance = get_object_or_404(User, id=user_id)
                queryset = Post.objects.filter(
                    Q(expiry_date__gte=date.today())
                    & ~Q(applied_by=user_instance)
                    & ~Q(posted_by=user_instance)
                )
            else:
                queryset = Post.objects.filter(expiry_date__gte=date.today())
            posts = get_paginated_query(
                queryset,
                request.query_params.get("limit"),
                request.query_params.get("start_from"),
            )
            posts_serializer = PostsSerializer(posts, many=True)
            return Response(posts_serializer.data, status=HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching posts: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, *args, **kwargs):
        try:
            post_serializer = PostsSerializer(data=request.data)
            if post_serializer.is_valid():
                post = post_serializer.save()
                send_event("post", "message", PostsSerializer(post).data)
                logger.info(f"Post successfully created: {post.id}")
                return Response(
                    {"message": "Post successfully created"}, status=HTTP_201_CREATED
                )

            return Response(post_serializer.errors, status=HTTP_400_BAD_REQUEST)

        except Exception as e:
            logger.error(f"Error creating post: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )


class MyPostsView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            posts = get_paginated_query(
                request.user.posted.all(),
                request.query_params.get("limit"),
                request.query_params.get("start_from"),
            )
            posts_serializer = PostsSerializer(posts, many=True)
            logger.info(f"Fetched posts for user: {request.user.id}")
            return Response(posts_serializer.data, status=HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching user posts: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def post(self, request, *args, **kwargs):
        try:
            post_id = request.data.get("post_id")
            if not post_id:
                return Response(
                    {"error": "post_id is required"}, status=HTTP_400_BAD_REQUEST
                )

            post_instance = get_object_or_404(Post, id=post_id)

            if post_instance.applied_by.filter(id=request.user.id).exists():
                return Response(
                    {"message": "You have already applied to this post."},
                    status=HTTP_400_BAD_REQUEST,
                )

            user_instance_updated = False
            provided_resume = request.data.get("resume")
            provided_experience = request.data.get("experience")

            if provided_resume and request.user.resume != provided_resume:
                request.user.resume = provided_resume
                user_instance_updated = True

            if provided_experience and request.user.experience != provided_experience:
                request.user.experience = provided_experience
                user_instance_updated = True

            if user_instance_updated:
                request.user.save()

            post_instance.applied_by.add(request.user)
            logger.info(f"User {request.user.id} applied to post {post_instance.id}")

            return Response(
                {"message": "Successfully applied to the post!"}, status=HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Error applying to post: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

    def delete(self, request, **kwargs):
        try:
            post_id = kwargs.get("id")
            if not post_id:
                return Response(
                    {"error": "post_id is required"}, status=HTTP_400_BAD_REQUEST
                )

            post_instance = get_object_or_404(Post, id=post_id)
            post_instance.delete()
            send_event("post", "message", {"action": "delete", "id": post_id})
            logger.info(f"Post {post_id} deleted successfully")
            return Response(
                {"message": "Post deleted successfully!"}, status=HTTP_200_OK
            )

        except Exception as e:
            logger.error(f"Error deleting post: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )


class AppliedPostsView(APIView):
    def get(self, request):
        try:
            posts = get_paginated_query(
                request.user.applied_to.all(),
                request.query_params.get("limit"),
                request.query_params.get("start_from"),
            )
            posts_serializer = PostsSerializer(posts, many=True)
            logger.info(f"Fetched applied posts for user: {request.user.id}")
            return Response(posts_serializer.data, status=HTTP_200_OK)

        except Exception as e:
            logger.error(f"Error fetching applied posts: {str(e)}", exc_info=True)
            return Response(
                {"error": "An unexpected error occurred."},
                status=HTTP_500_INTERNAL_SERVER_ERROR,
            )

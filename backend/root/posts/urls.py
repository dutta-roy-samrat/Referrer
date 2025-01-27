from django.urls import path, include
import django_eventstream
from .views import PostsView, MyPostsView, AppliedPostsView

urlpatterns = [
    path("", PostsView.as_view()),
    path("my-posts/", MyPostsView.as_view()),
    path("apply/", MyPostsView.as_view()),
    path("<int:id>/", PostsView.as_view()),
    path("events/", include(django_eventstream.urls), {"channels": ["post"]}),
    path("applied-to/", AppliedPostsView.as_view()),
    path("delete/<int:id>", MyPostsView.as_view()),
]

from rest_framework import serializers
from .models import CustomUserModel


class UserSignUpSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUserModel
        fields = ["first_name", "last_name", "email", "password"]


class UserInfoSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()

    class Meta:
        model = CustomUserModel
        fields = ["email", "full_name"]

    def get_full_name(self, obj):
        return f"{obj.first_name} {obj.last_name}"

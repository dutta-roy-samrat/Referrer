from rest_framework.serializers import ModelSerializer
from .models import User


class RegisterUserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["id", "email", "password", "first_name", "last_name"]
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

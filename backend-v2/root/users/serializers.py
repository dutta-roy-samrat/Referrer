from rest_framework.serializers import ModelSerializer, SerializerMethodField
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User


class UserSerializer(ModelSerializer):
    full_name = SerializerMethodField()

    class Meta:
        model = User
        fields = ["id", "full_name", "email", "password", "first_name", "last_name"]
        extra_kwargs: {
            "password": {"write_only": True},
            "first_name": {"write_only": True},
            "last_name": {"write_only": True},
            "full_name": {"read_only": "True"},
        }

    def get_full_name(self, object):
        return f"{object.first_name} {object.last_name}"


# class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
#     def

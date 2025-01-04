from graphene_django import DjangoObjectType
from .models import User

class UserDetailsType(DjangoObjectType):
    class Meta:
        model = User
        fields = [field.name for field in User._meta.fields if field.name != "password"]

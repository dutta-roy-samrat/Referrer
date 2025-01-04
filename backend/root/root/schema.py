import graphene
from users.schema import UserDetailsType
from .graphql_decorator import permission_required


class Query(graphene.ObjectType):
    get_user_details = graphene.Field(UserDetailsType)


    @permission_required
    def resolve_get_user_details(self, info):
        return info.context.user


schema = graphene.Schema(query=Query)

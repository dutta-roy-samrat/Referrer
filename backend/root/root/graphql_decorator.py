from functools import wraps
from graphql import GraphQLError


def permission_required(func):
    @wraps(func)
    def wrapped(self, info, *args, **kwargs):
        user = info.context.user
        if not user or not user.is_authenticated:
            raise GraphQLError("Permission denied. User is not authenticated.")
        return func(self, info, *args, **kwargs)

    return wrapped

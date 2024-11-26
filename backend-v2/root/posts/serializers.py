from rest_framework import serializers
from .models import Post
from skills.models import Skills
from users.models import User


class PostsSerializer(serializers.ModelSerializer):
    skills = serializers.CharField(write_only=True)  # Accept as comma-separated string
    skills_display = serializers.SlugRelatedField(
        many=True, slug_field="skill", read_only=True, source="skills"
    )
    posted_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = "__all__"
        extra_kwargs = {"posted_by": {"write_only": True}}

    def get_posted_by_user(self, obj):
        return str(obj.posted_by)

    def create(self, validated_data):
        # Extract and process skills
        skills_data = validated_data.pop("skills", "")
        skills_list = [
            skill.strip().lower() for skill in skills_data.split(",") if skill.strip()
        ]

        # Create the Post instance
        post_obj = Post.objects.create(**validated_data)

        # Add or fetch Skills objects
        skills_objs = []
        for skill in skills_list:
            skill_obj, _ = Skills.objects.get_or_create(skill=skill)
            skills_objs.append(skill_obj)
        # Add the skills to the Post
        post_obj.skills.add(*skills_objs)

        return post_obj

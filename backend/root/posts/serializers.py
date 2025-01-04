from rest_framework import serializers
from skills.models import Skills
from .models import Post


class PostsSerializer(serializers.ModelSerializer):
    skills = serializers.CharField(write_only=True)
    skills_display = serializers.SlugRelatedField(
        many=True, slug_field="skill", read_only=True, source="skills"
    )
    posted_by_user = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = [
            field.name for field in Post._meta.fields if field.name != "applied_by"
        ] + ["posted_by_user", "skills_display", "skills"]
        extra_kwargs = {"posted_by": {"write_only": True}}

    def get_posted_by_user(self, obj):
        return str(obj.posted_by)

    def create(self, validated_data):
        skills_data = validated_data.pop("skills", "")
        skills_list = [
            skill.strip().lower() for skill in skills_data.split(",") if skill.strip()
        ]

        post_obj = Post.objects.create(**validated_data)

        existing_skills = Skills.objects.filter(skill__in=skills_list)
        existing_skills_dict = {skill.skill: skill for skill in existing_skills}

        new_skills = [
            Skills.objects.create(skill=skill)
            for skill in skills_list
            if skill not in existing_skills_dict
        ]
        
        all_skills = list(existing_skills) + new_skills
        post_obj.skills.add(*all_skills)

        return post_obj

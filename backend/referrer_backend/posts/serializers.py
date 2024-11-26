from rest_framework import serializers
from .models import PostModel
from skills.models import SkillsModel


class PostsSerializer(serializers.ModelSerializer):
    skills = serializers.ListField(child=serializers.CharField())

    class Meta:
        model = PostModel
        fields = "__all__"

    def create(self, validated_data):
        # Extract the skills list from the validated data
        skills_list = validated_data.pop("skills", "[]")

        # Create the PostModel object
        post_obj = PostModel.objects.create(**validated_data)
        print(type(skills_list))
        # Loop over the skills list and get or create each skill
        for skill in skills_list:
            # Ensure skill is a string and get or create the skill object
            skill_obj, created = SkillsModel.objects.get_or_create(skill=skill)
            print(f"Skill: {skill}, Skill Object: {skill_obj}, Created: {created}")
            # Add the skill to the PostModel's skills (ManyToManyField)
            post_obj.skills.add(skill_obj)
        print(post_obj)
        return post_obj
    

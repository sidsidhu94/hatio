from rest_framework import serializers
from .models import UserAccount,Project, Todo


class UserCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserAccount
        fields = ['name', 'email', 'mobilenumber', 'password']

    def create(self, validated_data):
        user = UserAccount.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            name=validated_data['name'],
            mobilenumber=validated_data['mobilenumber']
        )
        return user




class TodoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Todo
        fields = ('sequential_number', 'task', 'status', 'description', 'created_date', 'updated_date')


    def update(self, instance, validated_data):
        return super().update(instance, validated_data)

class ProjectSerializer(serializers.ModelSerializer):
    todos = TodoSerializer(many=True, read_only=True)

    class Meta:
        model = Project
        fields = ('id', 'project', 'user', 'created_date', 'todos')



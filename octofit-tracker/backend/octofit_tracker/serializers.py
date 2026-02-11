from rest_framework import serializers
from .models import User, Team, Activity, Leaderboard, Workout


class UserSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = ['id', 'name', 'email', 'team', 'role']
    
    def get_id(self, obj):
        return str(obj.pk) if obj.pk else None


class TeamSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Team
        fields = ['id', 'name', 'description', 'members', 'created_at']
    
    def get_id(self, obj):
        return str(obj.pk) if obj.pk else None


class ActivitySerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Activity
        fields = ['id', 'user_email', 'user_name', 'team', 'activity_type', 
                  'duration_minutes', 'calories_burned', 'distance_km', 'date', 'notes']
    
    def get_id(self, obj):
        return str(obj.pk) if obj.pk else None


class LeaderboardSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Leaderboard
        fields = ['id', 'user_email', 'user_name', 'team', 'total_activities', 
                  'total_calories', 'total_distance_km', 'total_duration_minutes', 
                  'rank', 'last_updated']
    
    def get_id(self, obj):
        return str(obj.pk) if obj.pk else None


class WorkoutSerializer(serializers.ModelSerializer):
    id = serializers.SerializerMethodField()
    
    class Meta:
        model = Workout
        fields = ['id', 'name', 'category', 'description', 'duration_minutes', 
                  'difficulty', 'calories_per_hour', 'equipment_needed', 'created_at']
    
    def get_id(self, obj):
        return str(obj.pk) if obj.pk else None

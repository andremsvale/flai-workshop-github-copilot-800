from django.contrib import admin
from .models import User, Team, Activity, Leaderboard, Workout


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['name', 'email', 'team', 'role']
    search_fields = ['name', 'email']
    list_filter = ['team', 'role']


@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ['name', 'description', 'created_at']
    search_fields = ['name']


@admin.register(Activity)
class ActivityAdmin(admin.ModelAdmin):
    list_display = ['user_name', 'activity_type', 'duration_minutes', 'calories_burned', 'date']
    search_fields = ['user_name', 'activity_type']
    list_filter = ['activity_type', 'team', 'date']


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = ['rank', 'user_name', 'team', 'total_calories', 'total_activities']
    search_fields = ['user_name']
    list_filter = ['team']
    ordering = ['rank']


@admin.register(Workout)
class WorkoutAdmin(admin.ModelAdmin):
    list_display = ['name', 'category', 'difficulty', 'duration_minutes', 'calories_per_hour']
    search_fields = ['name', 'category']
    list_filter = ['category', 'difficulty']

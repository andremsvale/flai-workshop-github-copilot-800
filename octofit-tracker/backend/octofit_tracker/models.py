from djongo import models


class User(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    team = models.CharField(max_length=200)
    role = models.CharField(max_length=200)
    
    class Meta:
        db_table = 'users'
        managed = False
    
    def __str__(self):
        return self.name


class Team(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField()
    members = models.JSONField()
    created_at = models.DateTimeField()
    
    class Meta:
        db_table = 'teams'
        managed = False
    
    def __str__(self):
        return self.name


class Activity(models.Model):
    user_email = models.EmailField()
    user_name = models.CharField(max_length=200)
    team = models.CharField(max_length=200)
    activity_type = models.CharField(max_length=100)
    duration_minutes = models.IntegerField()
    calories_burned = models.IntegerField()
    distance_km = models.FloatField()
    date = models.DateTimeField()
    notes = models.TextField()
    
    class Meta:
        db_table = 'activities'
        managed = False
    
    def __str__(self):
        return f"{self.user_name} - {self.activity_type}"


class Leaderboard(models.Model):
    user_email = models.EmailField()
    user_name = models.CharField(max_length=200)
    team = models.CharField(max_length=200)
    total_activities = models.IntegerField()
    total_calories = models.IntegerField()
    total_distance_km = models.FloatField()
    total_duration_minutes = models.IntegerField()
    rank = models.IntegerField()
    last_updated = models.DateTimeField()
    
    class Meta:
        db_table = 'leaderboard'
        ordering = ['rank']
        managed = False
    
    def __str__(self):
        return f"{self.rank}. {self.user_name}"


class Workout(models.Model):
    name = models.CharField(max_length=200)
    category = models.CharField(max_length=100)
    description = models.TextField()
    duration_minutes = models.IntegerField()
    difficulty = models.CharField(max_length=50)
    calories_per_hour = models.IntegerField()
    equipment_needed = models.CharField(max_length=200)
    created_at = models.DateTimeField()
    
    class Meta:
        db_table = 'workouts'
        managed = False
    
    def __str__(self):
        return self.name

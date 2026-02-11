from django.core.management.base import BaseCommand
from pymongo import MongoClient
from datetime import datetime, timedelta
import random


class Command(BaseCommand):
    help = 'Populate the octofit_db database with test data'

    def handle(self, *args, **options):
        # Connect to MongoDB
        client = MongoClient('localhost', 27017)
        db = client['octofit_db']

        self.stdout.write(self.style.SUCCESS('Connected to MongoDB'))

        # Clear existing data
        self.stdout.write('Clearing existing data...')
        db.users.delete_many({})
        db.teams.delete_many({})
        db.activities.delete_many({})
        db.leaderboard.delete_many({})
        db.workouts.delete_many({})

        # Create unique index on email field
        db.users.create_index([("email", 1)], unique=True)
        self.stdout.write(self.style.SUCCESS('Created unique index on email field'))

        # Sample superhero users
        users_data = [
            # Team Marvel
            {"name": "Tony Stark", "email": "iron.man@marvel.com", "team": "Team Marvel", "role": "Strength Training"},
            {"name": "Steve Rogers", "email": "captain.america@marvel.com", "team": "Team Marvel", "role": "Cardio"},
            {"name": "Natasha Romanoff", "email": "black.widow@marvel.com", "team": "Team Marvel", "role": "Flexibility"},
            {"name": "Bruce Banner", "email": "hulk@marvel.com", "team": "Team Marvel", "role": "Strength Training"},
            {"name": "Thor Odinson", "email": "thor@marvel.com", "team": "Team Marvel", "role": "Strength Training"},
            {"name": "Peter Parker", "email": "spider.man@marvel.com", "team": "Team Marvel", "role": "Cardio"},
            
            # Team DC
            {"name": "Bruce Wayne", "email": "batman@dc.com", "team": "Team DC", "role": "Strength Training"},
            {"name": "Clark Kent", "email": "superman@dc.com", "team": "Team DC", "role": "Strength Training"},
            {"name": "Diana Prince", "email": "wonder.woman@dc.com", "team": "Team DC", "role": "Strength Training"},
            {"name": "Barry Allen", "email": "flash@dc.com", "team": "Team DC", "role": "Cardio"},
            {"name": "Arthur Curry", "email": "aquaman@dc.com", "team": "Team DC", "role": "Swimming"},
            {"name": "Hal Jordan", "email": "green.lantern@dc.com", "team": "Team DC", "role": "Cardio"},
        ]

        # Insert users
        result = db.users.insert_many(users_data)
        user_ids = result.inserted_ids
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(user_ids)} users'))

        # Teams data
        teams_data = [
            {
                "name": "Team Marvel",
                "description": "Earth's Mightiest Heroes",
                "members": [
                    "iron.man@marvel.com",
                    "captain.america@marvel.com",
                    "black.widow@marvel.com",
                    "hulk@marvel.com",
                    "thor@marvel.com",
                    "spider.man@marvel.com"
                ],
                "created_at": datetime.now()
            },
            {
                "name": "Team DC",
                "description": "Justice League",
                "members": [
                    "batman@dc.com",
                    "superman@dc.com",
                    "wonder.woman@dc.com",
                    "flash@dc.com",
                    "aquaman@dc.com",
                    "green.lantern@dc.com"
                ],
                "created_at": datetime.now()
            }
        ]

        result = db.teams.insert_many(teams_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} teams'))

        # Activities data
        activity_types = ["Running", "Cycling", "Swimming", "Weightlifting", "Yoga", "Boxing", "CrossFit"]
        activities_data = []
        
        for user in users_data:
            for _ in range(random.randint(5, 15)):
                activity = {
                    "user_email": user["email"],
                    "user_name": user["name"],
                    "team": user["team"],
                    "activity_type": random.choice(activity_types),
                    "duration_minutes": random.randint(20, 120),
                    "calories_burned": random.randint(100, 800),
                    "distance_km": round(random.uniform(1, 20), 2),
                    "date": datetime.now() - timedelta(days=random.randint(0, 30)),
                    "notes": f"Great workout session!"
                }
                activities_data.append(activity)

        result = db.activities.insert_many(activities_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} activities'))

        # Leaderboard data
        leaderboard_data = []
        for user in users_data:
            user_activities = [a for a in activities_data if a["user_email"] == user["email"]]
            total_calories = sum(a["calories_burned"] for a in user_activities)
            total_distance = sum(a["distance_km"] for a in user_activities)
            total_duration = sum(a["duration_minutes"] for a in user_activities)
            
            leaderboard_entry = {
                "user_email": user["email"],
                "user_name": user["name"],
                "team": user["team"],
                "total_activities": len(user_activities),
                "total_calories": total_calories,
                "total_distance_km": round(total_distance, 2),
                "total_duration_minutes": total_duration,
                "rank": 0,  # Will be updated based on sorting
                "last_updated": datetime.now()
            }
            leaderboard_data.append(leaderboard_entry)

        # Sort by total calories and assign ranks
        leaderboard_data.sort(key=lambda x: x["total_calories"], reverse=True)
        for idx, entry in enumerate(leaderboard_data, 1):
            entry["rank"] = idx

        result = db.leaderboard.insert_many(leaderboard_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} leaderboard entries'))

        # Workouts data
        workout_categories = {
            "Strength Training": ["Bench Press", "Squats", "Deadlifts", "Pull-ups", "Dumbbell Rows"],
            "Cardio": ["Interval Sprints", "Long Distance Run", "Cycling", "Jump Rope", "Burpees"],
            "Flexibility": ["Yoga Flow", "Stretching Routine", "Pilates", "Foam Rolling"],
            "Swimming": ["Freestyle Laps", "Butterfly Stroke", "Backstroke", "Water Aerobics"],
        }

        workouts_data = []
        for category, exercises in workout_categories.items():
            for exercise in exercises:
                workout = {
                    "name": exercise,
                    "category": category,
                    "description": f"A challenging {exercise.lower()} workout routine",
                    "duration_minutes": random.randint(30, 90),
                    "difficulty": random.choice(["Beginner", "Intermediate", "Advanced"]),
                    "calories_per_hour": random.randint(200, 600),
                    "equipment_needed": random.choice(["None", "Dumbbells", "Barbell", "Resistance Bands", "Yoga Mat"]),
                    "created_at": datetime.now()
                }
                workouts_data.append(workout)

        result = db.workouts.insert_many(workouts_data)
        self.stdout.write(self.style.SUCCESS(f'Inserted {len(result.inserted_ids)} workouts'))

        # Summary
        self.stdout.write(self.style.SUCCESS('\n=== Database Population Complete ==='))
        self.stdout.write(self.style.SUCCESS(f'Users: {db.users.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Teams: {db.teams.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Activities: {db.activities.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Leaderboard: {db.leaderboard.count_documents({})}'))
        self.stdout.write(self.style.SUCCESS(f'Workouts: {db.workouts.count_documents({})}'))

        client.close()

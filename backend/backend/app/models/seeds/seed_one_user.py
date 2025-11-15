from datetime import datetime, timedelta

from sqlmodel import Session, create_engine, select

from app.core.config import settings

# Import your models
from app.models.models import (
    Goal,
    Habit,
    Insight,
    Journal,
    LifeArea,
    MoodEnum,
    Skill,
    User,
)

# Database connection
engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))


# Populate the data
def populate_database() -> None:
    with Session(engine) as session:
        # 1. Insert User
        user = User(
            email="sara@example.com",
            full_name="Sara Smith",
            hashed_password="$2b$12$dKTXdn3FXGmay8X/MxykRO16TBc0SBslNYqto61jh3gVxrbUUSHXW",
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        user_db = session.exec(select(User).where(User.email == user.email)).first()
        if not user_db:
            session.add(user)
            session.commit()
        else:
            user = user_db
        # 2. Insert Skills
        skills = ["Python", "JavaScript", "SQL"]
        career_lifeArea = session.exec(
            select(LifeArea).where(LifeArea.name == "Career")
        ).first()
        for name in skills:
            skill = Skill(
                name=name,
                description=f"Learn {name} to become a proficient programmer.",
                is_global=True,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                lifeAreas=[career_lifeArea],
            )
            session.add(skill)
        session.commit()

        user_id = user.id
        # # 4. Insert Goals
        goals = ["Master Python Programming"]
        for goal_text in goals:
            goal = Goal(
                user_id=user_id,
                goal=goal_text,
                is_smart=True,
                is_achieved=False,
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
                lifeArea=career_lifeArea,
            )
            session.add(goal)
        session.commit()
        # # 5. Insert Habits
        habits = ["Code for 2 hours", "leetcode"]
        for habit_text in habits:
            habit = Habit(
                name=habit_text,
                description=f"Develop the habit to {habit_text.lower()} to improve programming skills.",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(habit)
        session.commit()
        # 6. Insert Journal Entries
        for i in range(5):
            journal = Journal(
                user_id=user_id,
                title=f"Daily Reflection {i+1}",
                entry_date=(datetime.now() - timedelta(days=i)).date(),
                content="Today I worked on Python. It was challenging but rewarding.",
                mood=MoodEnum.ANGRY,
            )
        session.add(journal)
        session.commit()

        # 8. Insert Insights
        insights = ["Programming Insight 1"]
        for title in insights:
            insight = Insight(
                user_id=user_id,
                title=title,
                description="Today I realized that Python is more intuitive than I thought.",
                created_at=datetime.utcnow(),
                updated_at=datetime.utcnow(),
            )
            session.add(insight)
        session.commit()


if __name__ == "__main__":
    populate_database()

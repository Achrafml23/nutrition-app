from collections.abc import Sequence
from datetime import datetime
from typing import Any

from sqlmodel import Session, create_engine, select

from app.core.config import settings

# Import your models
from app.models.models import (
    Concept,
    FrequencyEnum,
    Habit,
    LifeArea,
    Reminder,
    Resource,
    User,
    WheelOfLife,
)

changethis_password = "$2b$12$dKTXdn3FXGmay8X/MxykRO16TBc0SBslNYqto61jh3gVxrbUUSHXW"


def get_or_create_user(
    session: Session, persona: dict[str, str], lifeArea_objects: list[LifeArea]
) -> User:
    # Create user
    user = session.exec(select(User).where(User.email == persona["email"])).first()
    if not user:
        user = User(
            email=persona["email"],
            full_name=persona["full_name"],
            hashed_password=changethis_password,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        session.add(user)
        session.commit()
        user_id = user.id
        # Create wheel for the user
        wheel = WheelOfLife(
            user_id=user_id,
            lifeAreas=lifeArea_objects,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
        )
        session.add(wheel)
        session.commit()
    return user


def get_lifeAreas(session: Session) -> Sequence[LifeArea]:
    statement = select(LifeArea)
    results = session.exec(statement)
    return results.all()


# Seed data
def populate_database(session: Session) -> None:
    personas = [
        # {"email": "mom@example.com", "full_name": "Lily Smith", "persona": "Mom"},
        # {"email": "entrepreneur@example.com", "full_name": "James Johnson", "persona": "Young Entrepreneur"},
        # {"email": "enthusiast@example.com", "full_name": "Emma Brown", "persona": "Self-Improvement Enthusiast"}
        # {"email": "founder@example.com", "full_name": "Thereal Founder", "persona": "Founder"}
        {
            "email": "dead@example.com",
            "full_name": "Dead Serious",
            "persona": "DeadAlive",
        }
    ]

    lifeArea_objects = list(get_lifeAreas(session))
    for persona in personas:
        #     # Create user
        user = get_or_create_user(session, persona, lifeArea_objects)
        user_id = user.id
        # #Create events
        # for i in range(1, 11):
        #     event = Event(
        #         user_id=user.id,
        #         title=f"Event {i} for {persona['email']}",
        #         description=f"Description for Event {i}",
        #         event_type=EventTypeEnum.MEETING,
        #         start_datetime=datetime.now() - timedelta(days=1),
        #         end_datetime=datetime.now(),
        #         is_all_day=True,
        #         recurring_rule=RecurringRuleEnum.MONTHLY,
        #         location= "San francisco",
        #         reminder_time=None,
        #         status=StatusEnum.COMPLETED,
        #         color="Grey",
        #         reflection=f"This is was a good day {i}",
        #         mood=MoodEnum.HAPPY
        #     )
        #     session.add(event)
        #     session.commit()

        # #Create journals
        # for i in range(1,11):
        #     journal = Journal(
        #         user_id=user.id,
        #         title=f"Journal {i}",
        #         entry_date= datetime.now(),
        #         content=f"This is the content {i}",
        #         tags=f"all tags are here {i}",
        #         mood=MoodEnum.ANGRY
        #     )
        #     session.add(journal)
        # session.commit()

        # # Create lifeAreas for the wheel
        # for lifeArea in lifeArea_objects:
        #     #* Create trackables
        #     for i in range(5):
        #         trackable = Trackable(
        #             user_id=user.id,
        #             lifearea_id=lifeArea.id,
        #             name=f"Trackable {i} for {lifeArea.name}",
        #             description=f"Description Trackable {i} for {lifeArea.name}",
        #         )
        #         session.add(trackable)
        #         session.commit()
        #         #* Create entries
        #         for i in range(10):
        #             entry = Entry(
        #                 value_numeric= random.randint(100,200),
        #                 trackable_id=trackable.id,
        #                 notes=f"Notes for entry {i}",
        #                 entry_timestamp=datetime.now(timezone.utc)
        #             )
        #             session.add(entry)
        #             session.commit()
        #     #* Create goals for each lifeArea
        #     for i in range(1, 2):  # 10 goals per lifeArea
        #         goal = Goal(
        #             user_id=user_id,
        #             lifearea_id=lifeArea.id,
        #             goal=f"Goal {i+1} for {lifeArea.name} ({persona['persona']})",
        #             is_smart=True,
        #             is_achieved=i < 5,  # First 5 goals are achieved
        #             priority=(i % 3) + 1,  # Random priority
        #             created_at=datetime.utcnow(),
        #             updated_at=datetime.utcnow()
        #         )
        #         session.add(goal)
        #         session.commit()
        #         #* Create skills
        #         for i in range(1, 2):
        #             skill = Skill(
        #                 name=f"Skill {i+1} for {goal.goal}",
        #                 description=f"Skill for {goal.goal} description",
        #                 is_global=False
        #             )
        #             session.commit()
        #             session.add(skill)
        #             goal_skill_link  = SkillGoalLink(
        #                 user_id=user.id,
        #                 goal_id = goal.id,
        #                 skill_id=skill.id
        #             )
        #             session.add(goal_skill_link)
        #             #* Create skill progress
        #             for i in range(1,10):
        #                 skill_progress = SkillProgress(
        #                     skill_id=skill.id,
        #                     user_id=user.id,
        #                     notes=f"Notes {i} for {skill.name}",
        #                     activity=f"Activity {i} for {skill.name}",
        #                     activity_date=datetime.now(),
        #                     hours_spent=random.randint(2,10),
        #                 )
        #                 session.add(skill_progress)
        #                 session.commit()
        #         session.commit()
        for i in range(10):
            r = Reminder(
                user_id=user_id,
                title=f"Reminder {i}",
                description=f"Description for Reminder {i}",
                due_date=datetime.now(),
                reminder_time=datetime.now(),
                repeat_frequency=FrequencyEnum.DAILY,
            )
            session.add(r)
        session.commit()


def populate_global_database(session: Session) -> None:
    resources: list[dict[str, Any]] = [
        {
            "title": "5AM club",
            "description": "A concept advocating for waking up early to maximize productivity and personal growth.",
            "concepts": [
                {
                    "name": "Early Rising",
                    "description": "The idea that starting your day early gives you more time for self-development and planning.",
                },
                {
                    "name": "Morning Routine",
                    "description": "Structuring your mornings to include exercise, reflection, and planning for an efficient day.",
                },
            ],
            "habits": [
                {
                    "name": "Wake up at 5AM",
                    "description": "Set an alarm and wake up consistently at 5AM every day.",
                },
                {
                    "name": "Morning Journaling",
                    "description": "Write down daily goals and reflections every morning.",
                },
            ],
        },
        {
            "title": "Why we sleep",
            "description": "An exploration of the importance of sleep for mental and physical health.",
            "concepts": [
                {
                    "name": "Sleep Cycles",
                    "description": "Understanding the stages of sleep and their impact on recovery and cognition.",
                },
                {
                    "name": "Sleep Hygiene",
                    "description": "Practices that promote consistent and high-quality sleep.",
                },
            ],
            "habits": [
                {
                    "name": "Consistent Sleep Schedule",
                    "description": "Go to bed and wake up at the same time daily, even on weekends.",
                },
                {
                    "name": "Screen-Free Hour",
                    "description": "Avoid screens at least one hour before bedtime.",
                },
            ],
        },
        {
            "title": "Atomic Habits",
            "description": "A guide to building good habits and breaking bad ones through small, consistent changes.",
            "concepts": [
                {
                    "name": "Habit Stacking",
                    "description": "Pairing a new habit with an existing one to make it easier to implement.",
                },
                {
                    "name": "The 1% Rule",
                    "description": "Focusing on small improvements that compound over time.",
                },
            ],
            "habits": [
                {
                    "name": "Track One Habit",
                    "description": "Choose one habit to track daily progress.",
                },
                {
                    "name": "Reward System",
                    "description": "Create small rewards for completing habits consistently.",
                },
            ],
        },
        {
            "title": "No more Mr.nice guy",
            "description": "A book encouraging men to break free from people-pleasing behaviors.",
            "concepts": [
                {
                    "name": "Boundaries",
                    "description": "The importance of setting clear personal limits.",
                },
                {
                    "name": "Authenticity",
                    "description": "Living true to oneself rather than seeking constant approval.",
                },
            ],
            "habits": [
                {
                    "name": "Say No",
                    "description": "Practice saying no to requests that do not align with your values.",
                },
                {
                    "name": "Express Needs",
                    "description": "Communicate your needs openly and assertively.",
                },
            ],
        },
        {
            "title": "Dare Greatly",
            "description": "Encourages embracing vulnerability as a strength, not a weakness.",
            "concepts": [
                {
                    "name": "Vulnerability",
                    "description": "Allowing yourself to be open and honest, even when it feels risky.",
                },
                {
                    "name": "Shame Resilience",
                    "description": "Developing the ability to recover from feelings of shame.",
                },
            ],
            "habits": [
                {
                    "name": "Daily Gratitude",
                    "description": "List three things you are grateful for each day.",
                },
                {
                    "name": "Share Honestly",
                    "description": "Share a personal truth with someone you trust once a week.",
                },
            ],
        },
        {
            "title": "Imperfections",
            "description": "Exploring the beauty and strength in embracing flaws and imperfections.",
            "concepts": [
                {
                    "name": "Self-Acceptance",
                    "description": "The practice of embracing your flaws as part of your identity.",
                },
                {
                    "name": "Resilience",
                    "description": "The ability to bounce back from challenges and setbacks.",
                },
            ],
            "habits": [
                {
                    "name": "Affirmations",
                    "description": "Repeat positive affirmations to yourself daily.",
                },
                {
                    "name": "Reflect on Strengths",
                    "description": "Write down one thing you did well each day.",
                },
            ],
        },
        {
            "title": "4 hours week",
            "description": "A guide to achieving more by working less through smart productivity techniques.",
            "concepts": [
                {
                    "name": "80/20 Rule",
                    "description": "Focus on the 20% of activities that bring 80% of the results.",
                },
                {
                    "name": "Outsourcing",
                    "description": "Delegate tasks that are not the best use of your time.",
                },
            ],
            "habits": [
                {
                    "name": "Time Blocking",
                    "description": "Schedule focused blocks of time for high-priority tasks.",
                },
                {
                    "name": "Delegate One Task",
                    "description": "Find one task to outsource or delegate each week.",
                },
            ],
        },
        {
            "title": "How to make friends and influence people",
            "description": "A classic guide to building better relationships and effective communication.",
            "concepts": [
                {
                    "name": "Empathy",
                    "description": "Understanding and sharing the feelings of others.",
                },
                {
                    "name": "Active Listening",
                    "description": "Fully focusing on and understanding what others are saying.",
                },
            ],
            "habits": [
                {
                    "name": "Give Compliments",
                    "description": "Compliment at least one person genuinely every day.",
                },
                {
                    "name": "Ask Open-Ended Questions",
                    "description": "Engage in meaningful conversations by asking thoughtful questions.",
                },
            ],
        },
    ]
    for resource in resources:
        resource_concepts = []
        for concept in resource.get("concepts", []):
            c = Concept(
                name=concept.get("name"), description=concept.get("description")
            )
            session.add(c)
            resource_concepts.append(c)
        resource_habits = []
        for habit in resource.get("habits", {}):
            h = Habit(name=habit.get("name"), description=habit.get("description"))
            session.add(h)
            resource_habits.append(h)
        session.commit()
        r = Resource(
            title=resource.get("title"),
            description=resource.get("description"),
            habits=resource_habits,
            concepts=resource_concepts,
        )
        session.add(r)
    session.commit()
    habits = [
        {
            "name": "Morning Meditation",
            "description": "Spend 10-15 minutes meditating every morning to cultivate mindfulness and reduce stress.",
            "category": "Mindfulness",
            "benefits": "Improves focus, reduces anxiety, and enhances emotional regulation.",
            "tips": "Start with guided meditations and gradually practice unguided sessions.",
        },
        {
            "name": "Daily Journaling",
            "description": "Write down your thoughts, goals, and reflections daily to improve self-awareness and clarity.",
            "category": "Self-Reflection",
            "benefits": "Helps process emotions, track progress, and clarify priorities.",
            "tips": "Set aside a specific time each day and use prompts if you're unsure what to write.",
        },
        {
            "name": "Exercise Routine",
            "description": "Engage in 30 minutes of physical activity each day to boost energy and maintain health.",
            "category": "Health",
            "benefits": "Improves physical fitness, mental health, and overall well-being.",
            "tips": "Choose activities you enjoy, such as dancing, running, or yoga.",
        },
        {
            "name": "Reading Habit",
            "description": "Read for 20-30 minutes daily to expand knowledge and improve focus.",
            "category": "Learning",
            "benefits": "Enhances cognitive abilities and broadens perspective.",
            "tips": "Keep a book nearby and set a reading goal for each month.",
        },
        {
            "name": "Hydration Habit",
            "description": "Drink at least 8 glasses of water a day to maintain optimal health.",
            "category": "Health",
            "benefits": "Boosts energy levels, supports skin health, and aids digestion.",
            "tips": "Use a water-tracking app or carry a reusable water bottle.",
        },
    ]
    concepts = [
        {
            "name": "Growth Mindset",
            "description": "The belief that abilities and intelligence can be developed through dedication and hard work.",
            "category": "Psychology",
            "benefits": "Encourages resilience, adaptability, and continuous learning.",
            "application": "Embrace challenges, learn from feedback, and persist through difficulties.",
        },
        {
            "name": "Pareto Principle",
            "description": "The idea that 80% of outcomes come from 20% of efforts.",
            "category": "Productivity",
            "benefits": "Helps prioritize tasks that yield the most significant results.",
            "application": "Identify the 20% of tasks that drive your goals and focus on them.",
        },
        {
            "name": "Mindfulness",
            "description": "The practice of being fully present and engaged in the moment without judgment.",
            "category": "Mindfulness",
            "benefits": "Reduces stress, improves focus, and enhances overall well-being.",
            "application": "Incorporate mindfulness into daily activities like eating, walking, or working.",
        },
        {
            "name": "SMART Goals",
            "description": "A framework for setting goals that are Specific, Measurable, Achievable, Relevant, and Time-bound.",
            "category": "Goal Setting",
            "benefits": "Increases clarity and likelihood of achieving goals.",
            "application": "Write goals following the SMART criteria and review progress regularly.",
        },
        {
            "name": "Kaizen",
            "description": "A philosophy of continuous improvement through small, incremental changes.",
            "category": "Productivity",
            "benefits": "Builds momentum, reduces resistance to change, and fosters innovation.",
            "application": "Focus on one small improvement each day to make meaningful progress over time.",
        },
    ]
    for concept in concepts:
        c = Concept(name=concept.get("name"), description=concept.get("description"))
        session.add(c)
    for habit in habits:
        h = Habit(name=habit.get("name"), description=habit.get("description"))
        session.add(h)
    session.commit()


if __name__ == "__main__":
    # Ensure the database is set up
    # Database connection
    DATABASE_URL = "sqlite:///development.db"  # Replace with your database URL (e.g., PostgreSQL or MySQL)

    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))
    with Session(engine) as session:
        populate_database(session)
        # seed_db(session)
        # populate_global_database(session)

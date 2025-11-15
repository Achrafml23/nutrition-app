"""Seed core values into the database."""

from sqlmodel import Session, select


def seed_core_values(session: Session) -> None:
    """
    Seed default core values into the database.
    These are system-wide values that users can assess.
    """
    core_values_data = [
        {
            "name": "Achievement",
            "description": "Accomplishing goals and making progress",
            "category": "Personal",
        },
        {
            "name": "Adventure",
            "description": "New and exciting experiences",
            "category": "Personal",
        },
        {
            "name": "Authenticity",
            "description": "Being genuine and true to yourself",
            "category": "Personal",
        },
        {
            "name": "Balance",
            "description": "Harmony among different aspects of life",
            "category": "Personal",
        },
        {
            "name": "Compassion",
            "description": "Caring for the suffering of others",
            "category": "Relational",
        },
        {
            "name": "Connection",
            "description": "Close relationships with others",
            "category": "Relational",
        },
        {
            "name": "Creativity",
            "description": "Using imagination and original ideas",
            "category": "Personal",
        },
        {
            "name": "Curiosity",
            "description": "Desire to learn and explore",
            "category": "Personal",
        },
        {
            "name": "Fairness",
            "description": "Equal treatment and justice",
            "category": "Relational",
        },
        {
            "name": "Family",
            "description": "Prioritizing family relationships",
            "category": "Relational",
        },
        {
            "name": "Freedom",
            "description": "Independence and autonomy",
            "category": "Personal",
        },
        {
            "name": "Friendship",
            "description": "Close, supportive relationships",
            "category": "Relational",
        },
        {
            "name": "Generosity",
            "description": "Giving freely to others",
            "category": "Relational",
        },
        {
            "name": "Gratitude",
            "description": "Appreciating what you have",
            "category": "Personal",
        },
        {
            "name": "Growth",
            "description": "Continuous personal development",
            "category": "Personal",
        },
        {
            "name": "Health",
            "description": "Physical and mental wellbeing",
            "category": "Personal",
        },
        {
            "name": "Honesty",
            "description": "Truthfulness and integrity",
            "category": "Personal",
        },
        {
            "name": "Humor",
            "description": "Finding joy and laughter",
            "category": "Personal",
        },
        {
            "name": "Independence",
            "description": "Self-reliance and autonomy",
            "category": "Personal",
        },
        {
            "name": "Influence",
            "description": "Having an impact on others",
            "category": "Professional",
        },
        {
            "name": "Kindness",
            "description": "Being considerate and generous",
            "category": "Relational",
        },
        {
            "name": "Knowledge",
            "description": "Learning and understanding",
            "category": "Personal",
        },
        {
            "name": "Leadership",
            "description": "Guiding and inspiring others",
            "category": "Professional",
        },
        {
            "name": "Love",
            "description": "Deep affection and connection",
            "category": "Relational",
        },
        {
            "name": "Loyalty",
            "description": "Faithful commitment to others",
            "category": "Relational",
        },
        {
            "name": "Mindfulness",
            "description": "Present moment awareness",
            "category": "Personal",
        },
        {
            "name": "Optimism",
            "description": "Positive outlook on life",
            "category": "Personal",
        },
        {
            "name": "Passion",
            "description": "Intense enthusiasm for activities",
            "category": "Personal",
        },
        {
            "name": "Peace",
            "description": "Inner calm and tranquility",
            "category": "Personal",
        },
        {
            "name": "Perseverance",
            "description": "Persistence despite challenges",
            "category": "Personal",
        },
        {
            "name": "Power",
            "description": "Strength and influence over others",
            "category": "Professional",
        },
        {
            "name": "Recognition",
            "description": "Being acknowledged for contributions",
            "category": "Professional",
        },
        {
            "name": "Respect",
            "description": "Admiration for others and self",
            "category": "Relational",
        },
        {
            "name": "Responsibility",
            "description": "Being accountable for actions",
            "category": "Personal",
        },
        {
            "name": "Security",
            "description": "Safety and stability",
            "category": "Personal",
        },
        {
            "name": "Self-discipline",
            "description": "Control over actions and habits",
            "category": "Personal",
        },
        {
            "name": "Spirituality",
            "description": "Connection to something greater",
            "category": "Personal",
        },
        {
            "name": "Success",
            "description": "Achievement of desired outcomes",
            "category": "Professional",
        },
        {
            "name": "Tradition",
            "description": "Customs and beliefs from the past",
            "category": "Personal",
        },
        {
            "name": "Wealth",
            "description": "Abundance of money and possessions",
            "category": "Professional",
        },
        {
            "name": "Wisdom",
            "description": "Deep understanding and insight",
            "category": "Personal",
        },
    ]

    # Check if core values already exist
    existing_values = session.exec(select(CoreValue)).all()
    if existing_values:
        print(f"Core values already seeded ({len(existing_values)} values found)")
        return

    # Create core values
    print(f"Seeding {len(core_values_data)} core values...")
    for value_data in core_values_data:
        core_value = CoreValue(**value_data)
        session.add(core_value)

    session.commit()
    print(f"Successfully seeded {len(core_values_data)} core values!")


if __name__ == "__main__":
    from sqlmodel import create_engine

    from app.core.config import settings

    engine = create_engine(str(settings.SQLALCHEMY_DATABASE_URI))

    with Session(engine) as session:
        seed_core_values(session)

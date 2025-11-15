# ============================================================================
# TESTING
# backend/tests/services/test_reminder_service.py
# ============================================================================

"""
import pytest
from datetime import datetime, timedelta, timezone
from uuid import uuid4

from app.services.reminders.reminder_service import UniversalReminderService
from app.models.scheduled_reminder import ReminderType, ReminderStatus
from app.models.models import Habit


@pytest.mark.asyncio
async def test_create_habit_reminders(session, test_user):
    '''Test creating reminders for a habit'''

    # Create habit
    habit = Habit(
        user_id=test_user.id,
        name="Morning Meditation",
        frequency={"type": "daily", "time": "09:00"},
        reminders={"enabled": True, "advanceNotice": 15},
        levels={"mini": "5 minutes", "medium": "10 minutes", "max": "20 minutes"}
    )
    session.add(habit)
    session.commit()

    # Schedule reminders
    service = UniversalReminderService()
    reminders = await service.schedule_reminders(
        session=session,
        reminder_type=ReminderType.HABIT,
        entity=habit,
        days_ahead=3
    )

    # Verify
    assert len(reminders) == 3
    assert all(r.reminder_type == ReminderType.HABIT for r in reminders)
    assert all(r.entity_id == habit.id for r in reminders)
    assert all(r.status == ReminderStatus.PENDING for r in reminders)


@pytest.mark.asyncio
async def test_snooze_reminder(session, test_user):
    '''Test snoozing a reminder'''

    # Create reminder
    reminder = ScheduledReminder(
        user_id=test_user.id,
        reminder_type=ReminderType.HABIT,
        entity_id=uuid4(),
        entity_type="Habit",
        scheduled_for=datetime.now(timezone.utc) + timedelta(hours=2),
        reminder_time=datetime.now(timezone.utc) + timedelta(hours=1, minutes=45),
        status=ReminderStatus.PENDING,
        event_type="HABIT_REMINDER",
        context={}
    )
    session.add(reminder)
    session.commit()

    # Snooze for 30 minutes
    service = UniversalReminderService()
    snoozed = await service.snooze_reminder(session, reminder.id, minutes=30)

    # Verify
    assert snoozed.status == ReminderStatus.SNOOZED
    assert snoozed.snoozed_until is not None
    assert snoozed.snoozed_until > datetime.now(timezone.utc)


@pytest.mark.asyncio
async def test_dismiss_reminder(session, test_user):
    '''Test dismissing a reminder'''

    # Create reminder
    reminder = ScheduledReminder(
        user_id=test_user.id,
        reminder_type=ReminderType.HABIT,
        entity_id=uuid4(),
        entity_type="Habit",
        scheduled_for=datetime.now(timezone.utc) + timedelta(hours=2),
        reminder_time=datetime.now(timezone.utc) + timedelta(hours=1, minutes=45),
        status=ReminderStatus.PENDING,
        event_type="HABIT_REMINDER",
        context={}
    )
    session.add(reminder)
    session.commit()

    # Dismiss
    service = UniversalReminderService()
    dismissed = await service.dismiss_reminder(session, reminder.id)

    # Verify
    assert dismissed.status == ReminderStatus.DISMISSED
    assert dismissed.dismissed_at is not None
"""

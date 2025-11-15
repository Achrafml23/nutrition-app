from datetime import datetime
from typing import Any, Literal
from uuid import UUID

from pydantic import BaseModel, Field, field_validator
from sqlmodel import JSON, Column, SQLModel
from sqlmodel import Field as SQLField

# ===============================================
# JSON SCHEMA MODELS (Pydantic BaseModel)
# ===============================================


class QuickAddSettings(BaseModel):
    """Settings for quick habit creation"""

    default_habit_type: Literal[
        "keystone", "atomic", "deep_work", "compounding", "social", "avoidance"
    ] = "atomic"
    default_is_elastic: bool = True
    default_frequency_type: Literal["daily", "weekly", "monthly", "custom"] = "daily"
    default_frequency_value: int = 1
    auto_set_reminders: bool = True
    default_reminder_time: str = "09:00"  # HH:MM format
    skip_habit_form_steps: list[str] = Field(
        default_factory=list
    )  # e.g., ["description", "rewards"]
    default_life_area_id: UUID | None = None
    show_preset_suggestions: bool = True
    auto_generate_levels: bool = True  # For elastic habits
    defaultMiniPrefix: str | None = "Do"
    defaultMediumMultiplier: int | None = 5
    defaultMaxMultiplier: int | None = 10
    defaultIdentityPrefix: str | None = "I am someone who"

    @field_validator("default_reminder_time")
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        """Validate time is in HH:MM format"""
        if v:
            try:
                time_parts = v.split(":")
                if len(time_parts) != 2:
                    raise ValueError("Time must be in HH:MM format")
                hour, minute = int(time_parts[0]), int(time_parts[1])
                if not (0 <= hour <= 23 and 0 <= minute <= 59):
                    raise ValueError("Invalid time values")
            except (ValueError, AttributeError):
                raise ValueError("Time must be in HH:MM format")
        return v

    @field_validator("skip_habit_form_steps")
    @classmethod
    def validate_form_steps(cls, v: list[str]) -> list[str]:
        """Validate form steps are valid"""
        valid_steps = [
            "description",
            "rewards",
            "cue",
            "timers",
            "life_areas",
            "identity",
            "goal",
            "stack",
        ]
        if v:
            invalid_steps = [step for step in v if step not in valid_steps]
            if invalid_steps:
                raise ValueError(f"Invalid form steps: {invalid_steps}")
        return v


class NotificationSettings(BaseModel):
    """Notification preferences"""

    email_enabled: bool = True
    push_enabled: bool = True
    in_app_enabled: bool = True
    sound_enabled: bool = True
    vibration_enabled: bool = True

    # Timing preferences
    quiet_hours_enabled: bool = False
    quiet_hours_start: str = "22:00"  # HH:MM format
    quiet_hours_end: str = "07:00"  # HH:MM format
    weekend_notifications: bool = True

    # Habit-specific notifications
    habit_reminders: bool = True
    streak_celebrations: bool = True
    milestone_alerts: bool = True
    weekly_summaries: bool = True
    missed_habit_alerts: bool = True

    # Timing for different notification types
    reminder_advance_time: int = 5  # minutes before scheduled time
    streak_celebration_delay: int = 30  # minutes after completion
    missed_habit_delay: int = 60  # minutes after missed deadline

    # Frequency controls
    max_daily_notifications: int = 10
    batch_notifications: bool = False  # Group multiple notifications

    @field_validator("quiet_hours_start", "quiet_hours_end")
    @classmethod
    def validate_time_format(cls, v: str) -> str:
        """Validate time is in HH:MM format"""
        if v:
            try:
                time_parts = v.split(":")
                if len(time_parts) != 2:
                    raise ValueError("Time must be in HH:MM format")
                hour, minute = int(time_parts[0]), int(time_parts[1])
                if not (0 <= hour <= 23 and 0 <= minute <= 59):
                    raise ValueError("Invalid time values")
            except (ValueError, AttributeError):
                raise ValueError("Time must be in HH:MM format")
        return v

    @field_validator(
        "reminder_advance_time", "streak_celebration_delay", "missed_habit_delay"
    )
    @classmethod
    def validate_positive_int(cls, v: int) -> int:
        """Validate time values are positive"""
        if v is not None and v < 0:
            raise ValueError("Time values must be positive")
        return v

    @field_validator("max_daily_notifications")
    @classmethod
    def validate_max_notifications(cls, v: int) -> int:
        """Validate max notifications is reasonable"""
        if v is not None and not (1 <= v <= 50):
            raise ValueError("Max daily notifications must be between 1 and 50")
        return v


# ===============================================
# SQLMODEL SCHEMAS
# ===============================================


class UserSettingsBase(SQLModel):
    """Base user settings model"""

    # Habits settings
    quick_add_settings: dict[str, Any] = SQLField(
        default_factory=lambda: QuickAddSettings().model_dump(), sa_column=Column(JSON)
    )
    streak_protection_enabled: bool = SQLField(default=False)
    rest_days: list[int] = SQLField(default_factory=list, sa_column=Column(JSON))

    @field_validator("rest_days")
    @classmethod
    def validate_rest_days(cls, v: list[int]) -> list[int]:
        """Validate rest days are valid weekday numbers (0-6)"""
        if v:
            invalid_days = [
                day for day in v if not isinstance(day, int) or day < 0 or day > 6
            ]
            if invalid_days:
                raise ValueError(
                    f"Invalid rest days: {invalid_days}. Must be integers 0-6 (0=Sunday)"
                )
        return v


class UserSettingsRead(UserSettingsBase):
    """User settings read schema"""

    id: UUID
    user_id: UUID
    created_at: datetime
    updated_at: datetime


class UserSettingsUpdate(SQLModel):
    """User settings update schema"""

    quick_add_settings: QuickAddSettings | None = None
    streak_protection_enabled: bool | None = None
    rest_days: list[int] | None = None

    @field_validator("rest_days")
    @classmethod
    def validate_rest_days(cls, v: list[int] | None) -> list[int] | None:
        """Validate rest days are valid weekday numbers (0-6)"""
        if v is not None:
            invalid_days = [
                day for day in v if not isinstance(day, int) or day < 0 or day > 6
            ]
            if invalid_days:
                raise ValueError(
                    f"Invalid rest days: {invalid_days}. Must be integers 0-6 (0=Sunday)"
                )
        return v


class UserSettingsCreate(SQLModel):
    """User settings creation schema"""

    quick_add_settings: QuickAddSettings
    streak_protection_enabled: bool = False
    rest_days: list[int] = []

    @field_validator("rest_days")
    @classmethod
    def validate_rest_days(cls, v: list[int]) -> list[int]:
        """Validate rest days are valid weekday numbers (0-6)"""
        if v:
            invalid_days = [
                day for day in v if not isinstance(day, int) or day < 0 or day > 6
            ]
            if invalid_days:
                raise ValueError(
                    f"Invalid rest days: {invalid_days}. Must be integers 0-6 (0=Sunday)"
                )
        return v


# ===============================================
# RESPONSE SCHEMAS WITH PARSED JSON
# ===============================================


class UserSettingsPublic(SQLModel):
    """Public user settings with parsed JSON fields"""

    id: UUID
    user_id: UUID
    quick_add_settings: QuickAddSettings
    streak_protection_enabled: bool
    rest_days: list[int]
    created_at: datetime
    updated_at: datetime


def merge_notification_preferences(current_prefs, updates):
    filtered_updates = {k: v for k, v in updates.items() if v is not None}
    merged = NotificationSettings(**(current_prefs or {}), **filtered_updates)
    return merged.model_dump()

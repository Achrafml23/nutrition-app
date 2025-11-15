from datetime import date, datetime, time, timedelta
from zoneinfo import ZoneInfo


class TimezoneUtils:
    """Timezone-aware date utilities for server-side operations"""

    @staticmethod
    def get_today_in_timezone(timezone_str: str) -> date:
        """Get today's date in a specific timezone"""
        try:
            tz = ZoneInfo(timezone_str)
            now_in_tz = datetime.now(tz)
            return now_in_tz.date()
        except Exception as e:
            # Fallback to UTC if timezone is invalid
            print(f"Invalid timezone {timezone_str}, falling back to UTC: {e}")
            return date.today()

    @staticmethod
    def get_current_datetime_in_timezone(timezone_str: str) -> datetime:
        """Get current datetime in a specific timezone"""
        try:
            tz = ZoneInfo(timezone_str)
            return datetime.now(tz)
        except Exception as e:
            print(f"Invalid timezone {timezone_str}, falling back to UTC: {e}")
            return datetime.now(ZoneInfo("UTC"))

    @staticmethod
    def is_today_in_timezone(check_date: date, timezone_str: str) -> bool:
        """Check if a date is 'today' in a specific timezone"""
        today_in_tz = TimezoneUtils.get_today_in_timezone(timezone_str)
        return check_date == today_in_tz

    @staticmethod
    def get_last_n_days_range(days: int, timezone_str: str) -> tuple[date, date]:
        """Get date range for last N days in user's timezone"""
        end_date = TimezoneUtils.get_today_in_timezone(timezone_str)
        start_date = end_date - timedelta(days=days - 1)  # Include today
        return start_date, end_date

    @staticmethod
    def create_timezone_aware_datetime(
        target_date: date, target_time: time, timezone_str: str
    ) -> datetime:
        """Create a timezone-aware datetime from date and time components"""
        try:
            tz = ZoneInfo(timezone_str)
            return datetime.combine(target_date, target_time, tzinfo=tz)
        except Exception as e:
            print(f"Invalid timezone {timezone_str}, falling back to UTC: {e}")
            return datetime.combine(target_date, target_time, tzinfo=ZoneInfo("UTC"))

    @staticmethod
    def to_utc(local_datetime: datetime) -> datetime:
        """Convert timezone-aware datetime to UTC"""
        return local_datetime.astimezone(ZoneInfo("UTC"))

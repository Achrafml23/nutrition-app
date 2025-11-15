# # backend/app/tasks/advanced_habit_triggers.py
# import uuid
# from typing import Any

# from app.core.async_queue import notification_queue
# from app.core.database import async_session


# @notification_queue.register_task("analyze_habit_patterns")
# async def analyze_habit_patterns_task(data: dict[str, Any]):
#     """Analyze user habits and trigger smart notifications"""

#     async with async_session() as session:
#         user_id = uuid.UUID(data["user_id"])

#         # Analyze completion patterns
#         patterns = await analyze_user_completion_patterns(session, user_id)

#         # Trigger smart suggestions
#         for suggestion in patterns["suggestions"]:
#             await notification_queue.enqueue(
#                 "send_smart_timing_suggestion",
#                 {
#                     "user_id": str(user_id),
#                     "habit_id": suggestion["habit_id"],
#                     "habit_name": suggestion["habit_name"],
#                     "suggestion": suggestion,
#                 },
#                 priority=3,
#             )


# @notification_queue.register_task("check_habit_conflicts")
# async def check_habit_conflicts_task(data: dict[str, Any]):
#     """Check for scheduling conflicts and suggest optimizations"""

#     async with async_session() as session:
#         user_id = uuid.UUID(data["user_id"])

#         # Find habits with conflicting reminder times
#         conflicts = await find_scheduling_conflicts(session, user_id)

#         if conflicts:
#             await notification_queue.enqueue(
#                 "send_schedule_optimization",
#                 {"user_id": str(user_id), "conflicts": conflicts},
#                 priority=3,
#             )


# @notification_queue.register_task("motivational_boost")
# async def send_motivational_boost_task(data: dict[str, Any]):
#     """Send motivational boost based on user behavior"""

#     async with async_session() as session:
#         user_id = uuid.UUID(data["user_id"])

#         # Analyze recent performance
#         performance = await analyze_recent_performance(session, user_id)

#         if performance["needs_motivation"]:
#             motivation_type = performance["motivation_type"]

#             await notification_queue.enqueue(
#                 "send_personalized_motivation",
#                 {
#                     "user_id": str(user_id),
#                     "motivation_type": motivation_type,
#                     "performance_data": performance,
#                 },
#                 priority=2,
#             )


# async def analyze_user_completion_patterns(
#     session, user_id: uuid.UUID
# ) -> dict[str, Any]:
#     """AI-powered analysis of user completion patterns"""

#     # This would use ML to analyze patterns
#     # For now, return mock suggestions
#     return {
#         "suggestions": [
#             {
#                 "habit_id": "123",
#                 "habit_name": "Morning Exercise",
#                 "confidence": 0.85,
#                 "reason": "You complete this habit 90% more often between 7-8 AM",
#             }
#         ]
#     }


# async def find_scheduling_conflicts(
#     session, user_id: uuid.UUID
# ) -> list[dict[str, Any]]:
#     """Find habits with conflicting schedules"""

#     # Implementation would check for habits scheduled at same time
#     return []


# async def analyze_recent_performance(session, user_id: uuid.UUID) -> dict[str, Any]:
#     """Analyze if user needs motivational boost"""

#     # Check completion rates, streaks, etc.
#     return {"needs_motivation": False, "motivation_type": "encouragement"}

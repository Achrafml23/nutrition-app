from fastapi import APIRouter

from app.api.routes import (
    avatars,
    days,
    ingredients,
    items,
    login,
    meals,
    users,
    utils,
)

api_router = APIRouter()
api_router.include_router(users.router)
api_router.include_router(login.router)
api_router.include_router(utils.router)
api_router.include_router(items.router)
api_router.include_router(avatars.router)

# Nutrition routes
api_router.include_router(ingredients.router)
api_router.include_router(meals.router)
api_router.include_router(days.router)

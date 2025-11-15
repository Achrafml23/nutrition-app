"""Seed nutrition data with Moroccan ingredients and categories."""
import uuid

from sqlmodel import Session, select

from app.core.db import engine
from app.models.nutrition import Category, Ingredient


def seed_nutrition_data():
    """Seed categories and Moroccan ingredients."""
    with Session(engine) as session:
        # Check if categories already exist
        existing_categories = session.exec(select(Category)).first()
        if existing_categories:
            print("Categories already exist, skipping seed.")
            return

        # Create categories
        categories = [
            Category(
                name_fr="Céréales et Féculents",
                name_en="Grains and Starches",
                name_ar="الحبوب والنشويات",
            ),
            Category(
                name_fr="Légumes",
                name_en="Vegetables",
                name_ar="الخضروات",
            ),
            Category(
                name_fr="Fruits",
                name_en="Fruits",
                name_ar="الفواكه",
            ),
            Category(
                name_fr="Protéines",
                name_en="Proteins",
                name_ar="البروتينات",
            ),
            Category(
                name_fr="Produits Laitiers",
                name_en="Dairy Products",
                name_ar="منتجات الألبان",
            ),
            Category(
                name_fr="Épices et Condiments",
                name_en="Spices and Condiments",
                name_ar="التوابل والبهارات",
            ),
            Category(
                name_fr="Huiles et Graisses",
                name_en="Oils and Fats",
                name_ar="الزيوت والدهون",
            ),
            Category(
                name_fr="Légumineuses",
                name_en="Legumes",
                name_ar="البقوليات",
            ),
        ]

        for category in categories:
            session.add(category)
        session.commit()

        # Refresh to get IDs
        for category in categories:
            session.refresh(category)

        # Create a mapping for easy access
        cat_map = {cat.name_en: cat.id for cat in categories}

        # Moroccan ingredients
        ingredients = [
            # Grains and Starches
            Ingredient(
                category_id=cat_map["Grains and Starches"],
                name_fr="Couscous",
                name_en="Couscous",
                name_ar="الكسكس",
                calories_per_100g=376,
                protein_per_100g=12.8,
                carbohydrates_per_100g=77.4,
                fat_per_100g=0.6,
                fiber_per_100g=5.0,
                sodium_per_100g=10,
                measurement_units=["g", "cup", "tbsp"],
                unit_conversions={"cup": 175, "tbsp": 12},
                default_unit="g",
                typical_serving=150,
                is_traditional=True,
                is_halal=True,
                tags=["grains", "traditional", "moroccan"],
            ),
            Ingredient(
                category_id=cat_map["Grains and Starches"],
                name_fr="Riz",
                name_en="Rice",
                name_ar="الأرز",
                calories_per_100g=130,
                protein_per_100g=2.7,
                carbohydrates_per_100g=28.2,
                fat_per_100g=0.3,
                fiber_per_100g=0.4,
                sodium_per_100g=1,
                measurement_units=["g", "cup"],
                unit_conversions={"cup": 195},
                default_unit="g",
                typical_serving=150,
                is_traditional=True,
                is_halal=True,
                tags=["grains"],
            ),
            # Vegetables
            Ingredient(
                category_id=cat_map["Vegetables"],
                name_fr="Tomate",
                name_en="Tomato",
                name_ar="الطماطم",
                calories_per_100g=18,
                protein_per_100g=0.9,
                carbohydrates_per_100g=3.9,
                fat_per_100g=0.2,
                fiber_per_100g=1.2,
                sodium_per_100g=5,
                measurement_units=["g", "piece"],
                unit_conversions={"piece": 125},
                default_unit="g",
                typical_serving=100,
                is_traditional=True,
                is_halal=True,
                tags=["vegetables", "fresh"],
            ),
            Ingredient(
                category_id=cat_map["Vegetables"],
                name_fr="Oignon",
                name_en="Onion",
                name_ar="البصل",
                calories_per_100g=40,
                protein_per_100g=1.1,
                carbohydrates_per_100g=9.3,
                fat_per_100g=0.1,
                fiber_per_100g=1.7,
                sodium_per_100g=4,
                measurement_units=["g", "piece"],
                unit_conversions={"piece": 110},
                default_unit="g",
                typical_serving=80,
                is_traditional=True,
                is_halal=True,
                tags=["vegetables", "aromatic"],
            ),
            Ingredient(
                category_id=cat_map["Vegetables"],
                name_fr="Carotte",
                name_en="Carrot",
                name_ar="الجزر",
                calories_per_100g=41,
                protein_per_100g=0.9,
                carbohydrates_per_100g=9.6,
                fat_per_100g=0.2,
                fiber_per_100g=2.8,
                sodium_per_100g=69,
                measurement_units=["g", "piece"],
                unit_conversions={"piece": 70},
                default_unit="g",
                typical_serving=80,
                is_traditional=True,
                is_halal=True,
                tags=["vegetables", "root"],
            ),
            # Proteins
            Ingredient(
                category_id=cat_map["Proteins"],
                name_fr="Poulet",
                name_en="Chicken",
                name_ar="الدجاج",
                calories_per_100g=165,
                protein_per_100g=31,
                carbohydrates_per_100g=0,
                fat_per_100g=3.6,
                fiber_per_100g=0,
                sodium_per_100g=82,
                measurement_units=["g"],
                unit_conversions={},
                default_unit="g",
                typical_serving=150,
                is_traditional=True,
                is_halal=True,
                tags=["protein", "poultry", "halal"],
            ),
            Ingredient(
                category_id=cat_map["Proteins"],
                name_fr="Agneau",
                name_en="Lamb",
                name_ar="لحم الضأن",
                calories_per_100g=294,
                protein_per_100g=25,
                carbohydrates_per_100g=0,
                fat_per_100g=21,
                fiber_per_100g=0,
                sodium_per_100g=72,
                measurement_units=["g"],
                unit_conversions={},
                default_unit="g",
                typical_serving=150,
                is_traditional=True,
                is_halal=True,
                tags=["protein", "red meat", "halal", "traditional"],
            ),
            # Legumes
            Ingredient(
                category_id=cat_map["Legumes"],
                name_fr="Pois Chiches",
                name_en="Chickpeas",
                name_ar="الحمص",
                calories_per_100g=364,
                protein_per_100g=19,
                carbohydrates_per_100g=61,
                fat_per_100g=6,
                fiber_per_100g=17,
                sodium_per_100g=24,
                measurement_units=["g", "cup"],
                unit_conversions={"cup": 164},
                default_unit="g",
                typical_serving=100,
                is_traditional=True,
                is_halal=True,
                tags=["legumes", "protein", "traditional"],
            ),
            Ingredient(
                category_id=cat_map["Legumes"],
                name_fr="Lentilles",
                name_en="Lentils",
                name_ar="العدس",
                calories_per_100g=116,
                protein_per_100g=9,
                carbohydrates_per_100g=20,
                fat_per_100g=0.4,
                fiber_per_100g=8,
                sodium_per_100g=2,
                measurement_units=["g", "cup"],
                unit_conversions={"cup": 198},
                default_unit="g",
                typical_serving=100,
                is_traditional=True,
                is_halal=True,
                tags=["legumes", "protein"],
            ),
            # Spices
            Ingredient(
                category_id=cat_map["Spices and Condiments"],
                name_fr="Cumin",
                name_en="Cumin",
                name_ar="الكمون",
                calories_per_100g=375,
                protein_per_100g=17.8,
                carbohydrates_per_100g=44.2,
                fat_per_100g=22.3,
                fiber_per_100g=10.5,
                sodium_per_100g=168,
                measurement_units=["g", "tsp"],
                unit_conversions={"tsp": 2},
                default_unit="g",
                typical_serving=2,
                is_traditional=True,
                is_halal=True,
                tags=["spices", "moroccan"],
            ),
            Ingredient(
                category_id=cat_map["Spices and Condiments"],
                name_fr="Safran",
                name_en="Saffron",
                name_ar="الزعفران",
                calories_per_100g=310,
                protein_per_100g=11.4,
                carbohydrates_per_100g=65.4,
                fat_per_100g=5.9,
                fiber_per_100g=3.9,
                sodium_per_100g=148,
                measurement_units=["g", "pinch"],
                unit_conversions={"pinch": 0.1},
                default_unit="g",
                typical_serving=0.5,
                is_traditional=True,
                is_halal=True,
                tags=["spices", "moroccan", "luxury"],
            ),
            # Oils
            Ingredient(
                category_id=cat_map["Oils and Fats"],
                name_fr="Huile d'Olive",
                name_en="Olive Oil",
                name_ar="زيت الزيتون",
                calories_per_100g=884,
                protein_per_100g=0,
                carbohydrates_per_100g=0,
                fat_per_100g=100,
                fiber_per_100g=0,
                sodium_per_100g=2,
                measurement_units=["g", "tbsp", "ml"],
                unit_conversions={"tbsp": 13.5, "ml": 1},
                default_unit="ml",
                typical_serving=10,
                is_traditional=True,
                is_halal=True,
                tags=["oil", "healthy fat", "mediterranean"],
            ),
            # Dairy
            Ingredient(
                category_id=cat_map["Dairy Products"],
                name_fr="Lait",
                name_en="Milk",
                name_ar="الحليب",
                calories_per_100g=61,
                protein_per_100g=3.2,
                carbohydrates_per_100g=4.8,
                fat_per_100g=3.3,
                fiber_per_100g=0,
                sodium_per_100g=44,
                measurement_units=["ml", "cup"],
                unit_conversions={"cup": 240},
                default_unit="ml",
                typical_serving=250,
                is_traditional=True,
                is_halal=True,
                tags=["dairy"],
            ),
            # Fruits
            Ingredient(
                category_id=cat_map["Fruits"],
                name_fr="Dattes",
                name_en="Dates",
                name_ar="التمر",
                calories_per_100g=277,
                protein_per_100g=1.8,
                carbohydrates_per_100g=75,
                fat_per_100g=0.2,
                fiber_per_100g=7,
                sodium_per_100g=1,
                measurement_units=["g", "piece"],
                unit_conversions={"piece": 7},
                default_unit="g",
                typical_serving=40,
                is_traditional=True,
                is_halal=True,
                tags=["fruits", "dried", "traditional"],
            ),
            Ingredient(
                category_id=cat_map["Fruits"],
                name_fr="Orange",
                name_en="Orange",
                name_ar="البرتقال",
                calories_per_100g=47,
                protein_per_100g=0.9,
                carbohydrates_per_100g=11.8,
                fat_per_100g=0.1,
                fiber_per_100g=2.4,
                sodium_per_100g=0,
                measurement_units=["g", "piece"],
                unit_conversions={"piece": 131},
                default_unit="g",
                typical_serving=130,
                is_traditional=True,
                is_halal=True,
                tags=["fruits", "citrus"],
            ),
        ]

        for ingredient in ingredients:
            session.add(ingredient)

        session.commit()
        print("✅ Nutrition data seeded successfully!")
        print(f"   - Categories: {len(categories)}")
        print(f"   - Ingredients: {len(ingredients)}")


if __name__ == "__main__":
    seed_nutrition_data()

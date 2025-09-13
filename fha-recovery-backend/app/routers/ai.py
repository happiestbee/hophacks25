from fastapi import APIRouter
from app.schemas.ai import MealSuggestion, Affirmation

router = APIRouter()


@router.get("/meal-suggestion", response_model=MealSuggestion)
async def get_meal_suggestion():
    """Get AI-generated meal suggestion for FHA recovery"""
    return MealSuggestion(
        title="Nourishing Quinoa Bowl",
        description=(
            "A gentle, nutrient-dense meal perfect for your recovery journey"
        ),
        ingredients=[
            "1/2 cup quinoa",
            "1/4 avocado, sliced",
            "1/2 cup steamed broccoli",
            "1 tbsp olive oil",
            "1 tbsp pumpkin seeds",
            "Fresh herbs to taste",
        ],
        instructions=[
            "Cook quinoa according to package instructions",
            "Steam broccoli until tender",
            "Combine quinoa and broccoli in a bowl",
            "Top with avocado slices and pumpkin seeds",
            "Drizzle with olive oil and herbs",
            "Enjoy mindfully",
        ],
        nutrition_notes=(
            "Rich in healthy fats, protein, and micronutrients to support "
            "hormonal health"
        ),
        encouragement=(
            "This meal provides gentle nourishment for your body's healing "
            "process"
        ),
    )


@router.get("/daily-affirmation", response_model=Affirmation)
async def get_daily_affirmation():
    """Get AI-generated daily affirmation"""
    affirmations = [
        "I am worthy of healing and recovery",
        "My body is strong and capable of restoration",
        "I honor my journey with patience and compassion",
        "Every small step forward is progress",
        "I trust my body's wisdom and timing",
        "I am deserving of gentle care and nourishment",
        "My recovery is a beautiful act of self-love",
    ]

    import random

    selected_affirmation = random.choice(affirmations)

    return Affirmation(
        text=selected_affirmation,
        category="self-love",
        encouragement=(
            "Remember: healing is not linear, and every day you choose "
            "recovery is a victory."
        ),
    )

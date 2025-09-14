from fastapi import APIRouter, HTTPException
from app.schemas.ai import MealSuggestion, Affirmation, MealInspirationRequest, MealInspirationResponse, RecipeRequest, FullRecipe
from app.schemas.meal_analysis import MealAnalysisRequest, MealAnalysisResponse
from app.core.gemini_client import GeminiClient
from app.core.nutrition_optimizer import NutritionOptimizer
import os

router = APIRouter()

# Initialize Gemini client and nutrition optimizer
try:
    gemini_client = GeminiClient()
    nutrition_optimizer = NutritionOptimizer(gemini_client)
    print("✅ Gemini client initialized successfully")
except ValueError as e:
    print(f"❌ Failed to initialize Gemini client: {e}")
    gemini_client = None
    nutrition_optimizer = None
except Exception as e:
    print(f"❌ Unexpected error initializing Gemini client: {e}")
    gemini_client = None
    nutrition_optimizer = None


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


@router.post("/analyze-meal", response_model=MealAnalysisResponse)
async def analyze_meal(request: MealAnalysisRequest):
    """Analyze a meal using optimized AI analysis for nutritional assessment focused on FHA recovery"""
    
    if not nutrition_optimizer:
        raise HTTPException(
            status_code=503, 
            detail="AI analysis service is not available. Please configure GEMINI_API_KEY."
        )
    
    try:
        # Use optimized analysis that minimizes API calls
        analysis = await nutrition_optimizer.analyze_meal_optimized(
            meal_type=request.meal_type,
            description=request.description,
            image_base64=request.image_base64
        )
        
        return analysis
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error analyzing meal: {str(e)}")
        
        # Return fallback response
        return gemini_client._create_fallback_response(
            request.meal_type, 
            f"Analysis temporarily unavailable: {str(e)}"
        )


@router.post("/meal-inspiration", response_model=MealInspirationResponse)
async def get_meal_inspiration(request: MealInspirationRequest):
    """Generate personalized meal suggestions based on user's daily meals"""
    
    if not gemini_client:
        raise HTTPException(
            status_code=503, 
            detail="AI inspiration service is not available. Please configure GEMINI_API_KEY."
        )
    
    try:
        # Generate meal inspiration using Gemini
        inspiration = gemini_client.generate_meal_inspiration(request.logged_meals)
        return inspiration
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error generating meal inspiration: {str(e)}")
        
        # Return fallback response
        return gemini_client._create_fallback_inspiration()


@router.post("/generate-recipe", response_model=FullRecipe)
async def generate_recipe(request: RecipeRequest):
    """Generate a complete recipe for a specific meal"""
    
    if not gemini_client:
        raise HTTPException(
            status_code=503, 
            detail="AI recipe service is not available. Please configure GEMINI_API_KEY."
        )
    
    try:
        # Generate full recipe using Gemini
        recipe = gemini_client.generate_full_recipe(request.meal_title)
        return recipe
        
    except Exception as e:
        # Log the error (in production, use proper logging)
        print(f"Error generating recipe: {str(e)}")
        
        # Return fallback response
        return gemini_client._create_fallback_recipe(request.meal_title)

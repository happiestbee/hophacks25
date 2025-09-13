import os
import json
import google.generativeai as genai
from google import genai as google_genai
from google.genai import types
from typing import Optional, List
import base64
import uuid
from PIL import Image
from io import BytesIO
from app.schemas.meal_analysis import MealAnalysisResponse, NutrientInfo, HealthAspect
from app.schemas.ai import MealInspirationResponse, MealInspiration, FullRecipe


class GeminiClient:
    def __init__(self):
        # Configure Gemini API
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash')
        self.genai_client = google_genai.Client(api_key=api_key)

    def analyze_meal(self, meal_type: str, description: str, image_base64: Optional[str] = None) -> MealAnalysisResponse:
        """Analyze a meal using Gemini API for nutritional assessment"""
        
        # Construct the prompt for FHA-focused nutritional analysis
        prompt = self._create_analysis_prompt(meal_type, description)
        
        try:
            # For text-only analysis (no image)
            if not image_base64 or image_base64.strip() == "" or image_base64 == "null":
                # Simple text prompt
                response = self.model.generate_content(prompt)
            else:
                # Handle image + text analysis
                # Remove data URL prefix if present
                if image_base64.startswith('data:image'):
                    image_base64 = image_base64.split(',')[1]
                
                try:
                    image_data = base64.b64decode(image_base64)
                    content = [
                        prompt,
                        {
                            'mime_type': 'image/jpeg',
                            'data': image_data
                        }
                    ]
                    response = self.model.generate_content(content)
                except Exception as img_error:
                    print(f"Image processing failed, falling back to text-only: {img_error}")
                    # Fall back to text-only if image processing fails
                    response = self.model.generate_content(prompt)
            
            # Check if response is valid
            if not response or not response.text:
                raise ValueError("Empty response from Gemini API")
            
            # Parse the structured response
            return self._parse_gemini_response(response.text, meal_type)
            
        except Exception as e:
            print(f"Gemini API error in analyze_meal: {str(e)}")
            # Return a fallback response if Gemini fails
            return self._create_fallback_response(meal_type, f"Error: {str(e)}")

    def _create_analysis_prompt(self, meal_type: str, description: str) -> str:
        """Create a detailed prompt for Gemini to analyze meals with encouraging, specific feedback"""
        return f"""
You are an encouraging nutritionist specializing in metabolic and hormonal health recovery. Analyze this {meal_type} meal and provide a warm, encouraging response that highlights what's nutritionally beneficial about each component.

Meal Description: {description}

Write a natural, conversational response (2-3 sentences) that:
- Celebrates the specific nutritional benefits of each food component
- Mentions why these foods are great for energy and health
- Uses encouraging, positive language
- Includes specific details (e.g., "eggs are calorie-dense and provide complete protein")
- Feels personal and supportive
- Ends with a brief suggestion for how to improve the meal or a complementary food/drink

Analysis priorities (incorporate naturally without explicitly mentioning):
- Adequate calorie density for metabolic recovery
- Healthy fats for hormone production (omega-3s, monounsaturated fats)
- Complex carbohydrates for energy restoration
- Quality protein for tissue repair
- Micronutrients supporting metabolic health
- Celebrating nourishing, energy-dense choices

Example style: "What a fantastic breakfast choice! The eggs provide calorie-dense complete protein and healthy fats that support hormone production, while the avocado adds heart-healthy monounsaturated fats. The berries bring antioxidants and fiber for gut health. You're giving your body exactly what it needs to thrive and maintain steady energy throughout the morning! Consider adding a glass of whole milk or a handful of nuts for extra calcium and healthy fats."

IMPORTANT: Provide ONLY the analysis text. Do not include any prefixes like "Here is a response:" or "Analysis:" - just the encouraging nutritional feedback.
"""

    def _parse_gemini_response(self, response_text: str, meal_type: str) -> MealAnalysisResponse:
        """Parse Gemini's natural language response into our schema"""
        # Clean up the response text
        analysis_text = response_text.strip()
        
        # Remove any markdown formatting if present
        if "```" in analysis_text:
            # Remove code block markers
            analysis_text = analysis_text.replace("```", "").strip()
        
        # Remove common AI response prefixes and unnecessary introductory text
        prefixes_to_remove = [
            "Here is a response:",
            "Here's a response:",
            "Analysis:",
            "Here is the analysis:",
            "Here's the analysis:",
            "Response:",
            "Here is my analysis:",
            "Here's my analysis:",
            "Okay, here's the encouraging analysis of the breakfast meal:",
            "Okay, here's the encouraging analysis of the lunch meal:",
            "Okay, here's the encouraging analysis of the dinner meal:",
            "Okay, here's the encouraging analysis of the snack meal:",
            "Okay, here's the encouraging analysis of the meal:",
            "Okay, here's the encouraging analysis:",
            "Here's the encouraging analysis of the breakfast meal:",
            "Here's the encouraging analysis of the lunch meal:",
            "Here's the encouraging analysis of the dinner meal:",
            "Here's the encouraging analysis of the snack meal:",
            "Here's the encouraging analysis of the meal:",
            "Here's the encouraging analysis:",
            "The encouraging analysis:",
            "Encouraging analysis:"
        ]
        
        # Try multiple passes to catch nested prefixes
        for _ in range(3):  # Maximum 3 passes to avoid infinite loops
            original_text = analysis_text
            for prefix in prefixes_to_remove:
                if analysis_text.lower().startswith(prefix.lower()):
                    analysis_text = analysis_text[len(prefix):].strip()
                    break
            # If no changes were made, break the loop
            if analysis_text == original_text:
                break
        
        # Generate a simple score based on response positivity (basic heuristic)
        score = 8 if any(word in analysis_text.lower() for word in ['fantastic', 'excellent', 'wonderful', 'perfect', 'amazing']) else 7
        
        # Create a simplified response using the natural language text
        return MealAnalysisResponse(
            meal_id=f"{meal_type}_{hash(response_text) % 10000}",
            overall_score=score,
            overall_assessment=analysis_text,
            key_nutrients=[],  # Simplified - no complex parsing needed
            positive_aspects=[],  # Simplified - no complex parsing needed
            areas_for_improvement=[],  # Simplified - no complex parsing needed
            nutritional_highlights=analysis_text,  # Use the full response as highlights
            encouragement=analysis_text,  # Use the same encouraging text
            processing_level="minimal",
            estimated_calories=None
        )

    def _create_fallback_response(self, meal_type: str, error_message: str) -> MealAnalysisResponse:
        """Create a fallback response when Gemini API fails"""
        return MealAnalysisResponse(
            meal_id=f"{meal_type}_fallback",
            overall_score=7,
            overall_assessment=f"Analysis temporarily unavailable: {error_message}",
            key_nutrients=[
                NutrientInfo(
                    name="Energy",
                    amount="Estimated portion",
                    health_impact="positive"
                )
            ],
            positive_aspects=[
                HealthAspect(
                    aspect="Mindful eating",
                    impact="positive",
                    explanation="Taking time to log and reflect on your meals shows mindful eating habits.",
                    severity="moderate"
                )
            ],
            areas_for_improvement=[],
            nutritional_highlights=f"Analysis service error: {error_message}",
            encouragement="You're doing great by choosing to fuel your body. Every nourishing choice supports your healing process.",
            processing_level="moderate",
            estimated_calories=None
        )

    def generate_meal_inspiration(self, logged_meals: List[dict]) -> MealInspirationResponse:
        """Generate personalized meal suggestions based on user's daily meals"""
        
        # Create prompt for meal inspiration
        prompt = self._create_inspiration_prompt(logged_meals)
        
        try:
            response = self.model.generate_content(prompt)
            
            # Parse the JSON response
            response_text = response.text.strip()
            if response_text.startswith('```json'):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith('```'):
                response_text = response_text[3:-3].strip()
            
            data = json.loads(response_text)
            
            # Create MealInspiration objects with generated image URLs
            suggestions = []
            for suggestion in data.get('suggestions', []):
                # Generate image for each suggestion
                image_url = self._generate_meal_image(suggestion['title'])
                
                suggestions.append(MealInspiration(
                    id=str(uuid.uuid4()),
                    title=suggestion['title'],
                    description=suggestion['description'],
                    image_url=image_url,
                    prep_time=suggestion['prep_time'],
                    nutrition_highlights=suggestion['nutrition_highlights'],
                    why_recommended=suggestion['why_recommended']
                ))
            
            return MealInspirationResponse(
                suggestions=suggestions,
                daily_analysis=data.get('daily_analysis', ''),
                encouragement=data.get('encouragement', '')
            )
            
        except Exception as e:
            print(f"Error generating meal inspiration: {str(e)}")
            return self._create_fallback_inspiration()

    def generate_full_recipe(self, meal_title: str) -> FullRecipe:
        """Generate a complete recipe for a specific meal"""
        
        prompt = self._create_recipe_prompt(meal_title)
        
        try:
            response = self.model.generate_content(prompt)
            
            # Parse the JSON response
            response_text = response.text.strip()
            print(f"Raw recipe response: {response_text[:200]}...")  # Debug log
            
            if response_text.startswith('```json'):
                response_text = response_text[7:-3].strip()
            elif response_text.startswith('```'):
                response_text = response_text[3:-3].strip()
            
            data = json.loads(response_text)
            print(f"Parsed recipe data: {data.get('title', 'No title')}")  # Debug log
            
            return FullRecipe(
                title=data['title'],
                description=data['description'],
                prep_time=data['prep_time'],
                cook_time=data['cook_time'],
                servings=data['servings'],
                ingredients=data['ingredients'],
                instructions=data['instructions'],
                nutrition_notes=data['nutrition_notes'],
                tips=data['tips'],
                encouragement=data['encouragement']
            )
            
        except Exception as e:
            print(f"Error generating recipe for '{meal_title}': {str(e)}")
            print(f"Response text: {response_text if 'response_text' in locals() else 'No response'}")
            return self._create_fallback_recipe(meal_title)

    def _generate_meal_image(self, meal_title: str) -> str:
        """Generate a meal image using Gemini 2.5 Flash Image Preview"""
        
        image_prompt = f"""
        Create a beautiful, appetizing photograph of {meal_title}. The image should be:
        - Professional food photography style
        - Well-lit with natural lighting
        - Colorful and vibrant
        - Plated elegantly on a clean white or neutral plate
        - Shot from a slightly elevated angle
        - Include fresh garnishes and colorful vegetables
        - Warm, inviting atmosphere
        """
        
        try:
            # Return placeholder image URL since image generation is complex
            return "https://via.placeholder.com/400x300/87C4BB/FFFFFF?text=Delicious+Meal"
            
        except Exception as e:
            print(f"Error generating meal image: {str(e)}")
            return "https://via.placeholder.com/400x300/87C4BB/FFFFFF?text=Delicious+Meal"

    def _create_fallback_svg_image(self, meal_title: str) -> str:
        """Create an attractive SVG image placeholder for meals"""
        
        # Enhanced mapping of meal types to food emojis
        food_emojis = {
            'salmon': '🐟', 'fish': '🐟', 'tuna': '🐟',
            'chicken': '🍗', 'turkey': '🍗', 'poultry': '🍗',
            'beef': '🥩', 'steak': '🥩', 'meat': '🥩',
            'quinoa': '🌾', 'grain': '🌾', 'rice': '🍚',
            'bowl': '🥗', 'salad': '🥗', 'greens': '🥬',
            'soup': '🍲', 'stew': '🍲', 'broth': '🍲',
            'pasta': '🍝', 'noodle': '🍜', 'spaghetti': '🍝',
            'oats': '🥣', 'oatmeal': '🥣', 'porridge': '🥣',
            'smoothie': '🥤', 'shake': '🥤', 'drink': '🥤',
            'avocado': '🥑', 'toast': '🍞', 'bread': '🍞',
            'eggs': '🥚', 'egg': '🥚', 'omelet': '🥚',
            'vegetables': '🥬', 'veggie': '🥬', 'greens': '🥬',
            'fruit': '🍓', 'berry': '🍓', 'apple': '🍎',
            'nuts': '🥜', 'almond': '🥜', 'walnut': '🥜',
            'yogurt': '🥛', 'dairy': '🥛', 'milk': '🥛',
            'sweet potato': '🍠', 'potato': '🥔',
            'pancake': '🥞', 'waffle': '🧇'
        }
        
        # Find matching emoji based on meal title
        title_lower = meal_title.lower()
        emoji = '🍽️'  # Default plate emoji
        
        for keyword, food_emoji in food_emojis.items():
            if keyword in title_lower:
                emoji = food_emoji
                break
        
        # Create a more sophisticated SVG with better styling
        svg_content = f'''
    <svg width="300" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#F0F8F7;stop-opacity:1" />
                <stop offset="50%" style="stop-color:#FFF5F3;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#F5F0FF;stop-opacity:1" />
            </linearGradient>
            <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#87C4BB;stop-opacity:0.4" />
                <stop offset="100%" style="stop-color:#C1A7E1;stop-opacity:0.4" />
            </linearGradient>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="2" stdDeviation="4" flood-color="#87C4BB" flood-opacity="0.1"/>
            </filter>
        </defs>
        <rect width="300" height="200" fill="url(#bgGrad)" stroke="url(#borderGrad)" stroke-width="2" rx="16" filter="url(#shadow)"/>
        <circle cx="150" cy="75" r="35" fill="#87C4BB" fill-opacity="0.1"/>
        <text x="150" y="85" font-family="system-ui, -apple-system, sans-serif" font-size="42" text-anchor="middle" fill="#333">{emoji}</text>
        <text x="150" y="130" font-family="system-ui, -apple-system, sans-serif" font-size="16" text-anchor="middle" fill="#333" font-weight="600">{meal_title[:28]}</text>
        <text x="150" y="150" font-family="system-ui, -apple-system, sans-serif" font-size="13" text-anchor="middle" fill="#87C4BB" font-weight="500">Nourishing Choice</text>
        <circle cx="50" cy="170" r="3" fill="#FFB4A2" fill-opacity="0.6"/>
        <circle cx="250" cy="30" r="2" fill="#C1A7E1" fill-opacity="0.6"/>
        <circle cx="270" cy="170" r="2.5" fill="#87C4BB" fill-opacity="0.6"/>
    </svg>
    '''
        
        # Convert SVG to data URL
        svg_base64 = base64.b64encode(svg_content.encode('utf-8')).decode('utf-8')
        return f"data:image/svg+xml;base64,{svg_base64}"

    def _create_inspiration_prompt(self, logged_meals: List[dict]) -> str:
        """Create prompt for generating meal inspiration based on daily meals"""
        
        meals_summary = ""
        if logged_meals:
            meals_summary = "\n".join([
                f"- {meal.get('meal_type', 'Unknown')}: {meal.get('analysis', {}).get('overall_assessment', 'No analysis available yet') if meal.get('analysis') else 'Analysis pending'}"
                for meal in logged_meals
            ])
        else:
            meals_summary = "No meals logged yet today"
        
        return f"""
You are an encouraging nutritionist specializing in metabolic and hormonal health recovery. Based on the AI nutritional analysis of the user's meals logged today, suggest 3 personalized meal ideas that would complement their nutrition and support their recovery journey.

Today's meal analyses (from AI nutritional assessment):
{meals_summary}

Based on these detailed nutritional analyses, suggest meals that would:
- Complement the nutritional profile already established
- Fill any gaps identified in the analyses
- Build upon the positive aspects noted
- Provide variety while maintaining nutritional excellence
- Support continued metabolic and hormonal health recovery
- Focus on adequate calories and nourishment

Return your response as valid JSON with this exact structure:
{{
    "daily_analysis": "Brief analysis of their current nutrition (2-3 sentences)",
    "encouragement": "Warm, encouraging message about their food choices (1-2 sentences)",
    "suggestions": [
        {{
            "title": "Meal Name",
            "description": "Brief appetizing description (1 sentence)",
            "prep_time": "X minutes",
            "nutrition_highlights": "Key nutritional benefits (1-2 sentences)",
            "why_recommended": "Why this complements their day (1-2 sentences)"
        }},
        {{
            "title": "Meal Name 2",
            "description": "Brief appetizing description (1 sentence)",
            "prep_time": "X minutes", 
            "nutrition_highlights": "Key nutritional benefits (1-2 sentences)",
            "why_recommended": "Why this complements their day (1-2 sentences)"
        }},
        {{
            "title": "Meal Name 3",
            "description": "Brief appetizing description (1 sentence)",
            "prep_time": "X minutes",
            "nutrition_highlights": "Key nutritional benefits (1-2 sentences)", 
            "why_recommended": "Why this complements their day (1-2 sentences)"
        }}
    ]
}}

Focus on recovery-friendly meals that are:
- Calorie-dense and nourishing
- Rich in healthy fats for hormone production (from diverse sources like nuts, seeds, olive oil, coconut, eggs, etc.)
- Include quality protein (vary between chicken, turkey, beef, pork, eggs, beans, lentils, tofu, etc.)
- Complex carbohydrates (explore rice, pasta, potatoes, oats, barley, etc.)
- Contain micronutrients for metabolic health
- Appealing and not restrictive

IMPORTANT: Provide diverse, creative meal suggestions. Avoid repeatedly suggesting the same ingredients like salmon, quinoa, or avocado. Explore different cuisines, cooking methods, and ingredient combinations to keep suggestions fresh and exciting.
"""

    def _create_recipe_prompt(self, meal_title: str) -> str:
        """Create prompt for generating a full recipe"""
        
        return f"""
You are an encouraging nutritionist specializing in metabolic and hormonal health recovery. Create a complete, detailed recipe for "{meal_title}" that supports recovery and is delicious.

The recipe should be:
- Nourishing and calorie-adequate
- Rich in nutrients that support metabolic and hormonal health
- Easy to follow with clear instructions
- Include helpful tips for success
- Encouraging and positive in tone

Return your response as valid JSON with this exact structure:
{{
    "title": "{meal_title}",
    "description": "Appetizing description of the dish (2-3 sentences)",
    "prep_time": "X minutes",
    "cook_time": "X minutes",
    "servings": 2,
    "ingredients": [
        "Ingredient 1 with amount",
        "Ingredient 2 with amount",
        "etc."
    ],
    "instructions": [
        "Step 1 instruction",
        "Step 2 instruction", 
        "etc."
    ],
    "nutrition_notes": "Key nutritional benefits and why this supports recovery (2-3 sentences)",
    "tips": [
        "Helpful tip 1",
        "Helpful tip 2",
        "etc."
    ],
    "encouragement": "Encouraging message about making this recipe (1-2 sentences)"
}}

Focus on creating a recipe that is:
- Calorie-dense and satisfying
- Rich in healthy fats, quality protein, and complex carbohydrates
- Contains micronutrients that support hormonal and metabolic health
- Realistic to make at home
- Delicious and appealing
"""

    def _create_fallback_inspiration(self) -> MealInspirationResponse:
        """Create fallback meal inspiration when API fails"""
        
        # Diverse fallback suggestions to avoid repetitive salmon/quinoa
        import random
        
        all_suggestions = [
            MealInspiration(
                id=str(uuid.uuid4()),
                title="Mediterranean Chickpea Pasta",
                description="Hearty pasta with chickpeas, olives, tomatoes, and fresh herbs.",
                image_url=self._generate_meal_image("Mediterranean Chickpea Pasta"),
                prep_time="20 minutes",
                nutrition_highlights="Plant-based protein from chickpeas and complex carbs for sustained energy.",
                why_recommended="A satisfying meal that provides both protein and carbohydrates for recovery."
            ),
            MealInspiration(
                id=str(uuid.uuid4()),
                title="Loaded Sweet Potato Toast",
                description="Thick sweet potato slices topped with avocado, eggs, and seeds.",
                image_url=self._generate_meal_image("Loaded Sweet Potato Toast"),
                prep_time="15 minutes",
                nutrition_highlights="Healthy fats from avocado and complete protein from eggs support hormone production.",
                why_recommended="Perfect balance of nutrients in a delicious, Instagram-worthy format."
            ),
            MealInspiration(
                id=str(uuid.uuid4()),
                title="Thai Coconut Curry Bowl",
                description="Creamy coconut curry with vegetables and jasmine rice.",
                image_url=self._generate_meal_image("Thai Coconut Curry Bowl"),
                prep_time="25 minutes",
                nutrition_highlights="Coconut provides healthy saturated fats while spices boost metabolism.",
                why_recommended="Warming spices and rich coconut milk make this both nourishing and comforting."
            ),
            MealInspiration(
                id=str(uuid.uuid4()),
                title="Breakfast Burrito Bowl",
                description="Scrambled eggs with black beans, cheese, and fresh salsa.",
                image_url=self._generate_meal_image("Breakfast Burrito Bowl"),
                prep_time="12 minutes",
                nutrition_highlights="High-protein combination supports muscle recovery and stable blood sugar.",
                why_recommended="A hearty breakfast that keeps you satisfied and energized all morning."
            ),
            MealInspiration(
                id=str(uuid.uuid4()),
                title="Mushroom Risotto",
                description="Creamy arborio rice with mixed mushrooms and parmesan.",
                image_url=self._generate_meal_image("Mushroom Risotto"),
                prep_time="30 minutes",
                nutrition_highlights="Complex carbs from rice and B-vitamins from mushrooms support energy production.",
                why_recommended="A comforting, calorie-dense meal perfect for evening nourishment."
            ),
            MealInspiration(
                id=str(uuid.uuid4()),
                title="Peanut Butter Banana Pancakes",
                description="Fluffy pancakes with natural peanut butter and sliced banana.",
                image_url=self._generate_meal_image("Peanut Butter Banana Pancakes"),
                prep_time="18 minutes",
                nutrition_highlights="Healthy fats from peanut butter and natural sugars provide quick energy.",
                why_recommended="A delicious way to start the day with adequate calories and satisfaction."
            )
        ]
        
        # Select 3 random suggestions to provide variety
        suggestions = random.sample(all_suggestions, 3)
        
        return MealInspirationResponse(
            suggestions=suggestions,
            daily_analysis="Your meal choices show great intention toward nourishing your body.",
            encouragement="Keep up the wonderful work of fueling yourself with care and intention!"
        )

    def _create_fallback_recipe(self, meal_title: str) -> FullRecipe:
        """Create fallback recipe when API fails"""
        
        return FullRecipe(
            title=meal_title,
            description="A nourishing and delicious meal that supports your recovery journey.",
            prep_time="15 minutes",
            cook_time="20 minutes", 
            servings=2,
            ingredients=[
                "2 cups main ingredient",
                "1 tbsp healthy oil",
                "1/2 cup vegetables",
                "Herbs and spices to taste",
                "Optional protein source"
            ],
            instructions=[
                "Prepare all ingredients",
                "Heat oil in a pan",
                "Cook main ingredients until tender",
                "Season with herbs and spices",
                "Serve warm and enjoy mindfully"
            ],
            nutrition_notes="This meal provides balanced nutrition to support your body's healing and energy needs.",
            tips=[
                "Feel free to customize with your favorite vegetables",
                "Add extra healthy fats like avocado or nuts",
                "Listen to your body's hunger and fullness cues"
            ],
            encouragement="You're taking such good care of yourself by preparing nourishing meals!"
        )

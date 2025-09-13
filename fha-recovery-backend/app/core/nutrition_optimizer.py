# API optimization system to minimize Gemini calls while maintaining functionality
# Focuses on local nutrition estimation with strategic API usage

import json
import hashlib
from typing import List, Dict, Optional
from datetime import datetime, timedelta
import os

class NutritionOptimizer:
    """
    Optimizes nutrition analysis by using local estimation first,
    only calling Gemini API for complex or unusual meals
    """
    
    def __init__(self, gemini_client=None):
        self.gemini_client = gemini_client
        self.local_cache = {}
        self.daily_api_calls = 0
        self.max_daily_calls = 50  # Increased limit for better functionality
        
        # Common food nutrition database (local estimation)
        self.food_database = {
            # Proteins (per 100g estimates)
            'eggs': {'energy': 155, 'protein': 13, 'fat': 11, 'carbs': 1},
            'chicken breast': {'energy': 165, 'protein': 31, 'fat': 3.6, 'carbs': 0},
            'salmon': {'energy': 208, 'protein': 25, 'fat': 12, 'carbs': 0},
            'tofu': {'energy': 144, 'protein': 17, 'fat': 9, 'carbs': 3},
            'greek yogurt': {'energy': 97, 'protein': 10, 'fat': 5, 'carbs': 4},
            
            # Healthy fats
            'avocado': {'energy': 160, 'protein': 2, 'fat': 15, 'carbs': 9},
            'olive oil': {'energy': 884, 'protein': 0, 'fat': 100, 'carbs': 0},
            'nuts': {'energy': 607, 'protein': 15, 'fat': 54, 'carbs': 7},
            'nut butter': {'energy': 588, 'protein': 25, 'fat': 50, 'carbs': 8},
            
            # Complex carbs
            'quinoa': {'energy': 368, 'protein': 14, 'fat': 6, 'carbs': 64},
            'oats': {'energy': 389, 'protein': 17, 'fat': 7, 'carbs': 66},
            'sweet potato': {'energy': 86, 'protein': 2, 'fat': 0.1, 'carbs': 20},
            'brown rice': {'energy': 123, 'protein': 2.6, 'fat': 0.9, 'carbs': 23},
            
            # Fruits and vegetables
            'banana': {'energy': 89, 'protein': 1.1, 'fat': 0.3, 'carbs': 23},
            'apple': {'energy': 52, 'protein': 0.3, 'fat': 0.2, 'carbs': 14},
            'spinach': {'energy': 23, 'protein': 2.9, 'fat': 0.4, 'carbs': 3.6},
            'broccoli': {'energy': 34, 'protein': 2.8, 'fat': 0.4, 'carbs': 7},
        }
    
    def should_use_api(self, meal_description: str) -> bool:
        """
        Determines if we should use Gemini API or local estimation
        """
        # Check daily API limit
        if self.daily_api_calls >= self.max_daily_calls:
            return False
        
        # Use API for complex meals or unusual combinations
        description_lower = meal_description.lower()
        
        # Complex meal indicators
        complex_indicators = [
            'recipe', 'homemade', 'restaurant', 'mixed', 'combination',
            'sauce', 'dressing', 'marinade', 'seasoned', 'cooked in'
        ]
        
        # Simple meal indicators (use local estimation)
        simple_indicators = [
            'plain', 'steamed', 'raw', 'boiled', 'grilled',
            'single', 'just', 'only', 'simple'
        ]
        
        # Check for complexity
        has_complex = any(indicator in description_lower for indicator in complex_indicators)
        has_simple = any(indicator in description_lower for indicator in simple_indicators)
        
        # Count recognizable foods
        recognized_foods = sum(1 for food in self.food_database.keys() 
                             if food in description_lower)
        
        # Use API if:
        # - Complex meal description
        # - Few recognized foods (unusual ingredients)
        # - Long description (detailed recipe)
        if has_complex or (recognized_foods < 2 and len(description_lower) > 50):
            return True
        
        return False
    
    def estimate_locally(self, meal_description: str, meal_type: str) -> Dict:
        """
        Estimates nutrition using local food database
        """
        description_lower = meal_description.lower()
        
        # Extract portions and foods
        estimated_nutrition = {'energy': 0, 'protein': 0, 'fat': 0, 'carbs': 0}
        portion_multiplier = self._estimate_portion_size(description_lower, meal_type)
        
        # Match foods in description
        matched_foods = []
        for food, nutrition in self.food_database.items():
            if food in description_lower:
                matched_foods.append((food, nutrition))
        
        if not matched_foods:
            # Fallback estimation based on meal type
            estimated_nutrition = self._fallback_estimation(meal_type)
        else:
            # Calculate based on matched foods
            for food, nutrition in matched_foods:
                weight_estimate = self._estimate_food_weight(food, description_lower)
                for nutrient in estimated_nutrition:
                    estimated_nutrition[nutrient] += (nutrition[nutrient] * weight_estimate / 100)
        
        # Apply portion multiplier
        for nutrient in estimated_nutrition:
            estimated_nutrition[nutrient] *= portion_multiplier
        
        # Generate encouraging message
        encouraging_message = self._generate_local_encouragement(
            estimated_nutrition, meal_type, matched_foods
        )
        
        return {
            'estimated_nutrition': estimated_nutrition,
            'encouraging_message': encouraging_message,
            'confidence': 'local_estimate',
            'matched_foods': [food for food, _ in matched_foods]
        }
    
    def _estimate_portion_size(self, description: str, meal_type: str) -> float:
        """Estimates portion size multiplier based on description and meal type"""
        
        # Portion size indicators
        large_indicators = ['large', 'big', 'huge', 'generous', 'hearty', 'full plate']
        small_indicators = ['small', 'little', 'light', 'mini', 'snack size']
        
        base_multiplier = {
            'breakfast': 1.0,
            'lunch': 1.2,
            'dinner': 1.3,
            'snack': 0.6
        }.get(meal_type, 1.0)
        
        if any(indicator in description for indicator in large_indicators):
            return base_multiplier * 1.4
        elif any(indicator in description for indicator in small_indicators):
            return base_multiplier * 0.7
        
        return base_multiplier
    
    def _estimate_food_weight(self, food: str, description: str) -> float:
        """Estimates weight in grams for a food item"""
        
        # Default weights for common foods (in grams)
        default_weights = {
            'eggs': 50,  # 1 egg
            'chicken breast': 150,
            'salmon': 120,
            'tofu': 100,
            'greek yogurt': 150,
            'avocado': 150,  # half avocado
            'olive oil': 15,  # 1 tbsp
            'nuts': 30,
            'nut butter': 20,  # 1 tbsp
            'quinoa': 80,  # cooked portion
            'oats': 40,  # dry weight
            'sweet potato': 150,
            'brown rice': 80,  # cooked
            'banana': 120,
            'apple': 150,
            'spinach': 100,
            'broccoli': 100
        }
        
        # Look for quantity indicators
        if '2' in description or 'two' in description:
            return default_weights.get(food, 100) * 2
        elif '3' in description or 'three' in description:
            return default_weights.get(food, 100) * 3
        elif 'cup' in description:
            return default_weights.get(food, 100) * 1.2
        elif 'tbsp' in description or 'tablespoon' in description:
            return default_weights.get(food, 100) * 0.3
        
        return default_weights.get(food, 100)
    
    def _fallback_estimation(self, meal_type: str) -> Dict:
        """Fallback nutrition estimation when no foods are recognized"""
        
        # Conservative estimates based on meal type
        fallback_values = {
            'breakfast': {'energy': 350, 'protein': 15, 'fat': 12, 'carbs': 45},
            'lunch': {'energy': 450, 'protein': 20, 'fat': 15, 'carbs': 55},
            'dinner': {'energy': 500, 'protein': 25, 'fat': 18, 'carbs': 60},
            'snack': {'energy': 200, 'protein': 8, 'fat': 8, 'carbs': 25}
        }
        
        return fallback_values.get(meal_type, fallback_values['lunch'])
    
    def _generate_local_encouragement(self, nutrition: Dict, meal_type: str, matched_foods: List) -> str:
        """Generates encouraging message for locally estimated meals"""
        
        energy_level = nutrition['energy']
        
        # Energy-based encouragement (without mentioning specific numbers)
        if energy_level >= 400:
            energy_msg = "substantial nourishment"
        elif energy_level >= 250:
            energy_msg = "wonderful energy"
        else:
            energy_msg = "gentle fuel"
        
        # Food-based encouragement
        if matched_foods:
            food_names = [food.replace('_', ' ') for food, _ in matched_foods[:2]]
            food_msg = f"The {' and '.join(food_names)} in this meal provide"
        else:
            food_msg = "This nourishing meal provides"
        
        # Meal timing encouragement
        timing_messages = {
            'breakfast': "What a beautiful way to start your day! 🌅",
            'lunch': "Perfect midday nourishment! ☀️",
            'dinner': "Lovely evening fuel for recovery! 🌙",
            'snack': "Sweet little boost of energy! 🌱"
        }
        
        timing_msg = timing_messages.get(meal_type, "Wonderful nourishing choice! 🌸")
        
        return f"{timing_msg} {food_msg} {energy_msg} for your body's healing journey. Every bite is an act of self-care! ✨"
    
    def _assess_meal_complexity(self, description: str) -> str:
        """
        Assesses meal complexity to determine if Gemini API is needed
        Returns: 'simple', 'moderate', 'complex', or 'unusual'
        """
        description_lower = description.lower()
        
        # Simple meals - common single foods or basic combinations
        simple_indicators = [
            'toast', 'banana', 'apple', 'yogurt', 'cereal', 'oatmeal',
            'sandwich', 'salad', 'soup', 'pasta', 'rice', 'chicken',
            'eggs', 'smoothie', 'milk', 'bread', 'cheese'
        ]
        
        # Complex indicators - multiple ingredients, cooking methods, or unusual combinations
        complex_indicators = [
            'recipe', 'homemade', 'marinade', 'sauce', 'seasoned with',
            'cooked in', 'topped with', 'stuffed', 'layered', 'mixed with',
            'garnished', 'drizzled', 'sautéed', 'roasted', 'grilled'
        ]
        
        # Unusual indicators - ethnic foods, specialty items, or uncommon ingredients
        unusual_indicators = [
            'quinoa', 'kale', 'chia', 'tempeh', 'kimchi', 'miso',
            'tahini', 'nutritional yeast', 'spirulina', 'matcha',
            'turmeric', 'goji', 'acai', 'kombucha'
        ]
        
        # Count word complexity
        word_count = len(description.split())
        
        # Check for indicators
        has_simple = any(indicator in description_lower for indicator in simple_indicators)
        has_complex = any(indicator in description_lower for indicator in complex_indicators)
        has_unusual = any(indicator in description_lower for indicator in unusual_indicators)
        
        # Determine complexity
        if has_unusual or word_count > 15:
            return "unusual"
        elif has_complex or word_count > 8:
            return "complex"
        elif has_simple and word_count <= 5:
            return "simple"
        else:
            return "moderate"
    
    def _estimate_locally(self, description: str, meal_type: str) -> dict:
        """
        Estimates meal nutrition using local food database
        Returns a MealAnalysisResponse-compatible dict
        """
        description_lower = description.lower()
        matched_foods = []
        total_nutrition = {'energy': 0, 'protein': 0, 'fat': 0, 'carbs': 0}
        
        # Match foods in description
        for food, nutrition in self.food_database.items():
            if food in description_lower:
                # Estimate portion size (rough approximation)
                portion_multiplier = self._estimate_portion_size(description_lower, food)
                matched_foods.append((food, portion_multiplier))
                
                # Add to totals
                for nutrient, value in nutrition.items():
                    total_nutrition[nutrient] += value * portion_multiplier
        
        # If no matches, use fallback values
        if not matched_foods:
            total_nutrition = self._get_fallback_nutrition(meal_type)
        
        # Generate encouraging message
        encouragement = self._generate_local_encouragement(total_nutrition, meal_type, matched_foods)
        
        # Create response in expected format
        return {
            "meal_id": "local_estimate",
            "overall_score": min(8, max(6, total_nutrition['energy'] / 50)),  # 6-8 range
            "overall_assessment": encouragement,
            "key_nutrients": [],
            "positive_aspects": [],
            "areas_for_improvement": [],
            "nutritional_highlights": encouragement,
            "encouragement": encouragement,
            "processing_level": "whole_foods",
            "estimated_calories": int(total_nutrition['energy'])
        }
    
    def _estimate_portion_size(self, description: str, food: str) -> float:
        """Estimates portion size multiplier based on description context"""
        # Look for portion indicators
        if any(word in description for word in ['large', 'big', 'huge', 'extra']):
            return 1.5
        elif any(word in description for word in ['small', 'little', 'mini']):
            return 0.7
        elif any(word in description for word in ['2', 'two', 'double']):
            return 2.0
        elif any(word in description for word in ['3', 'three', 'triple']):
            return 3.0
        else:
            return 1.0  # Standard portion
    
    def get_cache_key(self, meal_description: str, meal_type: str) -> str:
        """Generates cache key for meal analysis"""
        content = f"{meal_type}:{meal_description.lower().strip()}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def cache_result(self, cache_key: str, result: Dict):
        """Caches analysis result"""
        self.local_cache[cache_key] = {
            'result': result,
            'timestamp': datetime.now().isoformat()
        }
    
    def get_cached_result(self, cache_key: str) -> Optional[Dict]:
        """Retrieves cached result if still valid"""
        if cache_key in self.local_cache:
            cached = self.local_cache[cache_key]
            # Cache valid for 24 hours
            cache_time = datetime.fromisoformat(cached['timestamp'])
            if datetime.now() - cache_time < timedelta(hours=24):
                return cached['result']
        return None
    
    async def analyze_meal_optimized(self, meal_type: str, description: str, image_base64: Optional[str] = None):
        """
        Optimized meal analysis that uses local estimation first,
        only calls Gemini API when necessary
        """
        # Check cache first
        cache_key = self.get_cache_key(description, meal_type)
        cached_result = self.get_cached_result(cache_key)
        if cached_result:
            return cached_result
        
        # Try local estimation first
        complexity = self._assess_meal_complexity(description)
        
        # Always try Gemini API first if available, only fallback to local for simple meals when limit reached
        if self.gemini_client and self.daily_api_calls < self.max_daily_calls:
            try:
                result = self.gemini_client.analyze_meal(meal_type, description, image_base64)
                self.daily_api_calls += 1
                self.cache_result(cache_key, result)
                return result
            except Exception as e:
                print(f"Gemini API failed, falling back to local estimation: {e}")
                result = self._estimate_locally(description, meal_type)
                self.cache_result(cache_key, result)
                return result
        else:
            # Use local estimation when API limit reached or no client
            result = self._estimate_locally(description, meal_type)
            self.cache_result(cache_key, result)
            return result

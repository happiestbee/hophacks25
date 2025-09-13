"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, ChefHat } from 'lucide-react'
import { MealInspirationCard } from './meal-inspiration-card'
import { RecipeModal } from './recipe-modal'

interface MealData {
  id: string
  meal_type: string
  description: string
  timestamp: string
  analysis?: any
  image?: string
  isAnalyzing?: boolean
  error?: string
  calorieCount?: number
}

interface MealInspiration {
  id: string
  title: string
  description: string
  image_url?: string
  prep_time: string
  nutrition_highlights: string
  why_recommended: string
}

interface MealInspirationResponse {
  suggestions: MealInspiration[]
  daily_analysis: string
  encouragement: string
}

interface FullRecipe {
  title: string
  description: string
  prep_time: string
  cook_time: string
  servings: number
  ingredients: string[]
  instructions: string[]
  nutrition_notes: string
  tips: string[]
  encouragement: string
}

interface AIMealInspirationProps {
  loggedMeals: MealData[]
}

export function AIMealInspiration({ loggedMeals }: AIMealInspirationProps) {
  const [inspiration, setInspiration] = useState<MealInspirationResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedRecipe, setSelectedRecipe] = useState<FullRecipe | null>(null)
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false)
  const [isLoadingRecipe, setIsLoadingRecipe] = useState(false)
  const [loadingRecipeId, setLoadingRecipeId] = useState<string | null>(null)

  const fetchMealInspiration = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('http://localhost:8001/api/ai/meal-inspiration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          logged_meals: loggedMeals.map(meal => ({
            meal_type: meal.meal_type,
            description: meal.description,
            timestamp: meal.timestamp,
            analysis: meal.analysis,
            image: meal.image,
            calorieCount: meal.calorieCount
          }))
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch meal inspiration')
      }

      const data = await response.json()
      
      // Calculate total calories for logging
      const totalCalories = loggedMeals.reduce((total, meal) => total + (meal.calorieCount || 0), 0)
      const remainingCalories = Math.max(0, 2500 - totalCalories)
      console.log(`Recipe generation - Total calories consumed: ${totalCalories}, Remaining: ${remainingCalories}`)
      console.log(`Recipe generation - Successfully received ${data.suggestions?.length || 0} recipe suggestions`)
      
      setInspiration(data)
    } catch (error) {
      console.error('Error fetching meal inspiration:', error)
      // Set fallback inspiration
      setInspiration({
        suggestions: [
          {
            id: '1',
            title: 'Nourishing Quinoa Power Bowl',
            description: 'A colorful bowl packed with protein, healthy fats, and vibrant vegetables.',
            image_url: 'https://via.placeholder.com/300x200/87C4BB/FFFFFF?text=Quinoa+Bowl',
            prep_time: '15 minutes',
            nutrition_highlights: 'Complete protein from quinoa, healthy fats from avocado, and fiber from vegetables support sustained energy.',
            why_recommended: 'This balanced meal provides steady energy and essential nutrients for recovery.'
          },
          {
            id: '2',
            title: 'Creamy Salmon & Sweet Potato',
            description: 'Omega-3 rich salmon with roasted sweet potato and herbs.',
            image_url: 'https://via.placeholder.com/300x200/87C4BB/FFFFFF?text=Salmon+Dinner',
            prep_time: '25 minutes',
            nutrition_highlights: 'Omega-3 fatty acids support hormone production, while sweet potatoes provide complex carbohydrates.',
            why_recommended: 'Perfect combination of protein and carbs to support metabolic health.'
          },
          {
            id: '3',
            title: 'Energizing Smoothie Bowl',
            description: 'Thick smoothie base topped with nuts, seeds, and fresh fruit.',
            image_url: 'https://via.placeholder.com/300x200/87C4BB/FFFFFF?text=Smoothie+Bowl',
            prep_time: '10 minutes',
            nutrition_highlights: 'Calorie-dense with healthy fats from nuts and natural sugars for quick energy.',
            why_recommended: 'A delicious way to pack in nutrients and calories for sustained energy.'
          }
        ],
        daily_analysis: 'Your meal choices show great intention toward nourishing your body.',
        encouragement: 'Keep up the wonderful work of fueling yourself with care and intention!'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleGetRecipe = async (mealId: string, mealTitle: string) => {
    setLoadingRecipeId(mealId)
    setIsLoadingRecipe(true)
    setIsRecipeModalOpen(true)

    try {
      const response = await fetch('http://localhost:8001/api/ai/generate-recipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meal_id: mealId,
          meal_title: mealTitle
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipe')
      }

      const recipe = await response.json()
      console.log(`Full recipe generation - Successfully created recipe for: ${mealTitle}`)
      setSelectedRecipe(recipe)
    } catch (error) {
      console.error('Error generating recipe:', error)
      // Set fallback recipe
      setSelectedRecipe({
        title: mealTitle,
        description: 'A nourishing and delicious meal that supports your recovery journey.',
        prep_time: '15 minutes',
        cook_time: '20 minutes',
        servings: 2,
        ingredients: [
          '2 cups main ingredient',
          '1 tbsp healthy oil',
          '1/2 cup vegetables',
          'Herbs and spices to taste',
          'Optional protein source'
        ],
        instructions: [
          'Prepare all ingredients',
          'Heat oil in a pan',
          'Cook main ingredients until tender',
          'Season with herbs and spices',
          'Serve warm and enjoy mindfully'
        ],
        nutrition_notes: 'This meal provides balanced nutrition to support your body\'s healing and energy needs.',
        tips: [
          'Feel free to customize with your favorite vegetables',
          'Add extra healthy fats like avocado or nuts',
          'Listen to your body\'s hunger and fullness cues'
        ],
        encouragement: 'You\'re taking such good care of yourself by preparing nourishing meals!'
      })
    } finally {
      setIsLoadingRecipe(false)
      setLoadingRecipeId(null)
    }
  }

  const closeRecipeModal = () => {
    setIsRecipeModalOpen(false)
    setSelectedRecipe(null)
  }

  // Track meal count to prevent double refresh
  const prevMealCountRef = React.useRef(0)
  
  // Auto-fetch inspiration when meals are added AND all analyses are complete
  useEffect(() => {
    if (loggedMeals.length > 0 && loggedMeals.length !== prevMealCountRef.current) {
      // Check if all meals have completed analysis (not analyzing and have analysis data)
      const allAnalysesComplete = loggedMeals.every(meal => 
        !meal.isAnalyzing && (meal.analysis || meal.error)
      )
      
      if (allAnalysesComplete) {
        fetchMealInspiration()
        prevMealCountRef.current = loggedMeals.length
      }
    }
  }, [loggedMeals])

  return (
    <>
      <Card className="border-[#87C4BB]/30 bg-gradient-to-br from-white to-[#F0F8F7]">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-[#333333] flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-[#87C4BB]" />
              <span>AI Meal Inspiration</span>
            </CardTitle>
            <Button
              onClick={fetchMealInspiration}
              disabled={isLoading}
              variant="outline"
              size="sm"
              className="border-[#87C4BB] text-[#87C4BB] hover:bg-[#87C4BB] hover:text-white"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          {loggedMeals.length === 0 ? (
            <div className="text-center py-12">
              <ChefHat className="h-12 w-12 text-[#87C4BB]/60 mx-auto mb-4" />
              <div className="space-y-2">
                <p className="text-lg font-medium text-[#333333]">
                  Ready to inspire your next meal!
                </p>
                <p className="text-sm text-[#666666]">
                  Log your first meal above and I'll suggest personalized recipes based on your nutrition needs.
                </p>
              </div>
            </div>
          ) : isLoading ? (
            <div className="text-center py-12">
              <div className="space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#87C4BB] border-t-transparent mx-auto"></div>
                <div className="space-y-2">
                  <p className="text-lg font-medium text-[#333333]">
                    AI analyzing your meals...
                  </p>
                  <p className="text-sm text-[#666666]">
                    Creating personalized suggestions just for you!
                  </p>
                </div>
              </div>
            </div>
          ) : inspiration ? (
            <div className="space-y-6">
              {/* Daily Analysis */}
              <div className="bg-gradient-to-r from-[#F0F8F7] to-[#FFF5F3] p-4 rounded-lg border border-[#87C4BB]/20">
                <h3 className="text-sm font-medium text-[#87C4BB] mb-2">
                  Today's Nutrition Analysis
                </h3>
                <p className="text-sm text-[#333333] leading-relaxed mb-2">
                  {inspiration.daily_analysis}
                </p>
                <p className="text-sm text-[#666666] italic">
                  {inspiration.encouragement}
                </p>
              </div>

              {/* Meal Suggestions - Show only first one for now, easily expandable */}
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-4 flex items-center">
                  <ChefHat className="h-5 w-5 mr-2 text-[#87C4BB]" />
                  Today's Featured Recipe
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {inspiration.suggestions.slice(0, 1).map((suggestion) => (
                    <MealInspirationCard
                      key={suggestion.id}
                      inspiration={suggestion}
                      onGetRecipe={handleGetRecipe}
                      isLoadingRecipe={loadingRecipeId === suggestion.id}
                    />
                  ))}
                  
                  {/* Future expansion: Show "View More Recipes" button when we want to show all */}
                  {inspiration.suggestions.length > 1 && (
                    <div className="text-center mt-4">
                      <Button 
                        variant="outline" 
                        className="border-[#87C4BB] text-[#87C4BB] hover:bg-[#87C4BB] hover:text-white"
                        onClick={() => {
                          // TODO: Implement "show all recipes" functionality
                          console.log('Show more recipes - to be implemented')
                        }}
                      >
                        View More Recipe Ideas ({inspiration.suggestions.length - 1} more)
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <ChefHat className="h-12 w-12 text-[#87C4BB]/60 mx-auto mb-4" />
              <p className="text-[#666666]">
                Unable to load meal inspiration. Please try again.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recipe Modal */}
      <RecipeModal
        recipe={selectedRecipe}
        isOpen={isRecipeModalOpen}
        onClose={closeRecipeModal}
        isLoading={isLoadingRecipe}
      />
    </>
  )
}

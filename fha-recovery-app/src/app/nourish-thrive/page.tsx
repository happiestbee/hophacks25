'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import PageLayout from '@/components/layout/PageLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FHANutritionCalculator } from '@/lib/nutrition-calculator'

// Extract calorie count from AI analysis
const extractCaloriesFromAnalysis = (analysis: any): number => {
  // Try to extract calories from the analysis response
  if (analysis?.estimated_calories) {
    return analysis.estimated_calories
  }
  
  // If no calories in analysis, return 0 (will be handled gracefully)
  return 0
}

import { EnhancedBloomingFlower } from '@/components/ui/enhanced-blooming-flower'
import MealLoggingModal from '@/components/ui/meal-logging-modal'
import { MealAnalysisModal } from '@/components/ui/meal-analysis-modal'
import { AIMealInspiration } from '@/components/ui/ai-meal-inspiration'

interface MealAnalysis {
  meal_id: string
  overall_score: number
  overall_assessment: string
  key_nutrients: Array<{
    name: string
    amount: string
    daily_value_percentage?: number
    health_impact: string
  }>
  positive_aspects: Array<{
    aspect: string
    impact: string
    explanation: string
    severity: string
  }>
  areas_for_improvement: Array<{
    aspect: string
    impact: string
    explanation: string
    severity: string
  }>
  nutritional_highlights: string
  encouragement: string
  processing_level: string
  estimated_calories?: number
}

interface MealData {
  id: string
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
  description: string
  image?: string
  timestamp: string
  analysis?: any
  isAnalyzing?: boolean
  error?: string
  calorieCount?: number
}

export default function NourishThrive() {
  const { data: session } = useSession()
  // Demo state for energy level - can be connected to actual data later
  const [energyLevel, setEnergyLevel] = useState(75)
  const [loggedMeals, setLoggedMeals] = useState<MealData[]>([])
  const [isMealModalOpen, setIsMealModalOpen] = useState(false)

  // Function to get status text based on energy level
  const getStatusText = (level: number) => {
    if (level < 30) return { status: 'Needs More Fuel', color: '#C1A7E1' }
    if (level < 70) return { status: 'Moderate', color: '#FFB4A2' }
    return { status: 'Optimal', color: '#87C4BB' }
  }

  // Function to get encouraging message based on energy level
  const getEncouragingMessage = (level: number) => {
    if (level < 30) return "Your flower is ready to bloom - let's nourish it gently 🌱"
    if (level < 70) return "Beautiful progress! Your flower is starting to bloom 🌸"
    return "You're fueling your body beautifully today! Your flower is in full bloom 🌺"
  }

  const statusInfo = getStatusText(energyLevel)
  const encouragingMessage = getEncouragingMessage(energyLevel)

  // State for analysis modal
  const [analysisModalOpen, setAnalysisModalOpen] = useState(false)
  const [selectedMealForAnalysis, setSelectedMealForAnalysis] = useState<MealData | null>(null)

  // Function to handle saving a new meal
  const handleSaveMeal = async (mealData: { meal_type: string; description: string; image?: string }) => {
    const newMeal: MealData = {
      id: Date.now().toString(),
      meal_type: mealData.meal_type as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      description: mealData.description,
      image: mealData.image,
      timestamp: new Date().toISOString(),
      isAnalyzing: true,
      calorieCount: 0 // Initialize with 0, will be updated after analysis
    }

    // Add meal to logged meals immediately
    setLoggedMeals(prev => [...prev, newMeal])
    setIsMealModalOpen(false)
    
    // Auto-open analysis modal for the new meal
    setSelectedMealForAnalysis(newMeal)
    setAnalysisModalOpen(true)

    try {
      // Analyze meal with AI
      const response = await fetch('http://localhost:8001/api/ai/analyze-meal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          meal_type: newMeal.meal_type,
          description: newMeal.description,
          image_base64: newMeal.image
        }),
      })

      if (response.ok) {
        const analysis = await response.json()
        
        // Extract calorie count from AI analysis
        const calorieCount = extractCaloriesFromAnalysis(analysis)
        
        // Update daily calorie tracking
        if (calorieCount > 0 && session?.user?.email) {
          try {
            const today = new Date().toISOString().split('T')[0]
            await fetch(`http://localhost:8001/api/daily-tracking/date/${today}/calories?calories_to_add=${calorieCount}&user_id=${encodeURIComponent(session.user.email)}`, {
              method: 'PATCH',
              headers: {
                'Content-Type': 'application/json',
              },
            })
            console.log(`Added ${calorieCount} calories to daily tracking`)
          } catch (error) {
            console.error('Error updating daily calorie tracking:', error)
          }
        }
        
        // Update meal with full analysis data and calorie count
        setLoggedMeals(prev => 
          prev.map(m => 
            m.id === newMeal.id 
              ? { ...m, analysis: analysis, calorieCount: calorieCount, isAnalyzing: false }
              : m
          )
        )
        
        // Update selected meal for modal if it's currently open
        setSelectedMealForAnalysis(prev => 
          prev?.id === newMeal.id 
            ? { ...prev, analysis: analysis.overall_assessment, isAnalyzing: false }
            : prev
        )
      } else {
        // Handle API error response
        const errorText = await response.text()
        let errorMessage = 'Analysis temporarily unavailable'
        
        try {
          const errorData = JSON.parse(errorText)
          errorMessage = errorData.detail || errorMessage
        } catch {
          // Use default error message if parsing fails
        }
        
        // Update meal with error
        setLoggedMeals(prev => 
          prev.map(m => 
            m.id === newMeal.id 
              ? { ...m, isAnalyzing: false, error: errorMessage }
              : m
          )
        )
        
        setSelectedMealForAnalysis(prev => 
          prev?.id === newMeal.id 
            ? { ...prev, isAnalyzing: false, error: errorMessage }
            : prev
        )
      }
    } catch (error) {
      console.error('Error analyzing meal:', error)
      const errorMessage = 'Unable to connect to analysis service. Please check your connection and try again.'
      
      // Handle network/connection error
      setLoggedMeals(prev => 
        prev.map(m => 
          m.id === newMeal.id 
            ? { ...m, isAnalyzing: false, error: errorMessage }
            : m
        )
      )
      
      setSelectedMealForAnalysis(prev => 
        prev?.id === newMeal.id 
          ? { ...prev, isAnalyzing: false, error: errorMessage }
          : prev
      )
    }
  }

  // Function to handle clicking on a meal card to view analysis
  const handleMealClick = (meal: MealData) => {
    if (meal.analysis || meal.isAnalyzing || meal.error) {
      setSelectedMealForAnalysis(meal)
      setAnalysisModalOpen(true)
    }
  }

  // Function to get meal type emoji
  const getMealEmoji = (meal_type: string) => {
    const emojis: { [key: string]: string } = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎'
    }
    return emojis[meal_type] || '🍽️'
  }

  // Function to format time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    })
  }

  return (
    <ProtectedRoute>
      <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#333333]">Nourish & Thrive</h1>
          <p className="text-[#666666]">Gentle nutrition guidance for your recovery journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#333333]">Your Energy Bloom</CardTitle>
                <EnhancedBloomingFlower loggedMeals={loggedMeals} showBadgeOnly={true} />
              </div>
            </CardHeader>
            <CardContent className="flex flex-col items-center space-y-6 py-8">
              <EnhancedBloomingFlower loggedMeals={loggedMeals} showFlowerOnly={true} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">Log a Meal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-[#666666]">
                  Share what you're nourishing your body with today
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => setIsMealModalOpen(true)}
                  className="w-full border-dashed border-[#FFB4A2] text-[#FFB4A2] hover:bg-[#FFB4A2] hover:text-white transition-colors"
              >
              + Log Today's Meals
              </Button>
              
              {loggedMeals.length === 0 ? (
                <div className="text-center text-[#666666] py-8">
                  <p>No meals logged yet today</p>
                  <p className="text-sm mt-2">Start by adding your first meal above</p>
                </div>
              ) : (
                <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
                  {loggedMeals.map((meal) => (
                    <Card 
                      key={meal.id} 
                      className="border-[#87C4BB]/20 bg-white cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleMealClick(meal)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0 pr-4">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-lg">{getMealEmoji(meal.meal_type)}</span>
                              <span className="font-medium text-[#333333] capitalize">
                                {meal.meal_type}
                              </span>
                              <span className="text-sm text-[#666666]">
                                {formatTime(meal.timestamp)}
                              </span>
                              <div className="flex items-center space-x-2">
                                <span className={`text-sm ${
                                  meal.error 
                                    ? 'text-red-500' 
                                    : meal.isAnalyzing 
                                      ? 'text-[#87C4BB]' 
                                      : 'text-[#87C4BB]'
                                }`}>
                                  {meal.error 
                                    ? 'Analysis Failed - Click to View' 
                                    : meal.isAnalyzing 
                                      ? 'Analyzing...' 
                                      : 'View Analysis'
                                  }
                                </span>
                                {meal.isAnalyzing && (
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#87C4BB]"></div>
                                )}
                                {meal.error && (
                                  <div className="text-red-500">⚠️</div>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-[#666666] line-clamp-2">
                              {meal.description}
                            </p>
                          </div>
                          {meal.image && (
                            <img
                              src={meal.image}
                              alt={`${meal.meal_type} meal`}
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            />
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* AI Meal Inspiration moved to bottom */}
        <AIMealInspiration loggedMeals={loggedMeals} />
      </div>

      {/* Meal Logging Modal */}
      <MealLoggingModal
        open={isMealModalOpen}
        onOpenChange={setIsMealModalOpen}
        onSaveMeal={handleSaveMeal}
      />

      {/* Meal Analysis Modal */}
      <MealAnalysisModal
        analysis={selectedMealForAnalysis?.analysis}
        isAnalyzing={selectedMealForAnalysis?.isAnalyzing}
        isOpen={analysisModalOpen}
        onClose={() => setAnalysisModalOpen(false)}
        mealTitle={selectedMealForAnalysis?.meal_type ? `${selectedMealForAnalysis.meal_type} meal` : "Your Meal"}
        error={selectedMealForAnalysis?.error}
      />
      </PageLayout>
    </ProtectedRoute>
  )
}

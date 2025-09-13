// FHA-specific nutrition calculator with encouraging, subtle language
// Avoids explicit calorie mentions while tracking recovery progress

interface MealData {
  meal_type: string
  description: string
  timestamp: string
  id?: string
  image?: string
  analysis?: any
  isAnalyzing?: boolean
  error?: string
}

interface NutritionEstimate {
  energyLevel: number // 0-100 representing nourishment level
  nourishmentScore: number // How well this meal supports recovery
  balanceIndicator: 'light' | 'moderate' | 'substantial' | 'abundant'
  encouragingMessage: string
}

interface DailyProgress {
  totalNourishment: number // 0-100 daily progress
  mealCount: number
  balanceAchieved: boolean
  flowerGrowthStage: number // 0-11 (12 stages total)
  encouragingFeedback: string
}

// FHA-friendly food categories with estimated nourishment values
const NOURISHMENT_VALUES: Record<string, number> = {
  // Protein sources (substantial nourishment)
  'eggs': 25, 'salmon': 30, 'chicken': 28, 'beef': 32, 'tofu': 22,
  'yogurt': 18, 'cheese': 24, 'nuts': 26, 'beans': 20,
  
  // Healthy fats (essential for recovery)
  'avocado': 22, 'olive oil': 35, 'butter': 30, 'coconut': 28,
  'seeds': 24, 'nut butter': 28,
  
  // Complex carbohydrates (energy restoration)
  'quinoa': 20, 'rice': 18, 'oats': 19, 'pasta': 21, 'bread': 16,
  'sweet potato': 17, 'potato': 15,
  
  // Fruits and vegetables (micronutrients)
  'banana': 12, 'apple': 8, 'berries': 10, 'spinach': 6,
  'broccoli': 7, 'carrots': 6, 'tomato': 5,
  
  // Meal combinations (higher nourishment)
  'bowl': 35, 'smoothie': 25, 'soup': 22, 'salad': 18,
  'sandwich': 24, 'stir fry': 28, 'pasta dish': 26
}

export class FHANutritionCalculator {
  
  /**
   * Estimates nourishment from a meal description using keyword matching
   * Returns encouraging feedback without explicit numbers
   */
  static estimateMealNourishment(meal: MealData): NutritionEstimate {
    const description = meal.description.toLowerCase()
    let totalNourishment = 0
    let componentCount = 0
    
    // Analyze meal components
    for (const [food, value] of Object.entries(NOURISHMENT_VALUES)) {
      if (description.includes(food)) {
        totalNourishment += value
        componentCount++
      }
    }
    
    // Bonus for meal complexity (multiple components)
    if (componentCount > 2) {
      totalNourishment *= 1.2
    }
    
    // Bonus for recovery-supportive meal types
    if (meal.meal_type === 'breakfast') {
      totalNourishment *= 1.1 // Morning nourishment is crucial
    }
    
    // Cap at reasonable maximum
    totalNourishment = Math.min(totalNourishment, 45)
    
    const nourishmentScore = Math.min(totalNourishment, 40)
    const balanceIndicator = this.getBalanceIndicator(nourishmentScore)
    const encouragingMessage = this.getEncouragingMessage(meal.meal_type, balanceIndicator)
    
    return {
      energyLevel: Math.min(nourishmentScore * 2.5, 100),
      nourishmentScore,
      balanceIndicator,
      encouragingMessage
    }
  }
  
  /**
   * Calculates daily progress from all logged meals
   * Maps to flower growth stages (0-11)
   */
  static calculateDailyProgress(meals: MealData[]): DailyProgress {
    let totalNourishment = 0
    let mealCount = meals.length
    
    console.log('Processing meals for flower calculation:', meals) // Debug log
    
    // Sum up nourishment from all meals
    meals.forEach(meal => {
      // Use AI analysis if available, otherwise fall back to local estimation
      if (meal.analysis && meal.analysis.overall_score) {
        // Convert AI score (1-10) to nourishment points (multiply by 4 for good range)
        const aiNourishment = meal.analysis.overall_score * 4
        totalNourishment += aiNourishment
        console.log(`AI analysis for ${meal.meal_type}: ${aiNourishment} points`) // Debug log
      } else {
        // Fallback to local estimation
        const estimate = this.estimateMealNourishment(meal)
        totalNourishment += estimate.nourishmentScore
        console.log(`Local estimate for ${meal.meal_type}: ${estimate.nourishmentScore} points`) // Debug log
      }
    })
    
    console.log(`Total nourishment: ${totalNourishment}`) // Debug log
    
    // FHA recovery targets (adjusted for better flower progression)
    const dailyTarget = 80 // Lowered target for more responsive flower growth
    const progressPercentage = Math.min((totalNourishment / dailyTarget) * 100, 100)
    
    console.log(`Progress percentage: ${progressPercentage}%`) // Debug log
    
    // Map to flower growth stages (12 stages: 0-11)
    const flowerGrowthStage = Math.floor((progressPercentage / 100) * 11)
    
    console.log(`Flower growth stage: ${flowerGrowthStage}`) // Debug log
    
    // Check for balanced intake across meal types
    const mealTypes = new Set(meals.map(m => m.meal_type))
    const balanceAchieved = mealTypes.size >= 2 && totalNourishment >= dailyTarget * 0.7
    
    const encouragingFeedback = this.getDailyEncouragement(
      progressPercentage, 
      mealCount, 
      balanceAchieved
    )
    
    return {
      totalNourishment: progressPercentage,
      mealCount,
      balanceAchieved,
      flowerGrowthStage,
      encouragingFeedback
    }
  }
  
  private static getBalanceIndicator(score: number): 'light' | 'moderate' | 'substantial' | 'abundant' {
    if (score >= 35) return 'abundant'
    if (score >= 25) return 'substantial'
    if (score >= 15) return 'moderate'
    return 'light'
  }
  
  private static getEncouragingMessage(mealType: string, balance: string): string {
    const messages = {
      breakfast: {
        light: "A gentle start to your day! Every nourishing choice matters 🌅",
        moderate: "What a lovely way to fuel your morning! Your body will thank you 🌸",
        substantial: "Beautiful breakfast choice! You're giving your body wonderful energy ✨",
        abundant: "What an amazing way to start your day! Your body is getting incredible nourishment 🌺"
      },
      lunch: {
        light: "A mindful midday choice! You're listening to your body's needs 🌿",
        moderate: "Perfect lunch timing! Your body is getting steady, supportive energy 🌻",
        substantial: "Wonderful lunch! You're maintaining beautiful energy throughout your day 🌼",
        abundant: "Incredible lunch choice! Your body is thriving with this nourishment 🌹"
      },
      dinner: {
        light: "A peaceful evening meal! Rest and recovery are just as important 🌙",
        moderate: "Lovely dinner choice! Your body can restore and heal beautifully tonight 💫",
        substantial: "Perfect evening nourishment! Your body will repair and strengthen overnight 🌸",
        abundant: "Amazing dinner! Your body has everything it needs for beautiful recovery 🌺"
      },
      snack: {
        light: "Sweet little boost! These moments of nourishment add up beautifully 🍃",
        moderate: "Perfect snack timing! You're keeping your energy steady and strong 🌱",
        substantial: "Wonderful snack choice! Your body loves this consistent care 🌻",
        abundant: "Amazing snack! You're giving your body such thoughtful, loving fuel ✨"
      }
    }
    
    const mealMessages = messages[mealType as keyof typeof messages]
    if (mealMessages) {
      return mealMessages[balance as keyof typeof mealMessages] || 
             "Every nourishing choice is a step toward healing and strength! 🌸"
    }
    return "Every nourishing choice is a step toward healing and strength! 🌸"
  }
  
  private static getDailyEncouragement(progress: number, mealCount: number, balanced: boolean): string {
    if (progress >= 90) {
      return "Your flower is in magnificent full bloom! What an incredible day of nourishment 🌺✨"
    } else if (progress >= 75) {
      return "Your flower is blooming beautifully! You're giving your body amazing care today 🌸🌿"
    } else if (progress >= 60) {
      return "Look how your flower is growing! Every meal is helping it reach toward the sun 🌻🌱"
    } else if (progress >= 40) {
      return "Your flower is developing lovely buds! Each nourishing choice helps it grow stronger 🌿💚"
    } else if (progress >= 25) {
      return "Your flower is sprouting beautifully! Small, consistent steps create amazing growth 🌱✨"
    } else if (mealCount > 0) {
      return "Your flower has planted its roots! Every meal is a gift of love to your body 🌰💚"
    } else {
      return "Your flower is ready to begin growing! Each nourishing choice will help it bloom 🌱🌸"
    }
  }
}

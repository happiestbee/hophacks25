"use client"

import React, { useState, useEffect } from 'react'
import { FHANutritionCalculator } from '@/lib/nutrition-calculator'
import { FlowerProgressSystem, FLOWER_STAGES, type DailyFlower } from '@/lib/flower-system'

interface MealData {
  id: string
  meal_type: string
  description: string
  timestamp: string
  calorieCount?: number
}

interface EnhancedBloomingFlowerProps {
  loggedMeals: MealData[]
  className?: string
  showBadgeOnly?: boolean
  showFlowerOnly?: boolean
}

export function EnhancedBloomingFlower({ loggedMeals, className = "", showBadgeOnly = false, showFlowerOnly = false }: EnhancedBloomingFlowerProps) {
  const [dailyFlower, setDailyFlower] = useState<DailyFlower | null>(null)
  const [energyLevel, setEnergyLevel] = useState(0)

  // Calculate flower progress based on logged meals with calorie counts
  useEffect(() => {
    console.log('Logged meals:', loggedMeals) // Debug log
    
    // Calculate daily total from individual meal calorie counts
    const dailyCalories = loggedMeals.reduce((total, meal) => {
      return total + (meal.calorieCount || 0)
    }, 0)
    
    console.log('Daily calorie total:', dailyCalories) // Debug log
    
    // FHA daily target: 2500 calories
    const calorieTarget = 2500
    const progressPercentage = Math.min((dailyCalories / calorieTarget) * 100, 100)
    
    console.log('Progress percentage:', progressPercentage) // Debug log
    
    const newDailyFlower = FlowerProgressSystem.createDailyFlower(progressPercentage)
    setDailyFlower(newDailyFlower)
    setEnergyLevel(progressPercentage)
  }, [loggedMeals])

  // Initialize with today's flower if not set
  useEffect(() => {
    if (!dailyFlower) {
      const initialFlower = FlowerProgressSystem.createDailyFlower(0)
      setDailyFlower(initialFlower)
    }
  }, [])

  if (!dailyFlower) {
    return null
  }

  const currentStage = FLOWER_STAGES[dailyFlower.currentStage]

  // Show only badge if requested
  if (showBadgeOnly) {
    return (
      <div className="inline-flex items-center space-x-1.5 bg-white rounded-full px-2.5 py-1 shadow-sm border border-gray-200">
        <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dailyFlower.type.colors.primary }}></div>
        <span className="text-xs font-medium text-[#333333]">{currentStage.name}</span>
      </div>
    )
  }

  // Original blooming flower format with dynamic growth
  const renderOriginalFlower = () => {
    const stage = dailyFlower.currentStage
    const progress = Math.min(100, (stage / 11) * 100 + (dailyFlower.progress / 11))
    
    return (
      <div className="flex flex-col items-center space-y-4">
        {/* Use original BloomingFlower component format */}
        <div className="relative w-40 h-40 flex items-center justify-center">
          {/* Stem */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-16 bg-gradient-to-t from-[#6B9B7F] to-[#87C4BB] rounded-full opacity-70" />
          
          {/* Leaves */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-5 -translate-y-1">
            <div className="w-3 h-6 bg-gradient-to-br from-[#87C4BB] to-[#6B9B7F] rounded-full transform rotate-45 opacity-60" />
          </div>
          <div className="absolute bottom-8 left-1/2 transform translate-x-2 -translate-y-1">
            <div className="w-3 h-6 bg-gradient-to-bl from-[#87C4BB] to-[#6B9B7F] rounded-full transform -rotate-45 opacity-60" />
          </div>

          {/* Flower container */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-24 h-24">
              
              {/* Outer petals */}
              {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation, index) => (
                <div
                  key={`outer-${index}`}
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    width: progress < 30 ? '12px' : progress < 70 ? '18px' : '22px',
                    height: progress < 30 ? '16px' : progress < 70 ? '28px' : '36px',
                    transform: `translate(-50%, -100%) rotate(${rotation}deg) translateY(-8px) scale(${progress < 30 ? 0.2 : progress < 70 ? 0.7 : 1.1})`,
                    opacity: progress < 30 ? 0.4 : progress < 70 ? 0.8 : 1,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div 
                    className="w-full h-full rounded-full shadow-sm"
                    style={{
                      background: progress < 30 
                        ? `linear-gradient(to top, ${dailyFlower.type.colors.secondary}, ${dailyFlower.type.colors.primary})` 
                        : progress < 70 
                        ? `linear-gradient(to top, ${dailyFlower.type.colors.primary}, ${dailyFlower.type.colors.secondary}, ${dailyFlower.type.colors.accent})` 
                        : `linear-gradient(to top, ${dailyFlower.type.colors.primary}, ${dailyFlower.type.colors.secondary}, ${dailyFlower.type.colors.accent})`
                    }}
                  />
                </div>
              ))}

              {/* Inner petals - only visible when blooming */}
              {progress > 30 && [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map((rotation, index) => (
                <div
                  key={`inner-${index}`}
                  className="absolute top-1/2 left-1/2 origin-bottom"
                  style={{
                    width: progress < 70 ? '10px' : '16px',
                    height: progress < 70 ? '16px' : '24px',
                    transform: `translate(-50%, -100%) rotate(${rotation}deg) translateY(-6px) scale(${(progress < 70 ? 0.7 : 1.1) * 0.85})`,
                    opacity: (progress < 70 ? 0.8 : 1) * 0.95,
                    transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  <div 
                    className="w-full h-full rounded-full shadow-sm"
                    style={{
                      background: progress < 70 
                        ? `linear-gradient(to top, ${dailyFlower.type.colors.primary}, ${dailyFlower.type.colors.secondary})` 
                        : `linear-gradient(to top, ${dailyFlower.type.colors.primary}, ${dailyFlower.type.colors.accent}, ${dailyFlower.type.colors.secondary})`
                    }}
                  />
                </div>
              ))}

              {/* Flower center */}
              <div 
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-inner"
                style={{
                  width: progress < 30 ? '8px' : progress < 70 ? '16px' : '24px',
                  height: progress < 30 ? '8px' : progress < 70 ? '16px' : '24px',
                  background: progress > 70 
                    ? `radial-gradient(circle at 30% 30%, ${dailyFlower.type.colors.accent}, ${dailyFlower.type.colors.secondary}, ${dailyFlower.type.colors.primary})` 
                    : progress > 30 
                    ? `radial-gradient(circle at 30% 30%, ${dailyFlower.type.colors.secondary}, ${dailyFlower.type.colors.primary})` 
                    : `radial-gradient(circle at 30% 30%, ${dailyFlower.type.colors.secondary}, ${dailyFlower.type.colors.primary})`,
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                  boxShadow: progress > 70 ? `inset 0 1px 3px rgba(0,0,0,0.15), 0 0 8px ${dailyFlower.type.colors.accent}40` : 'inset 0 1px 2px rgba(0,0,0,0.1)'
                }}
              />

              {/* Sparkles for full bloom */}
              {progress > 85 && (
                <>
                  <div className="absolute top-2 left-2 w-2 h-2 bg-gradient-to-br from-[#FFF2D6] to-[#FFE4B5] rounded-full animate-pulse opacity-80" />
                  <div className="absolute top-1 right-3 w-1.5 h-1.5 bg-gradient-to-br from-[#FFF2D6] to-[#FFE4B5] rounded-full animate-pulse delay-300 opacity-70" />
                  <div className="absolute top-4 right-1 w-1 h-1 bg-gradient-to-br from-[#FFF2D6] to-[#FFE4B5] rounded-full animate-pulse delay-700 opacity-60" />
                  <div className="absolute bottom-2 left-1 w-1.5 h-1.5 bg-gradient-to-br from-[#FFF2D6] to-[#FFE4B5] rounded-full animate-pulse delay-500 opacity-75" />
                  <div className="absolute bottom-1 right-2 w-1 h-1 bg-gradient-to-br from-[#FFF2D6] to-[#FFE4B5] rounded-full animate-pulse delay-900 opacity-65" />
                </>
              )}
            </div>
          </div>
        </div>

      </div>
    )
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white rounded-xl p-6 relative">
        {/* Flower visualization - centered and large */}
        <div className="flex justify-center items-center h-48" style={{ transform: 'scale(1.8)' }}>
          {renderOriginalFlower()}
        </div>
      </div>
    </div>
  )
}

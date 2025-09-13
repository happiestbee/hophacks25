'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'
import { Button } from './button'
import { ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react'

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

interface MealAnalysisDisplayProps {
  analysis?: MealAnalysis
  isAnalyzing?: boolean
}

export function MealAnalysisDisplay({ analysis, isAnalyzing }: MealAnalysisDisplayProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  if (isAnalyzing) {
    return (
      <Card className="mt-3 border-[#87C4BB]/30 bg-gradient-to-r from-[#F0F8F7] to-white">
        <CardContent className="p-3">
          <div className="flex items-center space-x-2 text-[#87C4BB]">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm font-medium">AI analyzing your meal...</span>
          </div>
          <div className="mt-2 flex space-x-1">
            <div className="w-2 h-2 bg-[#87C4BB] rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-[#87C4BB] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
            <div className="w-2 h-2 bg-[#87C4BB] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
          </div>
          <p className="text-xs text-[#666666] mt-1">
            Getting nutritional insights to support your recovery journey
          </p>
        </CardContent>
      </Card>
    )
  }

  if (!analysis) {
    return null
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-[#87C4BB]'
    if (score >= 6) return 'text-[#FFB4A2]'
    return 'text-[#C1A7E1]'
  }

  const getScoreBackground = (score: number) => {
    if (score >= 8) return 'bg-[#87C4BB]/10'
    if (score >= 6) return 'bg-[#FFB4A2]/10'
    return 'bg-[#C1A7E1]/10'
  }

  return (
    <Card className="mt-3 border-[#87C4BB]/30 bg-gradient-to-r from-[#F0F8F7] to-white">
      <CardContent className="p-3">
        {/* Header with sparkle icon only */}
        <div className="flex items-center space-x-2 mb-3">
          <Sparkles className="h-4 w-4 text-[#87C4BB]" />
          <span className="text-sm font-medium text-[#87C4BB]">AI Nutritional Insights</span>
        </div>

        {/* Natural Language Analysis */}
        <div>
          <p className="text-sm text-[#333333] leading-relaxed">
            {analysis.nutritional_highlights}
          </p>
        </div>

        {/* Expanded details - only show if there are actual structured details */}
        {isExpanded && (analysis.key_nutrients.length > 0 || analysis.positive_aspects.length > 0) && (
          <div className="mt-4 space-y-3 border-t border-[#87C4BB]/20 pt-3">
            
            {/* Key Nutrients */}
            {analysis.key_nutrients.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#333333] mb-2">Key Nutrients</h4>
                <div className="grid grid-cols-2 gap-2">
                  {analysis.key_nutrients.slice(0, 4).map((nutrient, index) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <span className="text-[#666666]">{nutrient.name}</span>
                      <span className={`font-medium ${
                        nutrient.health_impact === 'positive' ? 'text-[#87C4BB]' : 
                        nutrient.health_impact === 'negative' ? 'text-[#FFB4A2]' : 'text-[#666666]'
                      }`}>
                        {nutrient.amount}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Positive Aspects */}
            {analysis.positive_aspects.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#87C4BB] mb-2">✅ What's Great</h4>
                <div className="space-y-1">
                  {analysis.positive_aspects.slice(0, 2).map((aspect, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium text-[#333333]">{aspect.aspect}:</span>
                      <span className="text-[#666666] ml-1">{aspect.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Areas for Improvement */}
            {analysis.areas_for_improvement.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-[#FFB4A2] mb-2">💡 Gentle Suggestions</h4>
                <div className="space-y-1">
                  {analysis.areas_for_improvement.slice(0, 2).map((area, index) => (
                    <div key={index} className="text-xs">
                      <span className="font-medium text-[#333333]">{area.aspect}:</span>
                      <span className="text-[#666666] ml-1">{area.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutritional Highlights */}
            <div className="bg-[#C1A7E1]/10 p-2 rounded-lg">
              <h4 className="text-xs font-semibold text-[#C1A7E1] mb-1">✨ Nutritional Highlights</h4>
              <p className="text-xs text-[#666666]">{analysis.nutritional_highlights}</p>
            </div>

            {/* Processing Level & Calories */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center space-x-4">
                <span className="text-[#666666]">
                  Processing: <span className="font-medium capitalize">{analysis.processing_level}</span>
                </span>
                {analysis.estimated_calories && (
                  <span className="text-[#666666]">
                    Est. Calories: <span className="font-medium">{analysis.estimated_calories}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default MealAnalysisDisplay

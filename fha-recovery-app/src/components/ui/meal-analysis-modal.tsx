"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Sparkles, X, Loader2 } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

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

interface MealAnalysisModalProps {
  analysis?: string | MealAnalysis
  isAnalyzing?: boolean
  isOpen: boolean
  onClose: () => void
  mealTitle?: string
  error?: string
}

export function MealAnalysisModal({ 
  analysis, 
  isAnalyzing = false, 
  isOpen, 
  onClose,
  mealTitle = "Your Meal",
  error
}: MealAnalysisModalProps) {
  
  if (isAnalyzing) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5 text-[#87C4BB]" />
              <span>AI Analyzing {mealTitle}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#87C4BB] border-t-transparent mx-auto"></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-[#333333]">AI analyzing your meal...</p>
                <p className="text-sm text-[#666666]">Getting nutritional insights to support your recovery journey</p>
              </div>
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-[#87C4BB] rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-[#87C4BB] rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-[#87C4BB] rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Show error state if there's an error
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="text-red-500">⚠️</div>
              <span>Analysis Error</span>
            </DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="text-center space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Analyze Meal</h3>
                <p className="text-red-700 mb-4">{error}</p>
                <div className="space-y-2 text-sm text-red-600">
                  <p>This could be due to:</p>
                  <ul className="list-disc list-inside space-y-1 text-left max-w-md mx-auto">
                    <li>API service temporarily unavailable</li>
                    <li>Network connection issues</li>
                    <li>Rate limiting on AI service</li>
                    <li>Missing API configuration</li>
                  </ul>
                </div>
              </div>
              <div className="bg-[#F0F8F7] border border-[#87C4BB]/20 rounded-lg p-4">
                <p className="text-[#333333] font-medium mb-2">Don't worry - your meal is still logged! 🌱</p>
                <p className="text-[#666666] text-sm">
                  The analysis feature will be available again soon. Your nourishing choice is what matters most.
                </p>
              </div>
              <Button 
                onClick={onClose}
                className="bg-[#87C4BB] hover:bg-[#87C4BB]/90 text-white"
              >
                Got it
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!analysis) return null

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b border-[#87C4BB]/20">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-[#333333] leading-tight flex items-center space-x-2">
              <Sparkles className="h-6 w-6 text-[#87C4BB]" />
              <span>AI Nutritional Analysis</span>
            </DialogTitle>
            <p className="text-[#666666] leading-relaxed">
              Personalized insights for {mealTitle.toLowerCase()}
            </p>
          </div>
        </DialogHeader>

        <div className="p-6">
          <div className="bg-gradient-to-r from-[#F0F8F7] to-[#FFF5F3] p-6 rounded-lg border border-[#87C4BB]/20">
            <div className="text-[#333333] leading-relaxed whitespace-pre-wrap">
              {typeof analysis === 'string' 
                ? analysis 
                : (analysis && typeof analysis === 'object' 
                    ? (analysis.nutritional_highlights || analysis.overall_assessment || 'Analysis complete!')
                    : 'Analysis complete!')}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MealAnalysisModal

'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './card'

interface RecoveryLikelihoodIndicatorProps {
  probability: number
  confidenceLevel: string
  interpretation: string
  isLoading?: boolean
}

export function RecoveryLikelihoodIndicator({ 
  probability, 
  confidenceLevel, 
  interpretation, 
  isLoading = false 
}: RecoveryLikelihoodIndicatorProps) {
  
  // Convert probability to percentage
  const percentage = Math.round(probability * 100)
  
  // Get color based on probability
  const getColor = (prob: number) => {
    if (prob >= 0.8) return '#4ADE80' // Green
    if (prob >= 0.6) return '#87C4BB' // Teal
    if (prob >= 0.4) return '#FCD34D' // Yellow
    if (prob >= 0.2) return '#FB923C' // Orange
    return '#F87171' // Red
  }
  
  const getGradient = (prob: number) => {
    if (prob >= 0.8) return 'from-green-400 to-green-600'
    if (prob >= 0.6) return 'from-teal-400 to-teal-600'
    if (prob >= 0.4) return 'from-yellow-400 to-yellow-600'
    if (prob >= 0.2) return 'from-orange-400 to-orange-600'
    return 'from-red-400 to-red-600'
  }
  
  const color = getColor(probability)
  const gradient = getGradient(probability)
  
  if (isLoading) {
    return (
      <Card className="border-[#87C4BB]/20">
        <CardHeader>
          <CardTitle className="text-[#333333] text-lg">30-Day Recovery Outlook</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="animate-pulse">
            <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
          </div>
          <div className="text-center text-[#666666]">
            Analyzing your recovery patterns...
          </div>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <Card className="border-[#87C4BB]/20">
      <CardHeader>
        <CardTitle className="text-[#333333] text-lg">30-Day Recovery Outlook</CardTitle>
        <p className="text-sm text-[#666666]">AI-powered prediction based on your health data</p>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-6">
        {/* Circular Progress Indicator */}
        <div className="relative w-32 h-32">
          {/* Background circle */}
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="#E5E7EB"
              strokeWidth="8"
              fill="none"
            />
            {/* Progress circle */}
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke={color}
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 50}`}
              strokeDashoffset={`${2 * Math.PI * 50 * (1 - probability)}`}
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          
          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-2xl font-bold text-[#333333]">
              {percentage}%
            </div>
            <div className="text-xs text-[#666666] uppercase tracking-wide">
              Likelihood
            </div>
          </div>
        </div>
        
        {/* Confidence Badge */}
        <div className={`px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r ${gradient} text-white`}>
          {confidenceLevel.replace('_', ' ').toUpperCase()} CONFIDENCE
        </div>
        
        {/* Interpretation */}
        <div className="text-center">
          <p className="text-sm text-[#666666] leading-relaxed">
            {interpretation}
          </p>
        </div>
        
        {/* Visual Elements */}
        <div className="flex items-center space-x-2 text-xs text-[#666666]">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#87C4BB]"></div>
            <span>Calorie Balance</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#FFB4A2]"></div>
            <span>Heart Rate Variability</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 rounded-full bg-[#C1A7E1]"></div>
            <span>Body Temperature</span>
          </div>
        </div>
        
        {/* Encouraging Message */}
        <div className="text-center bg-[#F0F8F7] p-3 rounded-lg">
          <p className="text-xs text-[#4A5568] italic">
            Remember: Every body heals at its own pace. Trust your journey and be gentle with yourself. 💚
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

export default RecoveryLikelihoodIndicator

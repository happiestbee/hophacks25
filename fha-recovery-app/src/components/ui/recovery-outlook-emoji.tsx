'use client'

import React from 'react'

interface RecoveryOutlookEmojiProps {
  probability: number
  confidenceLevel: string
  isLoading?: boolean
}

export function RecoveryOutlookEmoji({ 
  probability, 
  confidenceLevel, 
  isLoading = false 
}: RecoveryOutlookEmojiProps) {
  
  // Get emoji and message based on probability
  const getOutlookEmoji = (prob: number) => {
    if (prob >= 0.8) return '🌟'  // Very high - star
    if (prob >= 0.6) return '🌸'  // High - blooming flower
    if (prob >= 0.4) return '🌱'  // Moderate - growing sprout
    if (prob >= 0.2) return '🌿'  // Low - small leaf
    return '🤍'  // Very low - gentle heart
  }
  
  const getOutlookMessage = (prob: number) => {
    if (prob >= 0.8) return 'Bright recovery outlook'
    if (prob >= 0.6) return 'Positive recovery signs'
    if (prob >= 0.4) return 'Gentle progress ahead'
    if (prob >= 0.2) return 'Early healing journey'
    return 'Trust your body\'s wisdom'
  }
  
  if (isLoading) {
    return (
      <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 rounded-lg">
        <div className="text-xs text-[#87C4BB] font-medium uppercase tracking-wide mb-1">
          LSTM Analysis
        </div>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#87C4BB]"></div>
        <p className="text-sm text-[#666666]">Analyzing recovery outlook...</p>
      </div>
    )
  }
  
  const emoji = getOutlookEmoji(probability)
  const message = getOutlookMessage(probability)
  
  return (
    <div className="flex flex-col items-center space-y-2 p-4 bg-white/50 rounded-lg">
      <div className="text-xs text-[#87C4BB] font-medium uppercase tracking-wide mb-1">
        LSTM Analysis
      </div>
      <div className="text-3xl">{emoji}</div>
      <p className="text-sm text-[#666666] text-center font-medium">{message}</p>
    </div>
  )
}

export default RecoveryOutlookEmoji

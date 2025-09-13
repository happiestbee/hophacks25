'use client'

import React from 'react'

interface BloomingFlowerProps {
  energyLevel: number // 0-100
  className?: string
}

export function BloomingFlower({ energyLevel, className = '' }: BloomingFlowerProps) {
  // Determine flower state based on energy level
  const getFlowerState = (level: number) => {
    if (level < 30) return 'bud'
    if (level < 70) return 'blooming'
    return 'full-bloom'
  }

  const flowerState = getFlowerState(energyLevel)

  // Calculate petal properties based on energy level - more exaggerated differences
  const petalOpacity = energyLevel < 30 ? 0.4 : energyLevel < 70 ? 0.8 : 1
  const petalScale = energyLevel < 30 ? 0.2 : energyLevel < 70 ? 0.7 : 1.1
  const centerScale = energyLevel < 30 ? 0.3 : energyLevel < 70 ? 0.8 : 1.2

  // Petal configurations for better visual appeal
  const outerPetals = [0, 45, 90, 135, 180, 225, 270, 315]
  const innerPetals = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5]

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="relative w-40 h-40 flex items-center justify-center">
        {/* Stem - more subtle */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1.5 h-16 bg-gradient-to-t from-[#6B9B7F] to-[#87C4BB] rounded-full opacity-70" />
        
        {/* Leaves - smaller and more subtle */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-5 -translate-y-1">
          <div className="w-3 h-6 bg-gradient-to-br from-[#87C4BB] to-[#6B9B7F] rounded-full transform rotate-45 opacity-60" />
        </div>
        <div className="absolute bottom-8 left-1/2 transform translate-x-2 -translate-y-1">
          <div className="w-3 h-6 bg-gradient-to-bl from-[#87C4BB] to-[#6B9B7F] rounded-full transform -rotate-45 opacity-60" />
        </div>

        {/* Flower container - perfectly centered */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-24 h-24">
            
            {/* Outer petals */}
            {outerPetals.map((rotation, index) => (
              <div
                key={`outer-${index}`}
                className="absolute top-1/2 left-1/2 origin-bottom"
                style={{
                  width: energyLevel < 30 ? '12px' : energyLevel < 70 ? '18px' : '22px',
                  height: energyLevel < 30 ? '16px' : energyLevel < 70 ? '28px' : '36px',
                  transform: `translate(-50%, -100%) rotate(${rotation}deg) translateY(-8px) scale(${petalScale})`,
                  opacity: petalOpacity,
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div 
                  className="w-full h-full rounded-full shadow-sm"
                  style={{
                    background: flowerState === 'bud' 
                      ? 'linear-gradient(to top, #D8BFE8, #C1A7E1)' 
                      : flowerState === 'blooming' 
                      ? 'linear-gradient(to top, #FFB4A2, #FFCAB0, #E8C4E8)' 
                      : 'linear-gradient(to top, #FFB4A2, #FF9F8A, #FFCAB0, #E8C4E8)'
                  }}
                />
              </div>
            ))}

            {/* Inner petals - only visible when blooming or full bloom */}
            {energyLevel > 30 && innerPetals.map((rotation, index) => (
              <div
                key={`inner-${index}`}
                className="absolute top-1/2 left-1/2 origin-bottom"
                style={{
                  width: energyLevel < 70 ? '10px' : '16px',
                  height: energyLevel < 70 ? '16px' : '24px',
                  transform: `translate(-50%, -100%) rotate(${rotation}deg) translateY(-6px) scale(${petalScale * 0.85})`,
                  opacity: petalOpacity * 0.95,
                  transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                <div 
                  className="w-full h-full rounded-full shadow-sm"
                  style={{
                    background: flowerState === 'blooming' 
                      ? 'linear-gradient(to top, #FFB4A2, #FFCAB0)' 
                      : 'linear-gradient(to top, #FFB4A2, #FF9F8A, #FFCAB0)'
                  }}
                />
              </div>
            ))}

            {/* Flower center */}
            <div 
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full shadow-inner"
              style={{
                width: energyLevel < 30 ? '8px' : energyLevel < 70 ? '16px' : '24px',
                height: energyLevel < 30 ? '8px' : energyLevel < 70 ? '16px' : '24px',
                background: energyLevel > 70 
                  ? 'radial-gradient(circle at 30% 30%, #FFF2D6, #FFE4B5, #FFB4A2)' 
                  : energyLevel > 30 
                  ? 'radial-gradient(circle at 30% 30%, #FFCAB0, #FFB4A2)' 
                  : 'radial-gradient(circle at 30% 30%, #E8C4E8, #C1A7E1)',
                transition: 'all 1s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: energyLevel > 70 ? 'inset 0 1px 3px rgba(0,0,0,0.15), 0 0 8px rgba(255, 228, 181, 0.4)' : 'inset 0 1px 2px rgba(0,0,0,0.1)'
              }}
            />

            {/* Sparkles for full bloom */}
            {energyLevel > 85 && (
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

export default BloomingFlower

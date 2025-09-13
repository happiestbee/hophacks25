"use client"

import React, { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Sparkles, ChefHat, Heart } from 'lucide-react'
import Image from 'next/image'

interface MealInspiration {
  id: string
  title: string
  description: string
  image_url?: string
  prep_time: string
  nutrition_highlights: string
  why_recommended: string
}

interface MealInspirationCardProps {
  inspiration: MealInspiration
  onGetRecipe: (mealId: string, mealTitle: string) => void
  isLoadingRecipe?: boolean
}

export function MealInspirationCard({ 
  inspiration, 
  onGetRecipe, 
  isLoadingRecipe = false 
}: MealInspirationCardProps) {
  const [imageError, setImageError] = useState(false)

  return (
    <Card className="overflow-hidden border-[#87C4BB]/30 bg-gradient-to-br from-white to-[#F0F8F7] hover:shadow-lg transition-all duration-300">
      <div className="relative">
        {/* Meal Image */}
        <div className="relative h-48 w-full bg-gradient-to-br from-[#87C4BB]/20 to-[#C1A7E1]/20">
          {inspiration.image_url && !imageError ? (
            <Image
              src={inspiration.image_url}
              alt={inspiration.title}
              fill
              className="object-cover"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <ChefHat className="h-16 w-16 text-[#87C4BB]/60" />
            </div>
          )}
          
          {/* Prep Time Badge */}
          <div className="absolute top-3 right-3">
            <Badge className="bg-white/90 text-[#333333] hover:bg-white">
              <Clock className="h-3 w-3 mr-1" />
              {inspiration.prep_time}
            </Badge>
          </div>
        </div>

        <CardContent className="p-4">
          {/* Title and Description */}
          <div className="mb-3">
            <h3 className="text-lg font-semibold text-[#333333] mb-1">
              {inspiration.title}
            </h3>
            <p className="text-sm text-[#666666] leading-relaxed">
              {inspiration.description}
            </p>
          </div>

          {/* Nutrition Highlights */}
          <div className="mb-3">
            <div className="flex items-center space-x-2 mb-2">
              <Sparkles className="h-4 w-4 text-[#87C4BB]" />
              <span className="text-sm font-medium text-[#87C4BB]">
                Nutrition Highlights
              </span>
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">
              {inspiration.nutrition_highlights}
            </p>
          </div>

          {/* Why Recommended */}
          <div className="mb-4">
            <div className="flex items-center space-x-2 mb-2">
              <Heart className="h-4 w-4 text-[#FFB4A2]" />
              <span className="text-sm font-medium text-[#FFB4A2]">
                Perfect For You
              </span>
            </div>
            <p className="text-sm text-[#333333] leading-relaxed">
              {inspiration.why_recommended}
            </p>
          </div>

          {/* Get Recipe Button */}
          <Button
            onClick={() => onGetRecipe(inspiration.id, inspiration.title)}
            disabled={isLoadingRecipe}
            className="w-full bg-[#87C4BB] hover:bg-[#6FA89F] text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
          >
            {isLoadingRecipe ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                <span>Generating Recipe...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <ChefHat className="h-4 w-4" />
                <span>GET FULL RECIPE</span>
              </div>
            )}
          </Button>
        </CardContent>
      </div>
    </Card>
  )
}

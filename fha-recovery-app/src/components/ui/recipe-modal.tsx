"use client"

import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Clock, Users, ChefHat, Heart, Lightbulb, X } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

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

interface RecipeModalProps {
  recipe: FullRecipe | null
  isOpen: boolean
  onClose: () => void
  isLoading?: boolean
}

export function RecipeModal({ recipe, isOpen, onClose, isLoading = false }: RecipeModalProps) {
  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Creating Recipe</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-12">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#87C4BB] border-t-transparent mx-auto"></div>
              <div className="space-y-2">
                <p className="text-lg font-medium text-[#333333]">Creating your recipe...</p>
                <p className="text-sm text-[#666666]">Our AI chef is crafting something delicious for you!</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!recipe) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[85vh] p-0 flex flex-col">
        <DialogHeader className="p-6 pb-4 border-b border-[#87C4BB]/20 flex-shrink-0">
          <div className="space-y-2">
            <DialogTitle className="text-2xl font-bold text-[#333333] leading-tight">
              {recipe.title}
            </DialogTitle>
            <p className="text-[#666666] leading-relaxed">
              {recipe.description}
            </p>
          </div>

          {/* Recipe Info Badges */}
          <div className="flex flex-wrap gap-2 pt-2">
            <Badge variant="secondary" className="bg-[#87C4BB]/10 text-[#87C4BB]">
              <Clock className="h-3 w-3 mr-1" />
              Prep: {recipe.prep_time}
            </Badge>
            <Badge variant="secondary" className="bg-[#FFB4A2]/10 text-[#FFB4A2]">
              <ChefHat className="h-3 w-3 mr-1" />
              Cook: {recipe.cook_time}
            </Badge>
            <Badge variant="secondary" className="bg-[#C1A7E1]/10 text-[#C1A7E1]">
              <Users className="h-3 w-3 mr-1" />
              Serves {recipe.servings}
            </Badge>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 min-h-0">
          <div className="p-6">
            <div className="space-y-6">
            {/* Encouragement Message */}
            <div className="bg-gradient-to-r from-[#F0F8F7] to-[#FFF5F3] p-4 rounded-lg border border-[#87C4BB]/20">
              <div className="flex items-start space-x-3">
                <Heart className="h-5 w-5 text-[#FFB4A2] mt-0.5 flex-shrink-0" />
                <p className="text-sm text-[#333333] leading-relaxed font-medium">
                  {recipe.encouragement}
                </p>
              </div>
            </div>

            {/* Ingredients */}
            <div>
              <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center">
                <ChefHat className="h-5 w-5 mr-2 text-[#87C4BB]" />
                Ingredients
              </h3>
              <div className="grid gap-2">
                {recipe.ingredients.map((ingredient, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#F0F8F7] transition-colors"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#87C4BB] flex-shrink-0"></div>
                    <span className="text-sm text-[#333333]">{ingredient}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-[#333333] mb-3">
                Instructions
              </h3>
              <div className="space-y-3">
                {recipe.instructions.map((instruction, index) => (
                  <div key={index} className="flex space-x-4">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#87C4BB] text-white text-sm font-medium flex items-center justify-center">
                      {index + 1}
                    </div>
                    <p className="text-sm text-[#333333] leading-relaxed pt-0.5">
                      {instruction}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Nutrition Notes */}
            <div className="bg-[#F0F8F7] p-4 rounded-lg border border-[#87C4BB]/20">
              <h3 className="text-lg font-semibold text-[#333333] mb-2 flex items-center">
                <Heart className="h-5 w-5 mr-2 text-[#87C4BB]" />
                Nutrition Benefits
              </h3>
              <p className="text-sm text-[#333333] leading-relaxed">
                {recipe.nutrition_notes}
              </p>
            </div>

            {/* Tips */}
            {recipe.tips.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-[#333333] mb-3 flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2 text-[#FFB4A2]" />
                  Pro Tips
                </h3>
                <div className="space-y-2">
                  {recipe.tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-[#FFF5F3] rounded-lg border border-[#FFB4A2]/20"
                    >
                      <Lightbulb className="h-4 w-4 text-[#FFB4A2] mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-[#333333] leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

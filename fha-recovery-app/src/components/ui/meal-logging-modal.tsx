'use client'

import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './dialog'
import { Button } from './button'
import { Input } from './input'
import { Textarea } from './textarea'
import { Label } from './label'
import { Card, CardContent } from './card'
import { Camera, Upload, X } from 'lucide-react'

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
  analysis?: MealAnalysis
  isAnalyzing?: boolean
}

interface MealLoggingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSaveMeal: (meal: { meal_type: string; description: string; image?: string }) => void
}

export function MealLoggingModal({ open, onOpenChange, onSaveMeal }: MealLoggingModalProps) {
  const [selectedType, setSelectedType] = useState<MealData['meal_type']>('breakfast')
  const [description, setDescription] = useState('')
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const mealTypes = [
    { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
    { value: 'lunch', label: 'Lunch', emoji: '☀️' },
    { value: 'dinner', label: 'Dinner', emoji: '🌙' },
    { value: 'snack', label: 'Snack', emoji: '🍎' }
  ] as const

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSave = async () => {
    if (!description.trim() && !uploadedImage) return

    // Pass meal data to parent component for handling
    const mealData = {
      meal_type: selectedType,
      description: description.trim(),
      image: uploadedImage || undefined
    }

    onSaveMeal(mealData)
    
    // Reset form
    setDescription('')
    setUploadedImage(null)
    setSelectedType('breakfast')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setDescription('')
    setUploadedImage(null)
    setSelectedType('breakfast')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#F7F7F7] border-0 shadow-xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-xl font-semibold text-[#333333]">
            Log Your Meal
          </DialogTitle>
          <DialogDescription className="text-[#666666]">
            Share what nourished you today - add a photo or describe your meal
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Meal Type Selection */}
          <div className="space-y-3">
            <Label className="text-[#333333] font-medium">Meal Type</Label>
            <div className="grid grid-cols-2 gap-2">
              {mealTypes.map((type) => (
                <Button
                  key={type.value}
                  variant={selectedType === type.value ? "default" : "outline"}
                  onClick={() => setSelectedType(type.value)}
                  className={`h-12 flex items-center justify-center space-x-2 ${
                    selectedType === type.value
                      ? 'bg-[#87C4BB] hover:bg-[#7AB5AC] text-white border-0'
                      : 'border-[#87C4BB] text-[#87C4BB] hover:bg-[#87C4BB] hover:text-white'
                  }`}
                >
                  <span className="text-lg">{type.emoji}</span>
                  <span>{type.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <Label className="text-[#333333] font-medium">Add a Photo (Optional)</Label>
            
            {uploadedImage ? (
              <Card className="relative border-2 border-dashed border-[#87C4BB] bg-white">
                <CardContent className="p-4">
                  <div className="relative">
                    <img
                      src={uploadedImage}
                      alt="Uploaded meal"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setUploadedImage(null)}
                      className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-2 border-dashed border-[#87C4BB] bg-white hover:bg-[#F0F8F7] transition-colors cursor-pointer">
                <CardContent className="p-8">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="flex flex-col items-center space-y-3 text-center">
                      <div className="p-3 bg-[#87C4BB]/10 rounded-full">
                        <Camera className="h-8 w-8 text-[#87C4BB]" />
                      </div>
                      <div>
                        <p className="text-[#333333] font-medium">Take or upload a photo</p>
                        <p className="text-sm text-[#666666]">Show us your beautiful meal</p>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-[#87C4BB]">
                        <Upload className="h-4 w-4" />
                        <span>Click to browse</span>
                      </div>
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </CardContent>
              </Card>
            )}
          </div>

          {/* Description Section */}
          <div className="space-y-3">
            <Label className="text-[#333333] font-medium">
              Describe Your Meal
              {!uploadedImage && <span className="text-[#FFB4A2] ml-1">*</span>}
            </Label>
            <Textarea
              placeholder="Tell us about your meal... What did you eat? How did it make you feel? Any special ingredients or preparation?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-[100px] border-[#87C4BB]/30 focus:border-[#87C4BB] bg-white resize-none"
            />
            <p className="text-xs text-[#666666]">
              Share as much or as little as you'd like - every nourishing choice matters! 💚
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3 pt-4">
          <Button
            variant="outline"
            onClick={handleCancel}
            className="flex-1 border-[#666666] text-[#666666] hover:bg-[#666666] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={(!description.trim() && !uploadedImage) || isLoading}
            className="flex-1 bg-[#FFB4A2] hover:bg-[#FF9F8A] text-white border-0 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Meal'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default MealLoggingModal

// Flower progress system with multiple varieties and growth stages
// Designed for FHA recovery with encouraging, subtle progress tracking

export interface FlowerType {
  id: string
  name: string
  emoji: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  personality: string // Encouraging descriptor
}

export interface FlowerStage {
  stage: number // 0-11
  name: string
  description: string
  emoji: string
  encouragingMessage: string
}

export interface DailyFlower {
  type: FlowerType
  currentStage: number
  progress: number // 0-100 within current stage
  dateSelected: string
  totalNourishment: number
}

// Available flower types for daily selection
export const FLOWER_TYPES: FlowerType[] = [
  {
    id: 'rose',
    name: 'Rose',
    emoji: '🌹',
    colors: { primary: '#FF6B9D', secondary: '#FFB4D1', accent: '#FF8FA3' },
    personality: 'elegant and nurturing'
  },
  {
    id: 'sunflower',
    name: 'Sunflower',
    emoji: '🌻',
    colors: { primary: '#FFD700', secondary: '#FFF8DC', accent: '#FFE55C' },
    personality: 'bright and energizing'
  },
  {
    id: 'cherry_blossom',
    name: 'Cherry Blossom',
    emoji: '🌸',
    colors: { primary: '#FFB7C5', secondary: '#FFF0F5', accent: '#FFC0CB' },
    personality: 'gentle and hopeful'
  },
  {
    id: 'lavender',
    name: 'Lavender',
    emoji: '💜',
    colors: { primary: '#E6E6FA', secondary: '#F8F8FF', accent: '#DDA0DD' },
    personality: 'calming and restorative'
  },
  {
    id: 'tulip',
    name: 'Tulip',
    emoji: '🌷',
    colors: { primary: '#FF69B4', secondary: '#FFE4E1', accent: '#FF1493' },
    personality: 'vibrant and joyful'
  },
  {
    id: 'daisy',
    name: 'Daisy',
    emoji: '🌼',
    colors: { primary: '#FFFF00', secondary: '#FFFACD', accent: '#F0E68C' },
    personality: 'cheerful and optimistic'
  },
  {
    id: 'lotus',
    name: 'Lotus',
    emoji: '🪷',
    colors: { primary: '#FFB6C1', secondary: '#FFF5EE', accent: '#F0E68C' },
    personality: 'peaceful and transformative'
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus',
    emoji: '🌺',
    colors: { primary: '#FF4500', secondary: '#FFE4E1', accent: '#FF6347' },
    personality: 'bold and confident'
  },
  {
    id: 'orchid',
    name: 'Orchid',
    emoji: '🌺',
    colors: { primary: '#DA70D6', secondary: '#F8F8FF', accent: '#DDA0DD' },
    personality: 'graceful and resilient'
  },
  {
    id: 'peony',
    name: 'Peony',
    emoji: '🌸',
    colors: { primary: '#FFB6C1', secondary: '#FFF0F5', accent: '#FF69B4' },
    personality: 'abundant and flourishing'
  },
  {
    id: 'jasmine',
    name: 'Jasmine',
    emoji: '🤍',
    colors: { primary: '#F8F8FF', secondary: '#FFFAF0', accent: '#E6E6FA' },
    personality: 'pure and fragrant'
  }
]

// 12 growth stages from seed to full radiant bloom
export const FLOWER_STAGES: FlowerStage[] = [
  {
    stage: 0,
    name: 'Planted Seed',
    description: 'Your journey begins with intention',
    emoji: '🌰',
    encouragingMessage: 'Every beautiful flower starts with a single seed of intention 🌰✨'
  },
  {
    stage: 1,
    name: 'First Sprout',
    description: 'Tiny green shoots emerge',
    emoji: '🌱',
    encouragingMessage: 'Look! Your first signs of growth are appearing 🌱💚'
  },
  {
    stage: 2,
    name: 'Young Leaves',
    description: 'Small leaves unfurl toward the light',
    emoji: '🌿',
    encouragingMessage: 'Your little leaves are reaching for nourishment 🌿☀️'
  },
  {
    stage: 3,
    name: 'Growing Stem',
    description: 'Strong stem develops with more leaves',
    emoji: '🌾',
    encouragingMessage: 'Your stem is growing stronger with each nourishing choice 🌾💪'
  },
  {
    stage: 4,
    name: 'Leafy Growth',
    description: 'Lush foliage shows healthy development',
    emoji: '🍃',
    encouragingMessage: 'Beautiful leaves show how well you\'re caring for yourself 🍃✨'
  },
  {
    stage: 5,
    name: 'Bud Formation',
    description: 'First tiny buds appear',
    emoji: '🌿',
    encouragingMessage: 'Exciting! Your first buds are forming - bloom is coming 🌿🌸'
  },
  {
    stage: 6,
    name: 'Swelling Buds',
    description: 'Buds grow larger, ready to open',
    emoji: '🌹',
    encouragingMessage: 'Your buds are swelling with potential - so close to blooming! 🌹💫'
  },
  {
    stage: 7,
    name: 'First Bloom',
    description: 'First delicate petals unfurl',
    emoji: '🌸',
    encouragingMessage: 'Your first bloom is here! What a beautiful milestone 🌸🎉'
  },
  {
    stage: 8,
    name: 'Partial Bloom',
    description: 'More flowers open in lovely display',
    emoji: '🌼',
    encouragingMessage: 'More blooms are opening - you\'re flourishing beautifully 🌼✨'
  },
  {
    stage: 9,
    name: 'Full Bloom',
    description: 'Magnificent full flowering display',
    emoji: '🌻',
    encouragingMessage: 'Full bloom achieved! Your dedication is absolutely radiant 🌻🌟'
  },
  {
    stage: 10,
    name: 'Peak Bloom',
    description: 'Abundant, vibrant flowering',
    emoji: '🌺',
    encouragingMessage: 'Peak bloom! You\'re absolutely glowing with health and vitality 🌺✨'
  },
  {
    stage: 11,
    name: 'Radiant Garden',
    description: 'A masterpiece of nourishment and care',
    emoji: '🏵️',
    encouragingMessage: 'Radiant perfection! You\'ve created something truly magnificent 🏵️👑'
  }
]

export class FlowerProgressSystem {
  
  /**
   * Gets today's flower type based on date (consistent daily selection)
   */
  static getTodaysFlower(date: Date = new Date()): FlowerType {
    // Use date + random component for page reload randomization
    const dateString = date.toISOString().split('T')[0]
    const randomComponent = Math.floor(Math.random() * 1000)
    const seed = this.hashString(dateString + randomComponent.toString())
    const index = seed % FLOWER_TYPES.length
    return FLOWER_TYPES[index]
  }
  
  /**
   * Calculates current flower growth stage based on progress percentage
   */
  static calculateFlowerStage(progressPercentage: number): number {
    if (progressPercentage >= 95) return 11 // Radiant Peak
    if (progressPercentage >= 90) return 10 // Peak Bloom
    if (progressPercentage >= 85) return 9  // Full Bloom
    if (progressPercentage >= 75) return 8  // Partial Bloom
    if (progressPercentage >= 65) return 7  // First Bloom
    if (progressPercentage >= 55) return 6  // Swelling Buds
    if (progressPercentage >= 45) return 5  // Bud Formation
    if (progressPercentage >= 35) return 4  // Leafy Growth
    if (progressPercentage >= 25) return 3  // Growing Stem
    if (progressPercentage >= 15) return 2  // Young Leaves
    if (progressPercentage >= 8) return 1   // First Sprout
    return 0 // Planted Seed
  }
  
  /**
   * Gets progress within current stage (for smooth animations)
   */
  static getStageProgress(progressPercentage: number, currentStage: number): number {
    const stageRanges = [
      [0, 8],    // Stage 0
      [8, 15],   // Stage 1
      [15, 25],  // Stage 2
      [25, 35],  // Stage 3
      [35, 45],  // Stage 4
      [45, 55],  // Stage 5
      [55, 65],  // Stage 6
      [65, 75],  // Stage 7
      [75, 85],  // Stage 8
      [85, 90],  // Stage 9
      [90, 95],  // Stage 10
      [95, 100]  // Stage 11
    ]
    
    const [min, max] = stageRanges[currentStage] || [0, 100]
    const stageWidth = max - min
    const progressInStage = Math.max(0, progressPercentage - min)
    return Math.min(100, (progressInStage / stageWidth) * 100)
  }
  
  /**
   * Creates daily flower state
   */
  static createDailyFlower(progressPercentage: number, date: Date = new Date()): DailyFlower {
    const type = this.getTodaysFlower(date)
    const currentStage = this.calculateFlowerStage(progressPercentage)
    const progress = this.getStageProgress(progressPercentage, currentStage)
    
    return {
      type,
      currentStage,
      progress,
      dateSelected: date.toISOString().split('T')[0],
      totalNourishment: progressPercentage
    }
  }
  
  /**
   * Gets encouraging message for current flower state
   */
  static getFlowerMessage(dailyFlower: DailyFlower): string {
    const stage = FLOWER_STAGES[dailyFlower.currentStage]
    const flower = dailyFlower.type
    
    // Combine stage message with flower personality
    return `Your ${flower.personality} ${flower.name.toLowerCase()} is ${stage.description.toLowerCase()}. ${stage.encouragingMessage}`
  }
  
  /**
   * Determines if user achieved a growth milestone
   */
  static checkForMilestone(previousStage: number, currentStage: number): boolean {
    return currentStage > previousStage
  }
  
  /**
   * Gets milestone celebration message
   */
  static getMilestoneMessage(newStage: number, flowerType: FlowerType): string {
    const stage = FLOWER_STAGES[newStage]
    return `🎉 Your ${flowerType.name} has reached ${stage.name}! ${stage.encouragingMessage}`
  }
  
  // Helper function to create deterministic "random" selection
  private static hashString(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

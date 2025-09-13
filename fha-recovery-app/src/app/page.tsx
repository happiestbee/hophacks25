'use client'

import { Button } from '@/components/ui/button'
import { useState } from 'react'

export default function Home() {
  const [selectedMood, setSelectedMood] = useState('')
  const [customMood, setCustomMood] = useState('')
  const [showMoodInput, setShowMoodInput] = useState(false)
  const [showAIMessage, setShowAIMessage] = useState(false)
  const [aiMessage, setAiMessage] = useState('')

  const moodOptions = [
    { emoji: '😊', label: 'Happy', color: 'bg-[#87C4BB]' },
    { emoji: '😌', label: 'Peaceful', color: 'bg-[#87C4BB]' },
    { emoji: '😴', label: 'Tired', color: 'bg-[#FFB4A2]' },
    { emoji: '😔', label: 'Sad', color: 'bg-[#FFB4A2]' },
    { emoji: '😰', label: 'Anxious', color: 'bg-[#C1A7E1]' },
    { emoji: '😤', label: 'Frustrated', color: 'bg-[#C1A7E1]' },
    { emoji: '💪', label: 'Strong', color: 'bg-[#87C4BB]' },
    { emoji: '🤗', label: 'Hopeful', color: 'bg-[#87C4BB]' },
  ]

  const generateAIMessage = (mood: string) => {
    const messages: { [key: string]: string } = {
      'Happy': "Your joy is beautiful and contagious! I'm so happy to see you feeling this way. Keep embracing these moments of happiness - you deserve every bit of it! 💕",
      'Peaceful': "What a beautiful state of mind you're in. This peace you're feeling is a gift - hold onto it gently and let it guide you through your healing journey. 🌸",
      'Tired': "You got this! You are working so hard right now and I'm proud of you. Rest is not giving up - it's giving your body the love and care it needs to heal. Take it easy, beautiful. 💪",
      'Sad': "Your feelings are completely valid, and I'm here with you. It's okay to not be okay sometimes. You're so brave for acknowledging this emotion. Sending you gentle hugs and strength. 🤗",
      'Anxious': "I can feel your worry, and I want you to know that you're safe. Take a deep breath with me. You've overcome so much already - this feeling will pass, and you'll come out stronger. You're not alone. 🌟",
      'Frustrated': "I hear your frustration, and it's completely understandable. Healing isn't linear, and it's okay to feel this way. You're doing the best you can, and that's more than enough. Be gentle with yourself. 💜",
      'Strong': "Look at you, standing tall and powerful! Your strength inspires me. You've come so far, and I believe in your ability to keep moving forward. You're absolutely amazing! ✨",
      'Hopeful': "Your hope is like a beautiful light in the darkness. Hold onto that feeling - it's a powerful force for healing. I believe in your journey and I'm excited to see where it takes you! 🌈"
    }
    
    // For custom moods, generate a more generic but supportive message
    if (!messages[mood]) {
      return `Thank you for sharing how you're feeling. Your honesty is so brave, and I'm here to support you through whatever you're experiencing. You're doing great just by being here. 💙`
    }
    
    return messages[mood]
  }

  const handleMoodSelect = (mood: string) => {
    setSelectedMood(mood)
    setShowMoodInput(false)
  }

  const handleCustomMood = () => {
    setShowMoodInput(true)
    setSelectedMood('')
  }

  const handleContinue = () => {
    const currentMood = selectedMood || customMood
    const message = generateAIMessage(currentMood)
    setAiMessage(message)
    setShowAIMessage(true)
    console.log('Selected mood:', currentMood)
  }

  return (
    <div className="hero-gradient min-h-screen">
      {/* Navigation */}
      <nav className="border-b border-[#E5E5E5] bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h2 className="text-xl font-semibold text-[#333333]">FHA Recovery</h2>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" className="text-[#666666] hover:text-[#333333]">
                About
              </Button>
              <Button variant="ghost" className="text-[#666666] hover:text-[#333333]">
                Support
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-8">
        <div className="mx-auto max-w-4xl space-y-12 text-center">
          {/* Welcome Section */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h1 className="text-6xl leading-tight font-bold text-[#333333] lg:text-7xl">
                Welcome to Your
                <span className="block text-[#87C4BB]">Healing Journey</span>
              </h1>

              <p className="mx-auto max-w-2xl text-xl leading-relaxed text-[#666666] lg:text-2xl">
                A gentle, supportive space designed specifically for your Functional Hypothalamic Amenorrhea recovery. 
                Let's start by checking in with how you're feeling today.
              </p>
            </div>
          </div>

          {/* Mood Check-in Section */}
          <div className="mx-auto max-w-3xl space-y-8">
            <div className="rounded-xl bg-white/80 p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-semibold text-[#333333]">
                How are you feeling today?
              </h2>
              <p className="mb-8 text-[#666666]">
                Choose a mood that resonates with you, or write your own. There's no right or wrong answer.
              </p>

              {/* Mood Options Grid */}
              <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
                {moodOptions.map((mood) => (
                  <button
                    key={mood.label}
                    onClick={() => handleMoodSelect(mood.label)}
                    className={`mood-button group rounded-lg border-2 p-4 transition-all duration-200 ${
                      selectedMood === mood.label
                        ? 'border-[#87C4BB] bg-[#87C4BB]/10 shadow-md'
                        : 'border-[#E5E5E5] bg-white hover:border-[#87C4BB]/50 hover:shadow-sm'
                    }`}
                  >
                    <div className={`mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full ${mood.color} group-hover:scale-110 transition-transform duration-200`}>
                      <span className="text-2xl">{mood.emoji}</span>
                    </div>
                    <p className="text-sm font-medium text-[#333333]">{mood.label}</p>
                  </button>
                ))}
              </div>

              {/* Custom Mood Input */}
              <div className="space-y-4">
                <Button
                  variant="outline"
                  onClick={handleCustomMood}
                  className="rounded-lg border-[#87C4BB] text-[#87C4BB] hover:bg-[#87C4BB] hover:text-white"
                >
                  Or write how you're feeling
                </Button>

                {showMoodInput && (
                  <div className="space-y-4">
                    <input
                      type="text"
                      value={customMood}
                      onChange={(e) => setCustomMood(e.target.value)}
                      placeholder="How are you feeling today?"
                      className="w-full rounded-lg border border-[#E5E5E5] px-4 py-3 text-[#333333] placeholder-[#666666] focus:border-[#87C4BB] focus:outline-none focus:ring-2 focus:ring-[#87C4BB]/20"
                    />
                  </div>
                )}
              </div>

              {/* Continue Button */}
              {(selectedMood || customMood) && (
                <div className="mt-8">
                  <Button
                    onClick={handleContinue}
                    size="lg"
                    className="rounded-lg bg-[#87C4BB] px-8 py-4 text-lg font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#7AB3A8] hover:shadow-md"
                  >
                    Continue with my journey
                  </Button>
                </div>
              )}
            </div>

            {/* AI Generated Message */}
            {showAIMessage && (
              <div className="mx-auto max-w-3xl space-y-6 ai-message-enter">
                <div className="rounded-xl bg-gradient-to-r from-[#87C4BB]/20 to-[#FFB4A2]/20 p-8 shadow-sm border border-[#87C4BB]/30">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="ai-avatar flex h-12 w-12 items-center justify-center rounded-full bg-[#87C4BB]">
                        <span className="text-2xl">🤖</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-3 text-lg font-semibold text-[#333333]">
                        Your Personal AI Companion
                      </h3>
                      <p className="text-[#666666] leading-relaxed">
                        "{aiMessage}"
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center space-x-4">
                  <Button
                    size="lg"
                    className="rounded-lg bg-[#87C4BB] px-8 py-4 text-lg font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#7AB3A8] hover:shadow-md"
                  >
                    Start My Journey
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setShowAIMessage(false)
                      setSelectedMood('')
                      setCustomMood('')
                      setShowMoodInput(false)
                    }}
                    className="rounded-lg border-[#87C4BB] px-8 py-4 text-lg font-medium text-[#87C4BB] transition-all duration-200 hover:bg-[#87C4BB] hover:text-white"
                  >
                    Check In Again
                  </Button>
                </div>
              </div>
            )}

            {/* Encouraging Quote - only show if AI message is not displayed */}
            {!showAIMessage && (
              <div className="mx-auto max-w-3xl rounded-lg bg-white/60 p-6 shadow-sm">
                <p className="text-lg italic text-[#666666]">
                  "Your feelings are valid. Every emotion is part of your healing journey. 
                  Take a moment to honor where you are right now."
                </p>
              </div>
            )}
          </div>

          {/* Feature Preview Cards */}
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card-hover group rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#87C4BB] group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl text-white">🌡️</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#333333]">
                Gentle Health Tracking
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Monitor your symptoms, energy levels, and recovery progress with compassion. 
                No judgment, just gentle awareness.
              </p>
            </div>

            <div className="card-hover group rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#FFB4A2] group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl text-white">💝</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#333333]">
                Self-Love & Affirmations
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Your personal space for daily affirmations, gratitude practice, and 
                celebrating small wins along your healing journey.
              </p>
            </div>

            <div className="card-hover group rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-xl bg-[#C1A7E1] group-hover:scale-110 transition-transform duration-200">
                <span className="text-2xl text-white">🍽️</span>
              </div>
              <h3 className="mb-3 text-xl font-semibold text-[#333333]">
                Nourishing Guidance
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Gentle nutrition support and meal planning that honors your body's 
                needs without restriction or pressure.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

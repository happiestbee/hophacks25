'use client'

import { Button } from '@/components/ui/button'
import { useState, useRef, useCallback, useEffect } from 'react'

export default function Home() {
  const [selectedHue, setSelectedHue] = useState(180) // Start with blue
  const [showQuote, setShowQuote] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const sliderRef = useRef<HTMLDivElement>(null)

  // Map hue ranges to themes and quotes
  const getThemeFromHue = (hue: number) => {
    if (hue >= 200 && hue < 260) return 'calm'
    if (hue >= 260 && hue < 300) return 'selfCompassion'
    if (hue >= 300 || hue < 20) return 'energy'
    if (hue >= 20 && hue < 70) return 'warmth'
    if (hue >= 70 && hue < 160) return 'growth'
    return 'calm' // default
  }

  const quotes = {
    calm: [
      "Breathe deeply. You are safe and supported in this moment.",
      "Like gentle waves, let peace wash over you. You deserve this calm.",
      "Your inner stillness is a beautiful strength. Honor it.",
      "In this blue moment, find your center. You are exactly where you need to be.",
      "Let the serenity of this color remind you: you are loved and protected."
    ],
    selfCompassion: [
      "You are so brave for feeling what you feel. I'm proud of you.",
      "Your emotions are valid and important. Be gentle with yourself.",
      "It's okay to not be okay sometimes. You're doing your best.",
      "You deserve the same kindness you'd give to a dear friend.",
      "Your vulnerability is beautiful. You are enough, exactly as you are."
    ],
    energy: [
      "Feel that fire within you! You are stronger than you know.",
      "Your courage shines bright. Keep moving forward, one step at a time.",
      "You've overcome so much already. This energy will carry you through.",
      "Let your inner light blaze! You are capable of amazing things.",
      "Your determination is inspiring. Trust in your power to heal."
    ],
    warmth: [
      "Feel the warmth of self-love surrounding you. You are cherished.",
      "Like golden sunlight, let gratitude fill your heart today.",
      "You bring so much light to the world. Don't forget to shine for yourself.",
      "This warmth reminds you: you are worthy of all good things.",
      "Let this golden moment remind you of your own inner radiance."
    ],
    growth: [
      "You are growing stronger every day. Trust in your journey.",
      "Like a tree reaching toward the sun, you are reaching toward healing.",
      "Your growth is beautiful and natural. Be patient with the process.",
      "You are blooming into the person you're meant to be. Keep growing.",
      "This green reminds you: you are alive, growing, and full of potential."
    ]
  }

  const getRandomQuote = (theme: keyof typeof quotes) => {
    const themeQuotes = quotes[theme]
    return themeQuotes[Math.floor(Math.random() * themeQuotes.length)]
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    updateHue(e)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      updateHue(e)
    }
  }, [isDragging])

  const handleMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setShowQuote(true)
    }
  }, [isDragging])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true)
    updateHueFromTouch(e)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (isDragging) {
      e.preventDefault()
      updateHueFromTouch(e)
    }
  }, [isDragging])

  const handleTouchEnd = useCallback(() => {
    if (isDragging) {
      setIsDragging(false)
      setShowQuote(true)
    }
  }, [isDragging])

  const updateHue = (e: React.MouseEvent) => {
    if (!sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const hue = Math.round(percentage * 360)
    setSelectedHue(hue)
  }

  const updateHueFromTouch = (e: React.TouchEvent) => {
    if (!sliderRef.current) return
    
    const rect = sliderRef.current.getBoundingClientRect()
    const x = e.touches[0].clientX - rect.left
    const percentage = Math.max(0, Math.min(1, x / rect.width))
    const hue = Math.round(percentage * 360)
    setSelectedHue(hue)
  }

  const currentTheme = getThemeFromHue(selectedHue)
  const currentQuote = getRandomQuote(currentTheme)


  // Handle scroll to hide/show scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      setShowScrollIndicator(scrollTop < 100) // Hide after scrolling 100px
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])


  return (
    <div 
      className="min-h-screen transition-all duration-1000"
      style={{
        background: `linear-gradient(135deg, hsl(${selectedHue}, 40%, 96%) 0%, hsl(${selectedHue}, 30%, 92%) 100%)`
      }}
    >
      {/* Main Content */}
      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="mx-auto max-w-4xl space-y-12 text-center">
          {/* Welcome Section */}
          <div className="space-y-8">
            <div className="space-y-0">
              <h1 className="text-6xl leading-tight font-bold text-[#333333] lg:text-7xl">
                Welcome to Your
                <span className="block text-[#FFB4A2] italic font-light healing-journey-text">Healing Journey</span>
              </h1>

              <p className="mx-auto max-w-6xl text-lg leading-relaxed text-[#666666] lg:text-xl mt-6">
                A gentle, supportive space designed specifically for your Functional Hypothalamic Amenorrhea recovery. Regain your relationship with food and menstrual health, so you can support your fertility or whatever your body needs most. Drag along the color spectrum to find your feeling.
              </p>
            </div>
          </div>


          {/* Color Spectrum Slider */}
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="rounded-2xl bg-white/70 backdrop-blur-sm p-8 shadow-lg border border-white/20">
              <h2 className="mb-8 text-2xl font-semibold text-[#333333]">
                How are you feeling today?
              </h2>
              
              <div className="space-y-6">
                {/* Color Spectrum Bar */}
                <div className="relative">
                  <div
                    ref={sliderRef}
                    className="relative h-6 w-full rounded-full cursor-pointer shadow-inner select-none"
                    style={{
                      background: 'linear-gradient(to right, hsl(0, 60%, 75%) 0%, hsl(60, 60%, 80%) 16.66%, hsl(120, 60%, 75%) 33.33%, hsl(180, 60%, 80%) 50%, hsl(240, 60%, 75%) 66.66%, hsl(300, 60%, 80%) 83.33%, hsl(360, 60%, 75%) 100%)'
                    }}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                  >
                    {/* Draggable Handle */}
                    <div
                      className="absolute top-1/2 w-4 h-4 bg-white rounded-full shadow-lg border-2 border-gray-300 cursor-grab active:cursor-grabbing"
                      style={{
                        left: `${(selectedHue / 360) * 100}%`,
                        transform: 'translate(-50%, -50%)',
                        borderColor: `hsl(${selectedHue}, 60%, 70%)`
                      }}
                    />
                  </div>
                </div>


              </div>
            </div>

            {/* Quote Display */}
            {showQuote && (
              <div className="mx-auto max-w-4xl space-y-6 animate-fade-in">
                <div 
                  className="rounded-3xl p-12 shadow-2xl text-gray-800 backdrop-blur-md border border-white/30"
                  style={{
                    background: `linear-gradient(135deg, hsla(${selectedHue}, 20%, 95%, 0.3) 0%, hsla(${selectedHue}, 15%, 98%, 0.2) 100%)`
                  }}
                >
                  <div className="text-center">
                    <p className="text-2xl leading-relaxed italic font-light">
                      "{currentQuote}"
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Start Your Journey Button - Always Visible */}
            <div className="pt-8">
              <Button 
                className="px-8 py-3 text-lg font-semibold rounded-xl bg-[#FFB4A2] hover:bg-[#FF9F8A] text-white shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => {
                  // Navigate to sign-in page (you can replace this with actual routing)
                  window.location.href = '/signin'
                }}
              >
                Start Your Journey
              </Button>
            </div>
          </div>

          {/* Scroll Indicator - Right Side */}
          {showScrollIndicator && (
            <div className="fixed right-8 top-1/2 transform -translate-y-1/2 z-10 transition-opacity duration-300">
              <div className="animate-bounce">
                <svg 
                  className="w-5 h-5 text-gray-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 14l-7 7m0 0l-7-7m7 7V3" 
                  />
                </svg>
              </div>
            </div>
          )}

          {/* Feature Preview Cards */}
          <div className="mt-20 grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="card-hover group rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-[#333333]">
                Gentle Health Tracking
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Monitor your symptoms, energy levels, and recovery progress with compassion. 
                No judgment, just gentle awareness.
              </p>
            </div>

            <div className="card-hover group rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-[#333333]">
                Self-Love & Affirmations
              </h3>
              <p className="text-[#666666] leading-relaxed">
                Your personal space for daily affirmations, gratitude practice, and 
                celebrating small wins along your healing journey.
              </p>
            </div>

            <div className="card-hover group rounded-xl border border-[#E5E5E5] bg-white p-8 shadow-sm">
              <h3 className="mb-4 text-xl font-semibold text-[#333333]">
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
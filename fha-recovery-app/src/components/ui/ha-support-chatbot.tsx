'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { MessageCircle, X, Heart, Phone, Home } from 'lucide-react'

interface Message {
  id: string
  text: string
  isBot: boolean
  timestamp: Date
  options?: ChatOption[]
  showCrisisResources?: boolean
}

interface ChatOption {
  id: string
  text: string
  action: 'respond' | 'crisis'
  response?: string
  nextOptions?: ChatOption[]
  crisisLevel?: 'low' | 'medium' | 'high'
}

interface UserMemory {
  visitedTopics: string[]
  concernLevel: 'exploring' | 'concerned' | 'distressed'
  preferredSupport: 'information' | 'emotional' | 'resources'
  sessionStart: Date
}

const emergencyResources = [
  {
    name: 'NEDA Helpline',
    contact: '1-800-931-2237',
    description: 'National Eating Disorders Association - Free, confidential support',
    available: 'Mon-Thu 11am-9pm ET, Fri 11am-5pm ET'
  },
  {
    name: 'Crisis Text Line',
    contact: 'Text HOME to 741741',
    description: '24/7 crisis support via text message',
    available: '24/7'
  },
  {
    name: 'SAMHSA Helpline',
    contact: '1-800-662-4357',
    description: 'Mental Health & Substance Abuse support',
    available: '24/7, 365 days'
  }
]

const mainMenuOptions: ChatOption[] = [
  {
    id: 'learn_about_ha',
    text: '🧠 What is HA? (New to this)',
    action: 'respond',
    response: `Hi there! 💚 I'm so glad you're here seeking information.

**Hypothalamic Amenorrhea (HA)** happens when your brain's control center temporarily stops the signals needed for your menstrual cycle. Think of it as your body's protective mode.

**You're not alone** - HA affects many people for various reasons like stress, under-eating, over-exercising, or life pressures.

**The hope-filled truth**: HA is usually reversible with the right support and approach. 🌱

Choose what you'd like to explore:`,
    nextOptions: [
      {
        id: 'causes_simple',
        text: 'What causes it?',
        action: 'respond',
        response: `Your body is incredibly smart and protective! HA usually happens when your body senses it needs to conserve energy. Common triggers include:

💭 **Stress** - School, work, relationships, major life changes
🍽️ **Under-eating** - Not enough fuel for your body's needs
🏃‍♀️ **Over-exercise** - Too much activity relative to energy intake
⚖️ **Weight changes** - Being below your natural set point
😴 **Sleep issues** - Poor quality or irregular sleep patterns

**Remember**: This isn't your fault. Your body is trying to protect you. 💜`
      },
      {
        id: 'symptoms_check',
        text: 'What are the symptoms?',
        action: 'respond',
        response: `HA affects more than just your period. You might be experiencing:

**Right Now:**
• Missing periods (3+ months)
• Always feeling cold 🥶
• Low energy, even after rest
• Trouble sleeping
• Hair thinning
• Mood changes or anxiety

**Health Concerns:**
• Bone health (osteoporosis risk)
• Heart health impacts
• Fertility challenges

**You deserve to feel vibrant and healthy!** These symptoms are your body asking for support.`
      }
    ]
  },
  {
    id: 'recovery_support',
    text: '🌱 I think I have HA - what now?',
    action: 'respond',
    response: `First, take a deep breath. 💚 Seeking help shows incredible strength and self-awareness.

**You're taking the right steps** by learning and reaching out. Recovery is absolutely possible for most people with HA.

**Your next steps might include:**
✨ Finding healthcare providers who understand HA
🍽️ Working with nutrition support if needed
💭 Addressing stress and mental health
💤 Prioritizing sleep and rest
🤗 Building your support system

**Remember**: Recovery isn't linear, and everyone's journey is different. Be patient and kind with yourself.

Choose what feels most important to focus on:`,
    nextOptions: [
      {
        id: 'find_help',
        text: 'Finding the right healthcare team',
        action: 'respond',
        response: `Building the right support team is so important! 🏥

**Look for providers who:**
• Have experience with functional hypothalamic amenorrhea
• Take a holistic approach (not just prescribing birth control)
• Listen to your concerns and experiences
• Work collaboratively with other specialists

**Your team might include:**
👩‍⚕️ Reproductive endocrinologist or gynecologist
🥗 Registered dietitian (eating disorder experience helpful)
🧠 Therapist or counselor
🩺 Primary care physician for overall health

**Red flags to avoid:**
• Dismissing your concerns
• Not addressing underlying causes
• Making you feel judged or ashamed

You deserve compassionate, knowledgeable care. Trust your instincts! 💜`
      },
      {
        id: 'recovery_timeline',
        text: 'How long does recovery take?',
        action: 'respond',
        response: `I know waiting is so hard when you want to feel better! 💙

**The honest answer**: Recovery timelines vary greatly - from 3 months to 2+ years. This isn't about your worth or effort level.

**Factors that influence timing:**
• How long you've had HA
• Underlying causes and how many factors are involved
• Your body's individual healing process
• Access to appropriate support
• Consistency with recovery efforts

**What I want you to know:**
🌱 Every small step matters, even if you can't see progress yet
💚 Your body WANTS to heal and return to balance
✨ Focus on feeling better overall, not just getting periods back
🤗 Many people see improvements in energy, mood, and sleep before periods return

**You're already doing something brave** by seeking information and support.`
      }
    ]
  },
  {
    id: 'emotional_support',
    text: '💜 I need emotional support',
    action: 'respond',
    response: `Oh, sweet friend. 💜 I'm so glad you reached out. Dealing with HA can feel overwhelming, isolating, and scary sometimes.

**Your feelings are completely valid.** Whether you're feeling:
😰 Anxious about your health or future
😢 Sad about changes in your body
😤 Frustrated with the uncertainty
😔 Alone in this experience

**You are NOT alone.** So many people understand exactly what you're going through.

**Some gentle reminders:**
🌟 This is not your fault
💚 Your worth isn't tied to your body or health status
🌱 Healing takes time, and that's okay
🤗 You deserve support and compassion (especially from yourself)

Choose what you'd like support with:`,
    nextOptions: [
      {
        id: 'anxiety_help',
        text: 'Anxiety about recovery/future',
        action: 'respond',
        response: `Anxiety about HA recovery is so incredibly common and understandable. 💙 The uncertainty can feel overwhelming.

**What might help:**
🧘‍♀️ **Grounding techniques** - Focus on what you can control today
📝 **Journaling** - Write out worries to get them out of your head
🌸 **Mindfulness** - Present moment awareness instead of future fears
👥 **Connection** - Talk to people who understand (support groups, therapy)
📚 **Education** - Learning about HA can reduce fear of the unknown

**Gentle truth**: Your anxiety makes complete sense. Your body and life feel uncertain right now.

**Also true**: Thousands of people have walked this path before you and found their way to healing.

**One day at a time, one breath at a time.** 💚`
      },
      {
        id: 'body_image',
        text: 'Struggling with body changes',
        action: 'respond',
        response: `Body image struggles during HA recovery are so real and valid. 💜 Your relationship with your body might feel complicated right now.

**You might be feeling:**
😔 Disconnected from your body
😰 Anxious about weight changes
😢 Grieving your "before" body
😤 Frustrated with your body "not working"

**Gentle reminders:**
🌟 Your body is trying to heal and protect you
💚 Health comes in many different body sizes
🌱 Your worth isn't determined by your body size or shape
✨ Bodies are meant to change throughout our lives

**What might help:**
🤗 **Self-compassion practices** - Talk to yourself like a dear friend
🎨 **Body neutrality** - Focus on what your body does vs. how it looks
💭 **Challenge diet culture thoughts** - Notice and question appearance-focused thinking
👥 **Professional support** - Therapy can be incredibly helpful

**Your body is doing its best.** You deserve to feel at peace with yourself. 💙`
      }
    ]
  },
  {
    id: 'crisis_immediate',
    text: '🚨 I need help right now',
    action: 'crisis',
    crisisLevel: 'high'
  }
]

export default function HASupportChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [userMemory, setUserMemory] = useState<UserMemory>({
    visitedTopics: [],
    concernLevel: 'exploring',
    preferredSupport: 'information',
    sessionStart: new Date()
  })
  const [currentPath, setCurrentPath] = useState<string[]>(['main'])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      initializeChat()
    }
  }, [isOpen])

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: 'welcome',
      text: `Hey there! 👋 I'm your HA support buddy. I'm here to provide a safe space to explore, learn, and find support around hypothalamic amenorrhea.

**I can help with:**
💭 Understanding what HA is
🌱 Recovery information and support
💜 Emotional support and coping
🚨 Crisis resources if you need immediate help

**Everything we talk about is private and judgment-free.** 💚

Choose what you'd like to explore:`,
      isBot: true,
      timestamp: new Date(),
      options: mainMenuOptions
    }
    setMessages([welcomeMessage])
  }

  const updateUserMemory = (topicId: string, concernLevel?: UserMemory['concernLevel']) => {
    setUserMemory(prev => ({
      ...prev,
      visitedTopics: [...prev.visitedTopics, topicId],
      concernLevel: concernLevel || prev.concernLevel
    }))
  }

  const handleOptionClick = (option: ChatOption) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: option.text,
      isBot: false,
      timestamp: new Date()
    }

    // Update path tracking
    setCurrentPath(prev => [...prev, option.id])
    
    // Update user memory
    updateUserMemory(option.id, option.crisisLevel === 'high' ? 'distressed' : undefined)

    if (option.action === 'crisis') {
      // Handle crisis situation
      const crisisMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: `I'm so glad you reached out. 💜 Your safety and wellbeing are the most important things right now.

**If you're in immediate danger, please:**
🚨 Call 911 (US) or your local emergency number
🏥 Go to your nearest emergency room
👥 Reach out to a trusted friend or family member

**For mental health crisis support:**`,
        isBot: true,
        timestamp: new Date(),
        showCrisisResources: true
      }
      setMessages(prev => [...prev, userMessage, crisisMessage])
    } else if (option.response) {
      // Regular response
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: option.response,
        isBot: true,
        timestamp: new Date(),
        options: option.nextOptions || []
      }
      setMessages(prev => [...prev, userMessage, botMessage])
    }
  }

  const handleBackToMain = () => {
    const backMessage: Message = {
      id: Date.now().toString(),
      text: `What else would you like to explore? 💚`,
      isBot: true,
      timestamp: new Date(),
      options: mainMenuOptions
    }
    setMessages(prev => [...prev, backMessage])
    setCurrentPath(['main'])
  }

  const formatMessageText = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Handle bullet points with emojis
      if (line.match(/^[•✨🌟💚🌱🤗👥📚🧘‍♀️📝🌸💭🎨]/)) {
        return (
          <div key={index} className="flex items-start space-x-2 my-1">
            <span className="mt-1 text-sm">{line.charAt(0)}</span>
            <span className="text-[#666666] leading-relaxed text-sm">{line.slice(2)}</span>
          </div>
        )
      }
      
      // Handle bold sections
      if (line.includes('**')) {
        const parts = line.split('**')
        return (
          <div key={index} className="my-2">
            {parts.map((part, partIndex) => (
              partIndex % 2 === 1 ? 
                <strong key={partIndex} className="text-[#333333] font-semibold text-sm">{part}</strong> :
                <span key={partIndex} className="text-[#666666] text-sm">{part}</span>
            ))}
          </div>
        )
      }
      
      // Handle empty lines
      if (line.trim() === '') {
        return <div key={index} className="h-2"></div>
      }
      
      // Regular text
      return (
        <div key={index} className="text-[#666666] leading-relaxed my-1 text-sm">
          {line}
        </div>
      )
    })
  }

  return (
    <>
      {/* Floating Button - Small & Minimalist */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-12 h-12 rounded-full bg-gradient-to-br from-[#87C4BB] to-[#FFB4A2] hover:from-[#87C4BB]/90 hover:to-[#FFB4A2]/90 shadow-lg hover:shadow-xl transition-all duration-300 border-0"
          size="icon"
        >
          <MessageCircle className="w-5 h-5 text-white" />
        </Button>
      </motion.div>

      {/* Chat Window - Compact Size */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-20 right-6 z-50 w-80 h-80"
            initial={{ scale: 0, opacity: 0, transformOrigin: 'bottom right' }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="h-full border border-[#87C4BB]/20 shadow-2xl bg-white/95 backdrop-blur-sm rounded-lg overflow-hidden flex flex-col">
              {/* Header with gradient background */}
              <div className="bg-gradient-to-r from-[#87C4BB] to-[#FFB4A2] text-white p-3 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                      <Heart className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold">HA Support</h3>
                    </div>
                  </div>
                  <Button
                    onClick={() => setIsOpen(false)}
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 text-white hover:bg-white/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-white">
                  {messages.map((message) => (
                    <div key={message.id}>
                      <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
                        <div
                          className={`max-w-[85%] p-2 rounded-lg ${
                            message.isBot
                              ? 'bg-[#F0F8F7] text-[#333333] rounded-bl-sm'
                              : 'bg-[#87C4BB] text-white rounded-br-sm'
                          }`}
                        >
                          <div className="text-sm">
                            {message.isBot ? formatMessageText(message.text) : message.text}
                          </div>
                        </div>
                      </div>

                      {/* Crisis Resources */}
                      {message.showCrisisResources && (
                        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-lg">
                          {emergencyResources.map((resource, index) => (
                            <div key={index} className="mb-2 last:mb-0">
                              <div className="text-xs font-semibold text-red-800">{resource.name}</div>
                              <div className="text-xs text-red-600 font-medium">{resource.contact}</div>
                              <div className="text-xs text-red-700">{resource.description}</div>
                              <div className="text-xs text-red-500">{resource.available}</div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Options */}
                      {message.options && message.options.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {message.options.map((option) => (
                            <Button
                              key={option.id}
                              onClick={() => handleOptionClick(option)}
                              variant="outline"
                              className="w-full text-left justify-start h-auto p-2 border-[#87C4BB]/20 hover:bg-[#87C4BB]/5 hover:border-[#87C4BB]/40 text-[#333333]"
                            >
                              <span className="text-xs">{option.text}</span>
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
              </div>

              {/* Action Buttons */}
              <div className="p-2 border-t border-[#87C4BB]/10 bg-[#F7F7F7]/50 flex-shrink-0">
                <div className="flex space-x-1">
                  <Button
                    onClick={handleBackToMain}
                    variant="outline"
                    size="sm"
                    className="flex-1 text-[#87C4BB] border-[#87C4BB]/30 hover:bg-[#87C4BB]/5 text-xs"
                  >
                    <Home className="w-3 h-3 mr-1" />
                    Main Menu
                  </Button>
                  
                  <Button
                    onClick={() => {
                      const crisisOption = mainMenuOptions.find(opt => opt.id === 'crisis_immediate')
                      if (crisisOption) handleOptionClick(crisisOption)
                    }}
                    variant="ghost"
                    size="sm"
                    className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 text-xs"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    Crisis Help
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
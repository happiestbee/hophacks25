'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, PanInfo } from 'framer-motion'
import PageLayout from '@/components/layout/PageLayout'

export default function SelfLoveSpace() {
  console.log('🔥 SELF LOVE SPACE COMPONENT LOADED 🔥')
  
  // State management for corkboard functionality
  const [mode, setMode] = useState<'corkboard' | 'mirror'>('corkboard')
  const [isMirrorOn, setIsMirrorOn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [stickyNotes, setStickyNotes] = useState<Array<{
    id: string
    text: string
    x: number
    y: number
    color: string
    rotation: number
    width: number
    height: number
    fontSize: number
    isEditing: boolean
    style: string
  }>>([])
  const [editingNote, setEditingNote] = useState<string | null>(null)
  const [editingText, setEditingText] = useState('')
  const [showCustomizeNote, setShowCustomizeNote] = useState(false)
  const [selectedColor, setSelectedColor] = useState('#FFE066')
  const [selectedStyle, setSelectedStyle] = useState('default')
  const [affirmationText, setAffirmationText] = useState('')
  const [debouncedText, setDebouncedText] = useState('')
  const [showAffirmationSuggestions, setShowAffirmationSuggestions] = useState(false)
  const [generatedAffirmations, setGeneratedAffirmations] = useState<string[]>([])
  const [draggedNote, setDraggedNote] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState<{ x: number; y: number; stickerX: number; stickerY: number } | null>(null)
  const [hasDragged, setHasDragged] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 })
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number } | null>(null)
  const [isRotating, setIsRotating] = useState(false)
  const [rotateStart, setRotateStart] = useState<{ x: number; y: number; angle: number } | null>(null)
  const [showStickerPopup, setShowStickerPopup] = useState(false)
  const [uploadedStickers, setUploadedStickers] = useState<Array<{
    id: string
    text: string
    image: string
    width: number
    height: number
  }>>([])
  const [stickers, setStickers] = useState<Array<{
    id: string
    text: string
    image: string
    x: number
    y: number
    width: number
    height: number
    rotation: number
  }>>([])
  
  // Refs for video element and media stream
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const corkboardRef = useRef<HTMLDivElement>(null)

  // Calculate container dimensions for drag constraints
  useEffect(() => {
    const updateDimensions = () => {
      if (corkboardRef.current) {
        const rect = corkboardRef.current.getBoundingClientRect()
        setContainerDimensions({ width: rect.width, height: rect.height })
      }
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)
    return () => window.removeEventListener('resize', updateDimensions)
  }, [])

  // AI Affirmation Generation
  const generateAffirmations = (text: string) => {
    const lowerText = text.toLowerCase()
    
    // Define negative keywords and their positive affirmations
    const affirmationMap: { [key: string]: string[] } = {
      // Self-worth and appearance
      'ugly': [
        "I am beautiful in my own unique way",
        "My beauty radiates from within",
        "I am worthy of love exactly as I am",
        "I choose to see my own beauty",
        "My worth is not determined by my appearance"
      ],
      'stupid': [
        "I am intelligent and capable",
        "I learn and grow every day",
        "My intelligence is unique and valuable",
        "I am wise in my own way",
        "I am worthy of respect and understanding"
      ],
      'dumb': [
        "I am smart and capable",
        "My intelligence shines through",
        "I am worthy of love and respect",
        "I have valuable insights to share",
        "I am learning and growing"
      ],
      'worthless': [
        "I have inherent worth and value",
        "I am deserving of love and happiness",
        "My existence matters and has meaning",
        "I am enough just as I am",
        "I am precious and irreplaceable"
      ],
      'useless': [
        "I have unique gifts to offer the world",
        "I am valuable and important",
        "My presence makes a difference",
        "I am capable of amazing things",
        "I contribute meaningfully to life"
      ],
      'failure': [
        "Every setback is a setup for a comeback",
        "I am learning and growing from my experiences",
        "My worth is not determined by outcomes",
        "I am resilient and capable of overcoming challenges",
        "I transform setbacks into growth opportunities"
      ],
      'hate': [
        "I choose to love myself instead",
        "I am worthy of love and acceptance",
        "I release negative thoughts and embrace positivity",
        "I am deserving of kindness and compassion",
        "I transform self-hate into self-love"
      ],
      'disgusting': [
        "I am beautiful and worthy of love",
        "My body is a temple that deserves respect",
        "I am more than my physical appearance",
        "I choose to see my own worth",
        "I am deserving of care and compassion"
      ],
      'gross': [
        "I am beautiful and valuable",
        "My body deserves love and care",
        "I am worthy of respect and kindness",
        "I choose to see my own beauty",
        "I am deserving of self-compassion"
      ],
      'awful': [
        "I am wonderful and deserving of love",
        "My worth is not determined by my feelings",
        "I am capable of growth and change",
        "I choose to see my own value",
        "I am worthy of happiness and joy"
      ],
      'terrible': [
        "I am amazing and worthy of love",
        "My value is not determined by my struggles",
        "I am resilient and capable",
        "I choose to see my own strength",
        "I am deserving of peace and happiness"
      ],
      'horrible': [
        "I am wonderful and deserving of happiness",
        "My worth is inherent and unchangeable",
        "I am capable of healing and growth",
        "I choose to see my own beauty",
        "I am worthy of love and acceptance"
      ],
      'fat': [
        "My worth is not determined by my size",
        "I am beautiful at any size",
        "My body deserves love and respect",
        "I honor my body's natural shape",
        "I am worthy of love regardless of my appearance"
      ],
      'skinny': [
        "My worth is not determined by my size",
        "I am beautiful and strong",
        "My body is perfect as it is",
        "I am worthy of love and respect",
        "I honor my body's natural form"
      ],
      'weak': [
        "I am strong and resilient",
        "My strength comes from within",
        "I am capable of overcoming challenges",
        "I am powerful in my own way",
        "I am stronger than I know"
      ],
      'tired': [
        "I am strong and resilient",
        "I deserve rest and care",
        "I am doing my best and that's enough",
        "I honor my body's need for rest",
        "I am worthy of self-compassion"
      ],
      'sad': [
        "I am allowed to feel my emotions",
        "This feeling will pass and I will grow stronger",
        "I am worthy of joy and happiness",
        "I am gentle with myself in difficult times",
        "I am resilient and will find peace"
      ],
      'anxious': [
        "I am safe and I trust myself",
        "I breathe through this moment",
        "I am stronger than my fears",
        "I am learning to find peace within",
        "I am capable of handling this"
      ],
      'lonely': [
        "I am worthy of love and connection",
        "I am never truly alone",
        "I attract positive relationships",
        "I am learning to love my own company",
        "I am surrounded by love"
      ],
      'overwhelmed': [
        "I am capable of handling this one step at a time",
        "I breathe through this moment with strength",
        "I am stronger than I know",
        "I trust in my ability to navigate challenges",
        "I am resilient and will find my way"
      ],
      'confused': [
        "I trust in my own wisdom",
        "I am learning and growing through uncertainty",
        "I have the answers within me",
        "I am patient with my own process",
        "I am capable of finding clarity"
      ],
      'broken': [
        "I am whole and complete",
        "I am healing and growing stronger",
        "I am worthy of love and care",
        "I am resilient and capable of healing",
        "I am beautiful in my journey"
      ],
      'damaged': [
        "I am whole and worthy of love",
        "My experiences have made me stronger",
        "I am healing and growing",
        "I am deserving of compassion and care",
        "I am beautiful in my authenticity"
      ],
      'not good enough': [
        "I am enough exactly as I am",
        "I am worthy of all good things",
        "I believe in my own worth",
        "I am learning to see my own value",
        "I am deserving of love and happiness"
      ],
      'not smart enough': [
        "I am intelligent and capable",
        "My intelligence is unique and valuable",
        "I am worthy of respect and understanding",
        "I am learning and growing every day",
        "I have valuable insights to share"
      ],
      'not pretty enough': [
        "I am beautiful in my own unique way",
        "My beauty radiates from within",
        "I am worthy of love exactly as I am",
        "I choose to see my own beauty",
        "I am deserving of love and acceptance"
      ],
      'not strong enough': [
        "I am strong and resilient",
        "My strength comes from within",
        "I am capable of amazing things",
        "I am powerful in my own way",
        "I am stronger than I know"
      ]
    }

    // Find matching keywords and generate affirmations
    const foundAffirmations: string[] = []
    
    for (const [keyword, affirmations] of Object.entries(affirmationMap)) {
      if (lowerText.includes(keyword)) {
        foundAffirmations.push(...affirmations)
      }
    }

    // If no specific keywords found, provide general positive affirmations
    if (foundAffirmations.length === 0) {
      const generalAffirmations = [
        "I am worthy of love and happiness",
        "I am enough exactly as I am",
        "I choose to see the good in myself",
        "I am deserving of peace and joy",
        "I am growing and learning every day",
        "I am strong and capable",
        "I am beautiful inside and out",
        "I trust in my own journey",
        "I am worthy of all good things",
        "I am grateful for who I am becoming"
      ]
      return generalAffirmations.slice(0, 3)
    }

    // Return up to 3 unique affirmations
    const uniqueAffirmations = [...new Set(foundAffirmations)]
    return uniqueAffirmations.slice(0, 3)
  }

  // Debounce text input for affirmation generation
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedText(affirmationText)
    }, 500) // Wait 500ms after user stops typing

    return () => clearTimeout(timer)
  }, [affirmationText])

  // Generate affirmations when text changes
  useEffect(() => {
    if (debouncedText.trim()) {
      const suggestions = generateAffirmations(debouncedText)
      setGeneratedAffirmations(suggestions)
      setShowAffirmationSuggestions(true)
    } else {
      setShowAffirmationSuggestions(false)
      setGeneratedAffirmations([])
    }
  }, [debouncedText])

  // Sticker data - all available stickers
  const stickerOptions = [
    { id: 'have-good-day', text: 'HAVE A GOOD DAY', image: '/stickers/have-good-day.png', width: 160, height: 120 },
    { id: 'beige-blue-motivational', text: 'Motivational', image: '/stickers/Beige Blue Bright Cute Motivational Square Sticker.png', width: 160, height: 120 },
    { id: 'colorful-great-job', text: 'Great Job!', image: '/stickers/Colorful Pastel Cute Great Job for Kids Sticker.png', width: 160, height: 120 },
    { id: 'green-yellow-retro', text: 'Retro Quote', image: '/stickers/Green and Yellow Creative Retro Quotes Sticker.png', width: 160, height: 120 },
    { id: 'pink-blue-good-vibes', text: 'Good Vibes', image: '/stickers/Pink Blue Yellow Retro Only Good Vibes Smiley Circle Sticker.png', width: 160, height: 120 },
    { id: 'pink-white-coquette', text: 'Sweet Quote', image: '/stickers/Pink White Sweet Coquette Frame Quote Sticker.png', width: 160, height: 120 }
  ]

  // Function to start the camera
  const startMirror = async () => {
    console.log('🔄 Starting mirror...')
    setIsLoading(true)
    setError(null)
    
    try {
      console.log('🔍 Checking browser support...')
      // Check if getUserMedia is supported in this browser
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser. Please use a modern browser like Chrome, Firefox, or Safari.')
      }
      console.log('✅ Browser supports getUserMedia')

      console.log('📹 Requesting camera access...')
      // Request camera access with basic video constraints
      // Using { video: true } for maximum compatibility
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true 
      })
      console.log('✅ Camera access granted, stream:', stream)
      
      // Store the stream reference for cleanup
      streamRef.current = stream
      
      // Wait a bit for the video element to be rendered
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Set the video source and start playing
      if (videoRef.current) {
        console.log('🎥 Setting video source...')
        videoRef.current.srcObject = stream
        setIsMirrorOn(true)
        console.log('✅ Camera started successfully')
      } else {
        console.error('❌ Video ref is still null after waiting!')
        setError('Video element not found. Please refresh the page and try again.')
      }
      
    } catch (err) {
      // Handle different types of errors
      console.error('❌ Camera error:', err)
      
      if (err instanceof Error) {
        setError(`${err.name}: ${err.message}`)
      } else {
        setError('Unknown error occurred while accessing camera')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Function to stop the camera and clean up
  const stopMirror = () => {
    if (streamRef.current) {
      // Stop all tracks in the stream
      streamRef.current.getTracks().forEach(track => {
        track.stop()
        console.log('Stopped track:', track.kind)
      })
      streamRef.current = null
    }
    
    // Clear the video source
    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    setIsMirrorOn(false)
    setError(null)
    console.log('Camera stopped and cleaned up')
  }

  // Corkboard functions
  const addStickyNote = () => {
    setShowCustomizeNote(true)
  }

  const getStickyNoteStyle = (note: { color: string; style: string }) => {
    const baseStyle = {
      backgroundColor: note.color,
      boxShadow: `
        0 6px 12px rgba(0,0,0,0.3),
        0 3px 6px rgba(0,0,0,0.2),
        0 1px 3px rgba(0,0,0,0.1),
        inset 0 1px 0 rgba(255,255,255,0.4),
        inset 0 -1px 0 rgba(0,0,0,0.15)
      `,
      border: '1px solid rgba(0,0,0,0.15)',
      borderRadius: '3px',
      background: `linear-gradient(135deg, ${note.color} 0%, ${note.color} 85%, rgba(0,0,0,0.05) 100%)`
    }

    switch (note.style) {
      case 'pinned':
        return {
          ...baseStyle,
          position: 'relative' as const,
          '&::before': {
            content: '"📌"',
            position: 'absolute',
            top: '-8px',
            left: '10px',
            fontSize: '16px',
            zIndex: 1
          },
          '&::after': {
            content: '"📌"',
            position: 'absolute',
            top: '-8px',
            right: '10px',
            fontSize: '16px',
            zIndex: 1
          }
        }
      case 'flower':
        return {
          ...baseStyle,
          background: `
            linear-gradient(135deg, ${note.color} 0%, ${note.color} 85%, rgba(0,0,0,0.05) 100%),
            radial-gradient(circle at 20% 20%, rgba(255, 182, 193, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(255, 182, 193, 0.3) 0%, transparent 50%)
          `
        }
      case 'star':
        return {
          ...baseStyle,
          background: `
            linear-gradient(135deg, ${note.color} 0%, ${note.color} 85%, rgba(0,0,0,0.05) 100%),
            radial-gradient(circle at 15% 15%, rgba(255, 215, 0, 0.2) 0%, transparent 40%),
            radial-gradient(circle at 85% 85%, rgba(255, 215, 0, 0.2) 0%, transparent 40%)
          `
        }
      default:
        return baseStyle
    }
  }

  const createStickyNote = () => {
    const newNote = {
      id: Date.now().toString(),
      text: affirmationText || 'Click to edit...',
      x: Math.random() * 300 + 50, // Random position
      y: Math.random() * 200 + 50,
      color: selectedColor,
      rotation: Math.random() * 20 - 10, // Random rotation between -10 and 10 degrees
      width: 200, // Default width
      height: 200, // Default height
      fontSize: 14, // Default font size
      isEditing: false,
      style: selectedStyle
    }
    setStickyNotes([...stickyNotes, newNote])
    setShowCustomizeNote(false)
    setAffirmationText('')
    clearSuggestions()
  }

  // Start editing a note
  const startEditing = (noteId: string) => {
    const note = stickyNotes.find(n => n.id === noteId)
    if (note) {
      setEditingNote(noteId)
      setEditingText(note.text === 'Click to edit...' ? '' : note.text)
      setStickyNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === noteId ? { ...n, isEditing: true } : n
        )
      )
    }
  }

  // Save editing changes
  const saveEditing = (noteId: string) => {
    setStickyNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId
          ? { ...note, text: editingText || 'Click to edit...', isEditing: false }
          : note
      )
    )
    setEditingNote(null)
    setEditingText('')
  }

  // Cancel editing
  const cancelEditing = (noteId: string) => {
    setStickyNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, isEditing: false } : note
      )
    )
    setEditingNote(null)
    setEditingText('')
  }

  // Update font size
  const updateFontSize = (noteId: string, newSize: number) => {
    setStickyNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === noteId ? { ...note, fontSize: newSize } : note
      )
    )
  }

  const removeStickyNote = (id: string) => {
    setStickyNotes(stickyNotes.filter(note => note.id !== id))
  }

  // Sticker functions
  const addSticker = (stickerOption: { id: string; text: string; image: string; width: number; height: number }) => {
    console.log('Adding sticker:', stickerOption)
    const newSticker = {
      id: `${stickerOption.id}-${Date.now()}`,
      text: stickerOption.text,
      image: stickerOption.image,
      x: Math.random() * 200 + 50, // Random position
      y: Math.random() * 200 + 50,
      width: stickerOption.width || 120,
      height: stickerOption.height || 80,
      rotation: 0 // No rotation for now
    }
    console.log('New sticker created:', newSticker)
    setStickers(prev => {
      const newStickers = [...prev, newSticker]
      console.log('All stickers now:', newStickers)
      return newStickers
    })
    setShowStickerPopup(false)
  }

  const removeSticker = (id: string) => {
    setStickers(prev => prev.filter(sticker => sticker.id !== id))
  }

  // Handle file upload for custom stickers
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if it's an image
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, etc.)')
      return
    }

    // Create a URL for the uploaded image
    const imageUrl = URL.createObjectURL(file)
    
    // Create a new sticker option
    const newUploadedSticker = {
      id: `uploaded-${Date.now()}`,
      text: file.name.replace(/\.[^/.]+$/, ''), // Remove file extension
      image: imageUrl,
      width: 160,
      height: 120
    }

    // Add to uploaded stickers
    setUploadedStickers(prev => [...prev, newUploadedSticker])
    
    // Clear the input
    event.target.value = ''
  }

  // Framer Motion drag handlers for stickers
  const handleStickerDragStart = (stickerId: string) => {
    setDraggedNote(stickerId)
    setIsDragging(true)
  }

  const handleStickerDragEnd = (stickerId: string, event: unknown, info: PanInfo) => {
    // Let Framer Motion handle the positioning, just update our state
    setDraggedNote(null)
    setIsDragging(false)
  }

  // Function to select an affirmation suggestion
  const selectAffirmation = (affirmation: string) => {
    setAffirmationText(affirmation)
    setShowAffirmationSuggestions(false)
  }

  // Function to clear suggestions
  const clearSuggestions = () => {
    setShowAffirmationSuggestions(false)
    setGeneratedAffirmations([])
  }

  // Drag functions for sticky notes
  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault()
    setDraggedNote(noteId)
    setHasDragged(false)
    
    const note = stickyNotes.find(n => n.id === noteId)
    if (note) {
      const containerRef = mode === 'corkboard' ? corkboardRef.current : videoRef.current?.parentElement;
      const containerRect = containerRef?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
      
      setDragStart({
        x: e.clientX,
        y: e.clientY,
        stickerX: note.x,
        stickerY: note.y
      })
      
      setDragOffset({
        x: e.clientX - containerRect.left - note.x,
        y: e.clientY - containerRect.top - note.y
      })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isResizing) {
      handleResizeMove(e)
    } else if (isRotating) {
      handleRotateMove(e)
    } else if (draggedNote && dragStart) {
      // Calculate distance moved
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
      
      // Only start dragging if moved more than 5 pixels
      if (distance > 5) {
        setHasDragged(true)
        
        const containerRef = mode === 'corkboard' ? corkboardRef.current : videoRef.current?.parentElement;
        const containerRect = containerRef?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
        
        // Check if we're dragging a sticky note
        const note = stickyNotes.find(n => n.id === draggedNote)
        
        if (note) {
          // Handle sticky note dragging
          const noteWidth = note?.width || 200
          const noteHeight = note?.height || 200
          
          const newX = e.clientX - containerRect.left - dragOffset.x;
          const newY = e.clientY - containerRect.top - dragOffset.y;
          
          setStickyNotes(prevNotes =>
            prevNotes.map(note =>
              note.id === draggedNote
                ? {
                    ...note,
                    x: Math.max(0, Math.min(newX, containerRect.width - noteWidth)),
                    y: Math.max(0, Math.min(newY, containerRect.height - noteHeight))
                  }
                : note
            )
          )
        }
      }
    }
  }

  const handleMouseUp = () => {
    setDraggedNote(null)
    setHasDragged(false)
    setIsResizing(false)
    setIsRotating(false)
    setResizeStart(null)
    setRotateStart(null)
  }

  // Resize functions for sticky notes
  const handleResizeStart = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault()
    e.stopPropagation()
    setIsResizing(true)
    setDraggedNote(noteId) // Set the dragged note for resize
    
    const note = stickyNotes.find(n => n.id === noteId)
    if (note) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: note.width,
        height: note.height
      })
    }
  }

  const handleResizeMove = (e: React.MouseEvent) => {
    if (isResizing && draggedNote && resizeStart) {
      const deltaX = e.clientX - resizeStart.x
      const deltaY = e.clientY - resizeStart.y
      
      const newWidth = Math.max(80, Math.min(300, resizeStart.width + deltaX))
      const newHeight = Math.max(80, Math.min(300, resizeStart.height + deltaY))
      
      setStickyNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === draggedNote
            ? { ...note, width: newWidth, height: newHeight }
            : note
        )
      )
    }
  }

  const handleRotateStart = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault()
    e.stopPropagation()
    
    const note = stickyNotes.find(n => n.id === noteId)
    if (!note) return
    
    setIsRotating(true)
    setDraggedNote(noteId)
    setRotateStart({
      x: e.clientX,
      y: e.clientY,
      angle: note.rotation
    })
  }

  const handleRotateMove = (e: React.MouseEvent) => {
    if (isRotating && draggedNote && rotateStart) {
      const note = stickyNotes.find(n => n.id === draggedNote)
      if (!note) return

      const deltaX = e.clientX - rotateStart.x
      const deltaY = e.clientY - rotateStart.y
      
      // Calculate rotation based on horizontal movement for smoother control
      // Use horizontal movement as the primary rotation input
      const rotationSensitivity = 0.5 // Adjust this value to make rotation more/less sensitive
      const newRotation = rotateStart.angle + (deltaX * rotationSensitivity)
      
      setStickyNotes(prevNotes =>
        prevNotes.map(n =>
          n.id === draggedNote
            ? { ...n, rotation: newRotation }
            : n
        )
      )
    }
  }

  // Mouse event listeners for sticky notes
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizing) {
        handleResizeMove(e as React.MouseEvent)
      } else if (isRotating) {
        handleRotateMove(e as React.MouseEvent)
      } else if (draggedNote && dragStart) {
        // Calculate distance moved
        const deltaX = e.clientX - dragStart.x
        const deltaY = e.clientY - dragStart.y
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY)
        
        // Only start dragging if moved more than 5 pixels
        if (distance > 5) {
          setHasDragged(true)
          
          const containerRef = mode === 'corkboard' ? corkboardRef.current : videoRef.current?.parentElement;
          const containerRect = containerRef?.getBoundingClientRect() || { left: 0, top: 0, width: 0, height: 0 };
          
          // Check if we're dragging a sticky note
          const note = stickyNotes.find(n => n.id === draggedNote)
          
          if (note) {
            // Handle sticky note dragging
            const noteWidth = note?.width || 200
            const noteHeight = note?.height || 200
            
            const newX = e.clientX - containerRect.left - dragOffset.x;
            const newY = e.clientY - containerRect.top - dragOffset.y;
            
            setStickyNotes(prevNotes =>
              prevNotes.map(note =>
                note.id === draggedNote
                  ? {
                      ...note,
                      x: Math.max(0, Math.min(newX, containerRect.width - noteWidth)),
                      y: Math.max(0, Math.min(newY, containerRect.height - noteHeight))
                    }
                  : note
              )
            )
          }
        }
      }
    }

    const handleMouseUp = () => {
      setDraggedNote(null)
      setHasDragged(false)
      setIsResizing(false)
      setIsRotating(false)
      setResizeStart(null)
      setRotateStart(null)
    }

    if (draggedNote || isResizing || isRotating) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      document.addEventListener('mouseleave', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.removeEventListener('mouseleave', handleMouseUp)
    }
  }, [draggedNote, isResizing, isRotating, dragStart, hasDragged, resizeStart, rotateStart, stickyNotes, mode, dragOffset])

  // Cleanup on component unmount
  useEffect(() => {
    return () => {
      stopMirror()
    }
  }, [])

  console.log('🔥 RENDERING SELF LOVE SPACE PAGE 🔥')

  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#333333]">Self-Love Space</h1>
          <p className="text-[#666666]">Your personal corkboard and mirror space</p>
        </div>

        {/* Mode Selection */}
        <div className="flex justify-center gap-4">
          <button
            onClick={() => {
              setMode('corkboard')
              // Automatically turn off camera when switching away from mirror
              if (isMirrorOn) {
                stopMirror()
              }
            }}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === 'corkboard'
                ? 'bg-[#FFB4A2] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            📌 Corkboard
          </button>
          <button
            onClick={() => setMode('mirror')}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              mode === 'mirror'
                ? 'bg-[#FFB4A2] text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            🪞 Mirror
          </button>
              </div>

        <div className="space-y-6">
          {mode === 'corkboard' ? (
            /* Corkboard Mode */
            <div className="space-y-4">
              {/* Add Note Controls */}
              <div className="flex flex-col items-center gap-4">
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowCustomizeNote(true)}
                    className="px-6 py-3 bg-white/80 hover:bg-white/90 text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <span className="text-lg">+</span>
                    Create Blank Sticky Note
                  </button>
                  <button
                    onClick={() => setShowStickerPopup(true)}
                    className="px-6 py-3 bg-white/80 hover:bg-white/90 text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                  >
                    <span className="text-lg">+</span>
                    Add Stickers
                  </button>
                </div>
        </div>

              {/* Sticky Note Customization */}
              {showCustomizeNote && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Customize Your Sticky Note</h3>
                  
                  {/* Color Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Choose Color:</label>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {[
                        { name: 'Yellow', value: '#FFE066' },
                        { name: 'Pink', value: '#FFB4A2' },
                        { name: 'Mint', value: '#87C4BB' },
                        { name: 'Lavender', value: '#C1A7E1' },
                        { name: 'Peach', value: '#FFE4B5' },
                        { name: 'Coral', value: '#FF7F7F' },
                        { name: 'Sky Blue', value: '#87CEEB' },
                        { name: 'Lime', value: '#98FB98' }
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                            selectedColor === color.value 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Choose Style:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { 
                          name: 'Classic', 
                          value: 'default',
                          preview: '📝',
                          description: 'Simple and clean'
                        },
                        { 
                          name: 'Pinned', 
                          value: 'pinned',
                          preview: '📌📝📌',
                          description: 'With red pins'
                        },
                        { 
                          name: 'Flower', 
                          value: 'flower',
                          preview: '🌸📝🌸',
                          description: 'Floral pattern'
                        },
                        { 
                          name: 'Star', 
                          value: 'star',
                          preview: '⭐📝⭐',
                          description: 'Star decorations'
                        }
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setSelectedStyle(style.value)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedStyle === style.value 
                              ? 'border-[#FFB4A2] bg-[#FFB4A2] bg-opacity-20' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{style.preview}</div>
                            <div className="font-medium text-sm text-gray-800">{style.name}</div>
                            <div className="text-xs text-gray-600">{style.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Affirmation Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Add an Affirmation:</label>
                    
                    {/* Custom Affirmation Input */}
                    <div className="mb-4">
                      <textarea
                        value={affirmationText}
                        onChange={(e) => setAffirmationText(e.target.value)}
                        placeholder="Write your own positive affirmation or describe how you're feeling..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#87C4BB] focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    {/* AI-Generated Affirmation Suggestions */}
                    {showAffirmationSuggestions && generatedAffirmations.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">AI Suggestions:</span>
                            <span className="text-xs text-gray-500">Click to use</span>
                          </div>
                          <button
                            onClick={clearSuggestions}
                            className="text-gray-400 hover:text-gray-600 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2">
                          {generatedAffirmations.map((affirmation, index) => (
                            <button
                              key={`${debouncedText}-${index}`}
                              onClick={() => selectAffirmation(affirmation)}
                              className="w-full p-3 text-left bg-gradient-to-r from-[#FFB4A2] to-[#FFC4B4] hover:from-[#FF9F8A] hover:to-[#FFB4A2] text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">✨</span>
                                <span className="flex-1">&quot;{affirmation}&quot;</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowCustomizeNote(false)
                        clearSuggestions()
                      }}
                      className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createStickyNote}
                      className="px-6 py-2 bg-[#87C4BB] hover:bg-[#7AB3A8] text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Add to Corkboard
                    </button>
                  </div>
                </div>
              )}

              {/* Corkboard */}
              <div
                ref={corkboardRef}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className="relative aspect-[4/3] rounded-lg border-4 border-amber-800 shadow-xl overflow-hidden"
                style={{
                  background: `
                    radial-gradient(circle, rgba(139, 115, 85, 0.4) 1px, transparent 1px),
                    linear-gradient(135deg, #D2B48C 0%, #DEB887 50%, #D2B48C 100%)
                  `,
                  backgroundSize: '20px 20px, 100% 100%',
                  boxShadow: 'inset 0 0 20px rgba(0,0,0,0.1), 0 8px 24px rgba(0,0,0,0.2)'
                }}
              >
                {/* Sticky Notes */}
                {stickyNotes.map((note) => (
                  <div
                    key={note.id}
                    className={`absolute p-3 transform transition-transform duration-200 flex flex-col ${
                      draggedNote === note.id ? 'z-10 scale-105' : ''
                    } ${note.isEditing ? 'cursor-default' : 'cursor-move hover:scale-105'}`}
                    style={{
                      left: note.x,
                      top: note.y,
                      transform: `rotate(${note.rotation}deg)`,
                      width: note.width,
                      height: note.height,
                      ...getStickyNoteStyle(note)
                    }}
                    onMouseDown={(e) => !note.isEditing && handleMouseDown(e, note.id)}
                  >
                    {/* Decorative elements based on style */}
                    {note.style === 'pinned' && (
                      <>
                        <div className="absolute -top-2 left-2 text-red-500 text-xl">📌</div>
                        <div className="absolute -top-2 right-2 text-red-500 text-xl">📌</div>
                      </>
                    )}
                    {note.style === 'flower' && (
                      <>
                        <div className="absolute -top-1 left-1 text-pink-300 text-base">🌸</div>
                        <div className="absolute -top-1 right-1 text-pink-300 text-base">🌸</div>
                        <div className="absolute -bottom-1 left-1 text-pink-300 text-base">🌸</div>
                        <div className="absolute -bottom-1 right-1 text-pink-300 text-base">🌸</div>
                      </>
                    )}
                    {note.style === 'star' && (
                      <>
                        <div className="absolute -top-1 left-1 text-yellow-400 text-base">⭐</div>
                        <div className="absolute -top-1 right-1 text-yellow-400 text-base">⭐</div>
                        <div className="absolute -bottom-1 left-1 text-yellow-400 text-base">⭐</div>
                        <div className="absolute -bottom-1 right-1 text-yellow-400 text-base">⭐</div>
                      </>
                    )}
                    {note.isEditing ? (
                      // Editing mode
                      <div className="flex-1 flex flex-col">
                        <textarea
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full flex-1 bg-transparent border-none outline-none resize-none text-gray-800 font-medium leading-tight"
                          style={{ fontSize: `${note.fontSize}px` }}
                          autoFocus
                          placeholder="Type your note..."
                        />
                        
                        {/* Editing controls */}
                        <div className="flex items-center justify-between mt-2 px-1">
                          <div className="flex items-center gap-1">
                            <label className="text-xs text-gray-600">Size:</label>
                            <input
                              type="range"
                              min="10"
                              max="48"
                              value={note.fontSize}
                              onChange={(e) => updateFontSize(note.id, parseInt(e.target.value))}
                              className="w-12 h-1 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                            />
                            <span className="text-xs text-gray-600">{note.fontSize}px</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => saveEditing(note.id)}
                              className="w-6 h-6 text-xs bg-green-500 text-white rounded hover:bg-green-600 flex items-center justify-center"
                            >
                              ✓
                            </button>
                            <button
                              onClick={() => cancelEditing(note.id)}
                              className="w-6 h-6 text-xs bg-gray-500 text-white rounded hover:bg-gray-600 flex items-center justify-center"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // Display mode
                      <>
                        <div 
                          className="text-gray-800 font-medium leading-tight flex-1 overflow-hidden cursor-pointer"
                          style={{ fontSize: `${note.fontSize}px` }}
                          onClick={() => startEditing(note.id)}
                        >
                          {note.text}
                        </div>
                        <div 
                          className="text-gray-600 mt-1 opacity-70 flex-shrink-0 text-xs"
                        >
                          Click to edit
                        </div>

                        {/* Resize handle */}
                        <div
                          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
                          style={{
                            background: 'linear-gradient(-45deg, transparent 0%, transparent 30%, rgba(0,0,0,0.3) 30%, rgba(0,0,0,0.3) 100%)'
                          }}
                          onMouseDown={(e) => handleResizeStart(e, note.id)}
                        />
                        
                        {/* Close button */}
                        <div
                          className="absolute -top-2 -left-2 w-6 h-6 cursor-pointer opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
                          style={{
                            background: 'rgba(239, 68, 68, 0.9)',
                            borderRadius: '50%',
                            border: '2px solid rgba(239, 68, 68, 1)'
                          }}
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            removeStickyNote(note.id)
                          }}
                        >
                          <div className="text-white text-xs font-bold">×</div>
        </div>

                        {/* Rotation handle */}
                        <div
                          className="absolute -top-2 -right-2 w-6 h-6 cursor-grab active:cursor-grabbing opacity-50 hover:opacity-100 transition-opacity flex items-center justify-center"
                          style={{
                            background: 'rgba(0,0,0,0.1)',
                            borderRadius: '50%',
                            border: '2px solid rgba(0,0,0,0.3)'
                          }}
                          onMouseDown={(e) => handleRotateStart(e, note.id)}
                        >
                          <div className="w-2 h-2 bg-gray-600 rounded-full"></div>
                        </div>
                      </>
                    )}
                  </div>
                ))}

                {/* Stickers */}
                {stickers.map((sticker) => (
                  <motion.div
                    key={sticker.id}
                    data-sticker-id={sticker.id}
                    className={`absolute cursor-grab active:cursor-grabbing ${
                      draggedNote === sticker.id ? 'z-50' : 'z-10'
                    }`}
                    style={{
                      width: sticker.width,
                      height: sticker.height,
                      transform: `rotate(${sticker.rotation}deg)`,
                      touchAction: 'none'
                    }}
                    drag
                    dragMomentum={false}
                    dragElastic={0}
                    dragConstraints={{
                      left: 0,
                      right: containerDimensions.width - sticker.width,
                      top: 0,
                      bottom: containerDimensions.height - sticker.height
                    }}
                    initial={{ x: sticker.x, y: sticker.y }}
                    onDragStart={() => handleStickerDragStart(sticker.id)}
                    onDragEnd={(event, info) => handleStickerDragEnd(sticker.id, event, info)}
                    whileDrag={{ 
                      scale: 1.05,
                      zIndex: 50,
                      cursor: 'grabbing'
                    }}
                  >
                    <div className="relative h-full w-full">
                      {/* Close button for stickers */}
                      <button
                        className="absolute -left-2 -top-2 z-20 rounded-full bg-rose-500 text-white px-2 text-xs cursor-pointer opacity-50 hover:opacity-100 transition-opacity"
                        onMouseDown={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onTouchStart={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                        }}
                        onClick={(e) => { 
                          e.stopPropagation(); 
                          e.preventDefault();
                          // Only delete if not currently dragging
                          if (!isDragging && draggedNote !== sticker.id) {
                            removeSticker(sticker.id);
                          }
                        }}
                        aria-label="Delete sticker"
                      >
                        ×
                      </button>
                      
                      {/* Sticker image */}
                      <img
                        src={sticker.image}
                        alt={sticker.text}
                        className="block select-none rounded-md shadow pointer-events-auto w-full h-full object-contain"
                        style={{ 
                          userSelect: 'none',
                          WebkitUserDrag: 'none'
                        } as React.CSSProperties & { WebkitUserDrag?: string }}
                        draggable={false}
                      />
                    </div>
                  </motion.div>
                ))}

                {/* Default encouragement if no notes or stickers */}
                {stickyNotes.length === 0 && stickers.length === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-amber-700">
                      <div className="text-4xl mb-2">📌</div>
                      <p className="text-lg font-medium">Add your first sticky note or sticker!</p>
                      <p className="text-sm opacity-70">Write affirmations, goals, or add fun stickers</p>
                  </div>
                </div>
                )}
              </div>
            </div>
          ) : (
            /* Mirror Mode */
            <div className="space-y-6">
              {/* Mirror Controls */}
              <div className="flex flex-col items-center gap-4">
                {/* Mirror Toggle Switch */}
                <div className="flex items-center justify-center gap-4">
                  <span className={`text-sm font-medium transition-colors ${!isMirrorOn ? 'text-gray-500' : 'text-gray-700'}`}>
                    Off
                  </span>
                  <button
                    onClick={isMirrorOn ? stopMirror : startMirror}
                    disabled={isLoading}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#FFB4A2] focus:ring-offset-2 ${
                      isMirrorOn 
                        ? 'bg-[#FFB4A2]' 
                        : 'bg-gray-300'
                    } ${isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform duration-200 ${
                        isMirrorOn ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                  <span className={`text-sm font-medium transition-colors ${isMirrorOn ? 'text-[#FFB4A2]' : 'text-gray-500'}`}>
                    On
                  </span>
      </div>
              </div>

              {/* Mirror Controls - Add Note Buttons */}
              {isMirrorOn && (
                <div className="flex flex-col items-center gap-4">
                  <div className="flex gap-4">
                    <button
                      onClick={() => setShowCustomizeNote(true)}
                      className="px-6 py-3 bg-white/80 hover:bg-white/90 text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <span className="text-lg">+</span>
                      Create Blank Sticky Note
                    </button>
                    <button
                      onClick={() => setShowStickerPopup(true)}
                      className="px-6 py-3 bg-white/80 hover:bg-white/90 text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm"
                    >
                      <span className="text-lg">+</span>
                      Add Stickers
                    </button>
                  </div>
                </div>
              )}

              {/* Video Container */}
              <div className="aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200 relative max-w-md mx-auto">
                {/* Always render video element but hide when not active */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover ${isMirrorOn ? 'block' : 'hidden'}`}
                  style={{ transform: 'scaleX(-1)' }} // Mirror effect
                />
                
                {/* Placeholder when mirror is off */}
                {!isMirrorOn && (
                  <div className="w-full h-full flex items-center justify-center absolute inset-0">
                    <div className="text-center text-gray-500">
                      <div className="w-16 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                        <span className="text-2xl">📷</span>
                      </div>
                      <p>Click &quot;On&quot; to start mirror</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Sticky Note Customization for Mirror Mode */}
              {showCustomizeNote && mode === 'mirror' && (
                <div className="mt-6 p-6 bg-white rounded-lg shadow-lg border-2 border-gray-200">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">Customize Your Sticky Note</h3>
                  
                  {/* Color Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Choose Color:</label>
                    <div className="flex flex-wrap gap-3 justify-center">
                      {[
                        { name: 'Yellow', value: '#FFE066' },
                        { name: 'Pink', value: '#FFB4A2' },
                        { name: 'Mint', value: '#87C4BB' },
                        { name: 'Lavender', value: '#C1A7E1' },
                        { name: 'Peach', value: '#FFE4B5' },
                        { name: 'Coral', value: '#FF7F7F' },
                        { name: 'Sky Blue', value: '#87CEEB' },
                        { name: 'Lime', value: '#98FB98' }
                      ].map((color) => (
                        <button
                          key={color.value}
                          onClick={() => setSelectedColor(color.value)}
                          className={`w-12 h-12 rounded-full border-4 transition-all duration-200 ${
                            selectedColor === color.value 
                              ? 'border-gray-800 scale-110' 
                              : 'border-gray-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: color.value }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Style Selection */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Choose Style:</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { 
                          name: 'Classic', 
                          value: 'default',
                          preview: '📝',
                          description: 'Simple and clean'
                        },
                        { 
                          name: 'Pinned', 
                          value: 'pinned',
                          preview: '📌📝📌',
                          description: 'With red pins'
                        },
                        { 
                          name: 'Flower', 
                          value: 'flower',
                          preview: '🌸📝🌸',
                          description: 'Floral pattern'
                        },
                        { 
                          name: 'Star', 
                          value: 'star',
                          preview: '⭐📝⭐',
                          description: 'Star decorations'
                        }
                      ].map((style) => (
                        <button
                          key={style.value}
                          onClick={() => setSelectedStyle(style.value)}
                          className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                            selectedStyle === style.value 
                              ? 'border-[#FFB4A2] bg-[#FFB4A2] bg-opacity-20' 
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <div className="text-center">
                            <div className="text-2xl mb-2">{style.preview}</div>
                            <div className="font-medium text-sm text-gray-800">{style.name}</div>
                            <div className="text-xs text-gray-600">{style.description}</div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Affirmation Section */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-3">Add an Affirmation:</label>
                    
                    {/* Custom Affirmation Input */}
                    <div className="mb-4">
                      <textarea
                        value={affirmationText}
                        onChange={(e) => setAffirmationText(e.target.value)}
                        placeholder="Write your own positive affirmation or describe how you're feeling..."
                        className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-[#87C4BB] focus:border-transparent"
                        rows={3}
                      />
                    </div>

                    {/* AI-Generated Affirmation Suggestions */}
                    {showAffirmationSuggestions && generatedAffirmations.length > 0 && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">AI Suggestions:</span>
                            <span className="text-xs text-gray-500">Click to use</span>
                          </div>
                          <button
                            onClick={clearSuggestions}
                            className="text-gray-400 hover:text-gray-600 text-sm"
                          >
                            ✕
                          </button>
                        </div>
                        <div className="space-y-2">
                          {generatedAffirmations.map((affirmation, index) => (
                            <button
                              key={`${debouncedText}-${index}`}
                              onClick={() => selectAffirmation(affirmation)}
                              className="w-full p-3 text-left bg-gradient-to-r from-[#FFB4A2] to-[#FFC4B4] hover:from-[#FF9F8A] hover:to-[#FFB4A2] text-white rounded-lg transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md transform hover:scale-[1.02]"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-lg">✨</span>
                                <span className="flex-1">&quot;{affirmation}&quot;</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        setShowCustomizeNote(false)
                        clearSuggestions()
                      }}
                      className="px-6 py-2 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium rounded-lg transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createStickyNote}
                      className="px-6 py-2 bg-[#87C4BB] hover:bg-[#7AB3A8] text-white font-medium rounded-lg transition-colors duration-200"
                    >
                      Add to Mirror
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticker Selection Popup */}
      {showStickerPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
          <div className="bg-white rounded-lg p-6 max-w-4xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800">Choose Your Stickers</h2>
              <button
                onClick={() => setShowStickerPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>
            
            {/* Upload Section */}
            <div className="mb-6 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
              <div className="text-gray-600 mb-2">
                <svg className="mx-auto h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <label htmlFor="sticker-upload" className="cursor-pointer">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  Upload your own sticker
                </span>
                <input
                  id="sticker-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, or other image formats</p>
            </div>

            {/* Default Stickers */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Default Stickers</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {stickerOptions.map((sticker) => (
                  <div
                    key={sticker.id}
                    onClick={() => {
                      console.log('Clicked sticker option:', sticker)
                      addSticker(sticker)
                    }}
                    className="cursor-pointer hover:scale-105 transition-transform duration-200 text-center flex flex-col items-center justify-center"
                    style={{ width: sticker.width, height: sticker.height }}
                  >
                    <img
                      src={sticker.image}
                      alt={sticker.text}
                      className="w-full h-full object-contain"
                      draggable={false}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Uploaded Stickers */}
            {uploadedStickers.length > 0 && (
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Your Uploaded Stickers</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {uploadedStickers.map((sticker) => (
                    <div
                      key={sticker.id}
                      onClick={() => {
                        console.log('Clicked uploaded sticker:', sticker)
                        addSticker(sticker)
                      }}
                      className="cursor-pointer hover:scale-105 transition-transform duration-200 text-center flex flex-col items-center justify-center border-2 border-green-200 rounded-lg"
                      style={{ width: sticker.width, height: sticker.height }}
                    >
                      <img
                        src={sticker.image}
                        alt={sticker.text}
                        className="w-full h-full object-contain"
                        draggable={false}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  )
}

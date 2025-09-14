"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";

type Sticker = {
  id: string;
  text: string;
  image: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

type StickyNote = {
  id: string;
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  color: string;
  style: string;
  fontSize: number;
  isEditing: boolean;
};

export default function MirrorBoard({ 
  onAddNote, 
  onAddSticker,
  stickers = [],
  stickyNotes = [],
  onRemoveSticker,
  onRemoveStickyNote,
  onUpdateStickyNote,
  videoRef,
  isMirrorOn = false
}: { 
  onAddNote: () => void;
  onAddSticker: () => void;
  stickers?: Sticker[];
  stickyNotes?: StickyNote[];
  onRemoveSticker?: (id: string) => void;
  onRemoveStickyNote?: (id: string) => void;
  onUpdateStickyNote?: (id: string, updates: Partial<StickyNote>) => void;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isMirrorOn?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [isRotating, setIsRotating] = useState(false);
  const [resizeStart, setResizeStart] = useState<{ x: number; y: number; width: number; height: number; noteId: string } | null>(null);
  const [rotateStart, setRotateStart] = useState<{ x: number; y: number; angle: number; noteId: string } | null>(null);
  const [draggedNote, setDraggedNote] = useState<string | null>(null);
  const [dragStart, setDragStart] = useState<{ x: number; y: number; noteX: number; noteY: number } | null>(null);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSliderActive, setIsSliderActive] = useState(false);

  const removeSticker = (id: string) => {
    if (onRemoveSticker) {
      onRemoveSticker(id);
    }
  };

  const removeStickyNote = (id: string) => {
    if (onRemoveStickyNote) {
      onRemoveStickyNote(id);
    }
  };

  // Handle mouse down for dragging
  const handleMouseDown = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const note = stickyNotes.find(n => n.id === noteId);
    if (!note) return;
    
    setDraggedNote(noteId);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      noteX: note.x,
      noteY: note.y
    });
  };

  // Start editing a note
  const startEditing = (noteId: string) => {
    const note = stickyNotes.find(n => n.id === noteId);
    if (note) {
      setEditingNote(noteId);
      setEditingText(note.text === 'Click to edit...' ? '' : note.text);
      if (onUpdateStickyNote) {
        onUpdateStickyNote(noteId, { isEditing: true });
      }
    }
  };

  // Save editing changes
  const saveEditing = (noteId: string) => {
    if (onUpdateStickyNote) {
      onUpdateStickyNote(noteId, {
        text: editingText || 'Click to edit...',
        isEditing: false
      });
    }
    setEditingNote(null);
    setEditingText('');
  };

  // Cancel editing
  const cancelEditing = (noteId: string) => {
    if (onUpdateStickyNote) {
      onUpdateStickyNote(noteId, { isEditing: false });
    }
    setEditingNote(null);
    setEditingText('');
  };

  // Update font size
  const updateFontSize = (noteId: string, newSize: number) => {
    if (onUpdateStickyNote) {
      onUpdateStickyNote(noteId, { fontSize: Math.min(48, Math.max(12, newSize)) });
    }
  };

  // Resize and rotation handlers
  const handleResizeStart = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setDraggedNote(noteId); // Set the dragged note for resize
    
    const note = stickyNotes.find(n => n.id === noteId);
    if (note) {
      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: note.width,
        height: note.height,
        noteId: noteId
      });
    }
  };

  const handleRotateStart = (e: React.MouseEvent, noteId: string) => {
    e.preventDefault();
    e.stopPropagation();
    
    const note = stickyNotes.find(n => n.id === noteId);
    if (!note) return;
    
    setIsRotating(true);
    setDraggedNote(noteId); // Set the dragged note for rotation
    setRotateStart({
      x: e.clientX,
      y: e.clientY,
      angle: note.rotation,
      noteId: noteId
    });
  };

  const handleResizeMove = useCallback((e: React.MouseEvent) => {
    if (isResizing && draggedNote && resizeStart) {
      const deltaX = e.clientX - resizeStart.x;
      const deltaY = e.clientY - resizeStart.y;
      
      const newWidth = Math.max(80, Math.min(300, resizeStart.width + deltaX));
      const newHeight = Math.max(80, Math.min(300, resizeStart.height + deltaY));
      
      if (onUpdateStickyNote) {
        onUpdateStickyNote(draggedNote, {
          width: newWidth,
          height: newHeight
        });
      }
    }
  }, [isResizing, draggedNote, resizeStart, onUpdateStickyNote]);

  const handleRotateMove = useCallback((e: React.MouseEvent) => {
    if (isRotating && draggedNote && rotateStart) {
      const note = stickyNotes.find(n => n.id === draggedNote);
      if (!note) return;

      const deltaX = e.clientX - rotateStart.x;
      const deltaY = e.clientY - rotateStart.y;
      
      // Calculate rotation based on horizontal movement for smoother control
      // Use horizontal movement as the primary rotation input
      const rotationSensitivity = 0.5; // Adjust this value to make rotation more/less sensitive
      const newRotation = rotateStart.angle + (deltaX * rotationSensitivity);
      
      if (onUpdateStickyNote) {
        onUpdateStickyNote(draggedNote, {
          rotation: newRotation
        });
      }
    }
  }, [isRotating, draggedNote, rotateStart, stickyNotes, onUpdateStickyNote]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isResizing) {
      handleResizeMove(e as unknown as React.MouseEvent);
    } else if (isRotating) {
      handleRotateMove(e as unknown as React.MouseEvent);
    } else if (draggedNote && dragStart) {
      // Handle dragging
      const deltaX = e.clientX - dragStart.x;
      const deltaY = e.clientY - dragStart.y;
      
      const newX = dragStart.noteX + deltaX;
      const newY = dragStart.noteY + deltaY;
      
      if (onUpdateStickyNote) {
        onUpdateStickyNote(draggedNote, {
          x: newX,
          y: newY
        });
      }
    }
  }, [isResizing, isRotating, draggedNote, dragStart, handleResizeMove, handleRotateMove, onUpdateStickyNote]);

  const handleMouseUp = useCallback(() => {
    setIsResizing(false);
    setIsRotating(false);
    setDraggedNote(null);
    setDragStart(null);
    setResizeStart(null);
    setRotateStart(null);
  }, []);

  // Add event listeners for mouse events
  useEffect(() => {
    if (isResizing || isRotating || draggedNote) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isResizing, isRotating, draggedNote, resizeStart, rotateStart, handleMouseMove, handleMouseUp]);

  const getStickyNoteStyle = (note: StickyNote) => {
    const baseStyle = {
      backgroundColor: note.color,
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      border: '1px solid rgba(0,0,0,0.1)',
    };

    if (note.style === 'pinned') {
      return {
        ...baseStyle,
        borderTop: '3px solid #ef4444',
      };
    } else if (note.style === 'flower') {
      return {
        ...baseStyle,
        borderTop: '3px solid #fbbf24',
      };
    } else if (note.style === 'star') {
      return {
        ...baseStyle,
        borderTop: '3px solid #f59e0b',
      };
    }

    return baseStyle;
  };

  return (
    <div className="relative mx-auto w-full max-w-5xl">
      {/* Mirror container establishes stacking context & drag bounds */}
      <div
        ref={containerRef}
        className="relative aspect-video w-full rounded-2xl shadow"
        style={{ background: "#111" }}
      >
        {/* Video layer (z-0) */}
        <video
          ref={videoRef}
          className={`absolute inset-0 z-0 h-full w-full rounded-2xl object-cover ${isMirrorOn ? 'block' : 'hidden'}`}
          style={{ pointerEvents: "none", transform: "scaleX(-1)" }}
          muted
          playsInline
          autoPlay
        />
        
        {/* Placeholder when mirror is off */}
        {!isMirrorOn && (
          <div className="absolute inset-0 z-0 flex items-center justify-center" style={{ background: "#f3f4f6" }}>
            <div className="text-center text-amber-700">
              <div className="w-16 h-20 bg-gray-300 rounded-lg mx-auto mb-4 flex items-center justify-center">
                <span className="text-2xl">📷</span>
              </div>
              <p>Click &quot;On&quot; to start mirror</p>
            </div>
          </div>
        )}

        {/* Items layer (z-10) */}
        <div className="absolute inset-0 z-10">
          {/* Sticky Notes */}
          {stickyNotes.map((note) => (
            <div
              key={note.id}
              className={`absolute p-3 transform transition-transform duration-200 flex flex-col group ${
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

              {/* Note content */}
              {note.isEditing ? (
                <div className="flex-1 flex flex-col">
                  <textarea
                    ref={textareaRef}
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    className="w-full flex-1 resize-none bg-transparent border-none outline-none text-sm"
                    style={{ fontSize: note.fontSize }}
                    autoFocus
                    onBlur={() => {
                      // Only save if slider is not active
                      if (!isSliderActive) {
                        saveEditing(note.id);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        saveEditing(note.id)
                      }
                      if (e.key === 'Escape') {
                        cancelEditing(note.id)
                      }
                    }}
                  />
                  
                  {/* Font size slider */}
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-gray-600">A</span>
                    <input
                      type="range"
                      min="12"
                      max="48"
                      value={note.fontSize}
                      onChange={(e) => {
                        e.stopPropagation();
                        updateFontSize(note.id, parseInt(e.target.value));
                      }}
                      onMouseDown={(e) => {
                        e.stopPropagation();
                        setIsSliderActive(true);
                        // Refocus textarea immediately
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.focus();
                          }
                        }, 0);
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation();
                        setIsSliderActive(true);
                        // Refocus textarea immediately
                        setTimeout(() => {
                          if (textareaRef.current) {
                            textareaRef.current.focus();
                          }
                        }, 0);
                      }}
                      onMouseUp={() => {
                        setIsSliderActive(false);
                      }}
                      onTouchEnd={() => {
                        setIsSliderActive(false);
                      }}
                      className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      style={{
                        background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((note.fontSize - 12) / (48 - 12)) * 100}%, #e5e7eb ${((note.fontSize - 12) / (48 - 12)) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                    <span className="text-xs text-gray-600 min-w-[30px] text-center">
                      {note.fontSize}px
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => startEditing(note.id)}
                    style={{ fontSize: note.fontSize }}
                  >
                    {note.text}
                  </div>
                  <div className="text-xs text-gray-500 text-center mt-1 opacity-70">
                    Click to edit
                  </div>
                </div>
              )}

              {/* Resize handle */}
              <div
                className="absolute -bottom-1 -right-1 w-4 h-4 cursor-se-resize opacity-50 hover:opacity-100 transition-opacity"
                style={{
                  background: 'rgba(0,0,0,0.1)',
                  borderRadius: '50%',
                  border: '2px solid rgba(0,0,0,0.3)'
                }}
                onMouseDown={(e) => handleResizeStart(e, note.id)}
              />
              
              {/* Close button */}
              <div
                className="absolute -top-2 -left-2 w-6 h-6 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
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
            </div>
          ))}

          {/* Stickers */}
          {stickers.map(st => (
            <motion.div
              key={st.id}
              drag
              dragConstraints={containerRef}
              dragMomentum={false}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{
                position: "absolute",
                left: st.x,
                top: st.y,
                width: st.width,
                height: st.height,
                rotate: st.rotation ?? 0,
              }}
              className="pointer-events-auto"
            >
              <div className="relative w-full h-full">
                <img
                  src={st.image}
                  alt={st.text}
                  className="w-full h-full object-contain select-none"
                  draggable={false}
                />
                {/* Delete button */}
                <button
                  onClick={(e) => { e.stopPropagation(); removeSticker(st.id); }}
                  className="absolute -right-2 -top-2 rounded-full bg-white/90 px-2 text-xs shadow hover:bg-white"
                >
                  ×
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Toolbar (z-20) - Top Right */}
        <div className="absolute top-4 right-4 z-20 flex gap-2">
          <button
            onClick={onAddNote}
            className="px-3 py-2 bg-white/90 hover:bg-white text-gray-700 font-medium rounded-lg shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm text-sm"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Add custom sticky note</span>
          </button>
          <button
            onClick={onAddSticker}
            className="px-3 py-2 bg-white/90 hover:bg-white text-gray-700 font-medium rounded-lg shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-200 flex items-center gap-2 backdrop-blur-sm text-sm"
          >
            <span className="text-lg">+</span>
            <span className="hidden sm:inline">Add sticker</span>
          </button>
        </div>
      </div>
    </div>
  );
}

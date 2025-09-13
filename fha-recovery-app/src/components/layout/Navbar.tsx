'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Leaf, User, LogOut } from 'lucide-react'

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()

  const isActive = (path: string) => pathname === path

  return (
    <nav className="fixed top-6 inset-x-0 mx-auto max-w-screen-lg z-50">
      <div className="bg-[#F7F7F7] rounded-full shadow-md py-2.5 px-8">
        <div className="flex items-center justify-between">
          {/* App Branding - Left Section */}
          <div className="flex items-center gap-2 mr-auto">
            <Link href="/" className="flex items-center gap-2">
              <Leaf className="text-[#FFB4A2] text-xl" />
              <span className="text-[#333333] font-semibold text-lg">Harmonia</span>
            </Link>
          </div>
          
          {/* Primary Navigation Links - Center Section */}
          <div className="flex items-center gap-x-6">
            <Link 
              href="/bbt-tracker" 
              className={`font-medium px-4 py-1.5 rounded-full transition-colors ${
                isActive('/bbt-tracker')
                  ? 'bg-[#FFB4A2] text-white'
                  : 'text-[#666666] hover:text-[#FFB4A2]'
              }`}
            >
              BBT Tracker
            </Link>
            <Link 
              href="/nourish-thrive" 
              className={`font-medium px-4 py-1.5 rounded-full transition-colors ${
                isActive('/nourish-thrive')
                  ? 'bg-[#FFB4A2] text-white'
                  : 'text-[#666666] hover:text-[#FFB4A2]'
              }`}
            >
              Nourish & Thrive
            </Link>
            <Link 
              href="/self-love-space" 
              className={`font-medium px-4 py-1.5 rounded-full transition-colors ${
                isActive('/self-love-space')
                  ? 'bg-[#FFB4A2] text-white'
                  : 'text-[#666666] hover:text-[#FFB4A2]'
              }`}
            >
              Self-Love Space
            </Link>
          </div>
          
          {/* User Account Section - Right Section */}
          <div className="ml-auto flex items-center gap-3">
            {session ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#656262]">
                  {session.user?.name || session.user?.email}
                </span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center gap-1 text-[#666666] hover:text-[#FFB4A2] transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1 text-[#666666] hover:text-[#FFB4A2] transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-sm">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

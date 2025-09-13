'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Leaf, Lock } from 'lucide-react'
import Link from 'next/link'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Show loading state while session is being fetched
  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <Leaf className="w-8 h-8 text-[#FFB4A2] mx-auto animate-pulse" />
          <p className="text-[#666666]">Loading...</p>
        </div>
      </div>
    )
  }

  // If user is not authenticated, show login prompt
  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg text-center">
          <div className="space-y-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Lock className="w-6 h-6 text-[#FFB4A2]" />
              <Leaf className="w-6 h-6 text-[#FFB4A2]" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-800">Access Required</h1>
              <p className="text-[#666666]">
                Please sign in to access your personal healing journey
              </p>
            </div>

            <div className="space-y-3">
              <Link href="/login">
                <Button className="w-full bg-[#FFB4A2] hover:bg-[#FF9F8A] text-white">
                  Sign In
                </Button>
              </Link>
              
              <div className="text-sm text-[#666666]">
                Don't have an account?{' '}
                <Link href="/signup" className="text-[#FFB4A2] hover:text-[#FF9F8A] font-medium">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  // If user is authenticated, render the protected content
  return <>{children}</>
}

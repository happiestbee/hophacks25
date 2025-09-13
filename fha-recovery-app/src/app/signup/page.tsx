'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Leaf } from 'lucide-react'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    // For demo purposes, redirect to main app
    window.location.href = '/'
  }

  const handleGoogleSignup = () => {
    signIn('google', { callbackUrl: '/' })
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        {/* Header with logo and title */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Leaf className="w-6 h-6 text-teal-500" />
            <h1 className="text-2xl font-semibold text-gray-800">Create Account</h1>
          </div>
          <p className="text-sm text-gray-500">Join Harmonia to start your journey</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSignup} className="space-y-6">
          {/* Email Input */}
          <div>
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>

          {/* Confirm Password Input */}
          <div>
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
              className="w-full h-12 px-4 bg-gray-50 border-0 rounded-xl text-gray-700 placeholder-gray-400 focus:bg-white focus:ring-2 focus:ring-teal-200"
              required
            />
          </div>

          {/* Signup Button */}
          <Button
            type="submit"
            className="w-full h-12 bg-teal-500 hover:bg-teal-600 text-white font-medium rounded-xl transition-colors"
          >
            Create Account
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Google Signup Button */}
        <Button
          onClick={handleGoogleSignup}
          variant="outline"
          className="w-full h-12 border-gray-200 hover:bg-gray-50 text-gray-600 font-medium rounded-xl transition-colors"
        >
          <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Continue with Google
        </Button>

        {/* Footer Links */}
        <div className="text-center mt-6">
          <p className="text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-teal-500 hover:text-teal-600 font-medium">
              Sign In
            </Link>
          </p>
        </div>
      </Card>
    </div>
  )
}

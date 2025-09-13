import React from 'react'
import { Card } from '@/components/ui/card'

interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export default function PageLayout({ children, className = '' }: PageLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7F7F7] pt-24 pb-8">
      <div className="container mx-auto px-4 max-w-screen-lg">
        <Card className={`bg-white shadow-sm border-0 p-6 md:p-8 ${className}`}>
          {children}
        </Card>
      </div>
    </div>
  )
}

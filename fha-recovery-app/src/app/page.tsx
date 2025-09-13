import { Button } from '@/components/ui/button'
import PageLayout from '@/components/layout/PageLayout'
import { Card } from '@/components/ui/card'

export default function Home() {
  return (
    <PageLayout>
      <div className="text-center space-y-8">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl font-bold text-[#333333] leading-tight">
            Welcome to Your
            <span className="block text-[#FFB4A2]">Self-Love Journey</span>
          </h1>
          
          <p className="text-xl text-[#666666] leading-relaxed max-w-lg mx-auto">
            A gentle, supportive space for your FHA recovery journey. 
            Track, learn, and thrive with compassion.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <Button 
            size="lg" 
            className="bg-[#FFB4A2] hover:bg-[#FF9F8A] text-white px-8 py-4 text-lg font-medium rounded-lg shadow-sm transition-all duration-200 hover:shadow-md hover:scale-105"
          >
            Begin Your Journey
          </Button>
          
          <p className="text-sm text-[#666666]">
            Start with gentle tracking and supportive guidance
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-[#FFB4A2] rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">🌡️</span>
            </div>
            <h3 className="font-semibold text-[#333333] mb-2">Gentle Tracking</h3>
            <p className="text-sm text-[#666666]">Monitor your health with compassion</p>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-[#FFC4B4] rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">💝</span>
            </div>
            <h3 className="font-semibold text-[#333333] mb-2">Self-Love Space</h3>
            <p className="text-sm text-[#666666]">Your personal affirmation board</p>
          </Card>
          
          <Card className="p-6 hover:shadow-md transition-shadow duration-200">
            <div className="w-12 h-12 bg-[#FFD4C4] rounded-lg flex items-center justify-center mb-4 mx-auto">
              <span className="text-white text-xl">🍽️</span>
            </div>
            <h3 className="font-semibold text-[#333333] mb-2">Nourish & Thrive</h3>
            <p className="text-sm text-[#666666]">Gentle nutrition guidance</p>
          </Card>
        </div>
      </div>
    </PageLayout>
  )
}

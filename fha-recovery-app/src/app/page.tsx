import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="hero-gradient flex min-h-screen items-center justify-center p-8">
      <div className="mx-auto max-w-2xl space-y-8 text-center">
        {/* Hero Section */}
        <div className="space-y-6">
          <h1 className="text-5xl leading-tight font-bold text-[#333333]">
            Welcome to Your
            <span className="block text-[#87C4BB]">Self-Love Journey</span>
          </h1>

          <p className="mx-auto max-w-lg text-xl leading-relaxed text-[#666666]">
            A gentle, supportive space for your FHA recovery journey. Track,
            learn, and thrive with compassion.
          </p>
        </div>

        {/* CTA Section */}
        <div className="space-y-4">
          <Button
            size="lg"
            className="rounded-lg bg-[#87C4BB] px-8 py-4 text-lg font-medium text-white shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#7AB3A8] hover:shadow-md"
          >
            Begin Your Journey
          </Button>

          <p className="text-sm text-[#666666]">
            Start with gentle tracking and supportive guidance
          </p>
        </div>

        {/* Feature Preview Cards */}
        <div className="mt-16 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="card-hover rounded-lg border border-[#E5E5E5] bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#87C4BB]">
              <span className="text-xl text-white">🌡️</span>
            </div>
            <h3 className="mb-2 font-semibold text-[#333333]">
              Gentle Tracking
            </h3>
            <p className="text-sm text-[#666666]">
              Monitor your health with compassion
            </p>
          </div>

          <div className="card-hover rounded-lg border border-[#E5E5E5] bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#FFB4A2]">
              <span className="text-xl text-white">💝</span>
            </div>
            <h3 className="mb-2 font-semibold text-[#333333]">
              Self-Love Space
            </h3>
            <p className="text-sm text-[#666666]">
              Your personal affirmation board
            </p>
          </div>

          <div className="card-hover rounded-lg border border-[#E5E5E5] bg-white p-6 shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-[#C1A7E1]">
              <span className="text-xl text-white">🍽️</span>
            </div>
            <h3 className="mb-2 font-semibold text-[#333333]">
              Nourish & Thrive
            </h3>
            <p className="text-sm text-[#666666]">Gentle nutrition guidance</p>
          </div>
        </div>
      </div>
    </div>
  )
}

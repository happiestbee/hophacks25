import PageLayout from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function SelfLoveSpace() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#333333]">Self-Love Space</h1>
          <p className="text-[#666666]">Your personal mirror and affirmation board</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">Daily Affirmation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-gradient-to-br from-[#FFD4C4] to-[#FFB4A2] p-6 rounded-lg text-white text-center">
                <p className="text-lg font-medium mb-4">
                  "I am worthy of love, care, and healing. My body is wise and deserves nourishment."
                </p>
              </div>
              <Button className="w-full bg-[#FFB4A2] hover:bg-[#FF9F8A] text-white">
                Make this my wallpaper
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full border-[#FFB4A2] text-[#FFB4A2] hover:bg-[#FFB4A2] hover:text-white">
                + Add New Affirmation
              </Button>
              <Button variant="outline" className="w-full border-[#FFC4B4] text-[#FFC4B4] hover:bg-[#FFC4B4] hover:text-white">
                View My Collection
              </Button>
              <Button variant="outline" className="w-full border-[#FFD4C4] text-[#FFD4C4] hover:bg-[#FFD4C4] hover:text-white">
                Share with Community
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#333333]">Corkboard Canvas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="min-h-96 bg-gradient-to-br from-amber-50 to-orange-50 rounded-lg p-6 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center space-y-4">
                  <div className="w-32 h-40 bg-gray-200 rounded-lg mx-auto flex items-center justify-center">
                    <span className="text-gray-400 text-sm">User Silhouette</span>
                  </div>
                  <p className="text-[#666666]">Interactive sticky notes will appear here</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

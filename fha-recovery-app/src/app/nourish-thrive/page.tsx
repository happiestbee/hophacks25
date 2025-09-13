import PageLayout from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function NourishThrive() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#333333]">Nourish & Thrive</h1>
          <p className="text-[#666666]">Gentle nutrition guidance for your recovery journey</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">Fuel Meter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#666666]">Energy Level</span>
                  <span className="text-[#FFB4A2] font-medium">Optimal</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-[#FFB4A2] h-3 rounded-full" style={{ width: '75%' }}></div>
                </div>
              </div>
              <p className="text-sm text-[#666666] text-center">
                You're fueling your body beautifully today! 💚
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">AI Meal Inspiration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-[#666666]">
                Based on your recovery needs, here's a nourishing suggestion:
              </p>
              <div className="bg-[#F7F7F7] p-4 rounded-lg">
                <h4 className="font-medium text-[#333333] mb-2">Recovery Bowl</h4>
                <p className="text-sm text-[#666666]">Quinoa, roasted vegetables, avocado, and tahini dressing</p>
              </div>
              <Button className="w-full bg-[#FFB4A2] hover:bg-[#FF9F8A] text-white">
                GET ME THIS RECIPE
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#333333]">Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button variant="outline" className="w-full border-dashed border-[#FFB4A2] text-[#FFB4A2] hover:bg-[#FFB4A2] hover:text-white">
                + Log Today's Meals
              </Button>
              <div className="text-center text-[#666666] py-8">
                <p>No meals logged yet today</p>
                <p className="text-sm mt-2">Start by adding your first meal above</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

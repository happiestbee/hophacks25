import PageLayout from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function BBTTracker() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#333333]">BBT Tracker</h1>
          <p className="text-[#666666]">Monitor your basal body temperature with gentle tracking</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">Log Today's BBT</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#666666]">Temperature (°F)</label>
                <input 
                  type="number" 
                  step="0.1" 
                  placeholder="98.6" 
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB4A2]"
                />
              </div>
              <Button className="w-full bg-[#FFB4A2] hover:bg-[#FF9F8A]">
                Confirm Entry
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[#333333]">Your Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between">
                <span className="text-[#666666]">Avg. Cycle Length:</span>
                <span className="font-medium text-[#333333]">-- Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Longest Luteal Phase:</span>
                <span className="font-medium text-[#333333]">10 Days</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#666666]">Current Streak:</span>
                <span className="font-medium text-[#FFB4A2]">5 Days</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#333333]">BBT Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
              <p className="text-[#666666]">Chart visualization will be implemented here</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

import PageLayout from '@/components/layout/PageLayout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function LearnMore() {
  return (
    <PageLayout>
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-[#333333]">Learn More</h1>
          <p className="text-[#666666]">Discover resources and information for your healing journey</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-[#333333]">Coming Soon</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[#666666]">
              This page will contain educational resources, articles, and helpful information 
              about Functional Hypothalamic Amenorrhea recovery. Check back soon for updates!
            </p>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  )
}

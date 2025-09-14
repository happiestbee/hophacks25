'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import PageLayout from '@/components/layout/PageLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { ResponsiveLine } from '@nivo/line'
import { ResponsiveBar } from '@nivo/bar'
import { RecoveryOutlookEmoji } from '@/components/ui/recovery-outlook-emoji'
import { Plus } from 'lucide-react'


// Period recovery prediction interfaces
interface PeriodPrediction {
  user_id: string;
  prediction_date: string;
  days_since_last_period: number;
  hrv_average: number;
  mean_cycle_duration: number;
  probability_distribution: number[];
  peak_probability_day: number;
  peak_probability_value: number;
  cumulative_30_day_probability: number;
  cumulative_60_day_probability: number;
  cumulative_90_day_probability: number;
}

export default function InsightPage() {
  const { data: session } = useSession()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [temperatureData, setTemperatureData] = useState([{
    id: 'BBT',
    data: []
  }])
  const [formData, setFormData] = useState({
    bodyTemperature: '',
    heartRateVariability: '',
    caloriesExpended: '',
    caloriesIntake: ''
  })
  const [periodPrediction, setPeriodPrediction] = useState<PeriodPrediction | null>(null)
  const [predictionLoading, setPredictionLoading] = useState(false)
  const [lstmPrediction, setLstmPrediction] = useState<any>(null)
  const [lstmLoading, setLstmLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const fetchPeriodPrediction = async () => {
    if (!session?.user?.email) return
    
    setPredictionLoading(true)
    try {
      const response = await fetch(`http://localhost:8001/api/period-prediction/predict-from-data?user_id=${encodeURIComponent(session.user.email)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (response.ok) {
        const data = await response.json()
        setPeriodPrediction(data)
      } else {
        console.error('Failed to fetch period prediction:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching period prediction:', error)
    } finally {
      setPredictionLoading(false)
    }
  }

  const fetchLSTMPrediction = async () => {
    if (!session?.user?.email) return
    
    setLstmLoading(true)
    try {
      const response = await fetch('http://localhost:8001/api/lstm-prediction/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: session.user.email
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setLstmPrediction(data)
      } else {
        console.error('Failed to fetch LSTM prediction:', response.statusText)
      }
    } catch (error) {
      console.error('Error fetching LSTM prediction:', error)
    } finally {
      setLstmLoading(false)
    }
  }

  const fetchTemperatureData = async () => {
    if (!session?.user?.email) return
    
    try {
      const endDate = new Date().toISOString().split('T')[0]
      const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      const userId = session.user.email
      const response = await fetch(`http://localhost:8001/api/daily-tracking/?user_id=${encodeURIComponent(userId)}&start_date=${startDate}&end_date=${endDate}`)
      
      if (response.ok) {
        const data = await response.json()
        const chartData = data
          .filter((entry: any) => entry.body_temperature)
          .map((entry: any) => ({
            x: entry.tracking_date,
            y: entry.body_temperature
          }))
          .sort((a: any, b: any) => new Date(a.x).getTime() - new Date(b.x).getTime())
        
        setTemperatureData([{
          id: 'BBT',
          data: chartData
        }])
      }
    } catch (error) {
      console.error('Error fetching temperature data:', error)
    }
  }

  useEffect(() => {
    fetchTemperatureData()
    fetchPeriodPrediction()
    fetchLSTMPrediction()
  }, [session])

  // Transform prediction data for CDF chart
  const chartData = periodPrediction ? 
    periodPrediction.probability_distribution.map((prob, index) => {
      // Calculate cumulative probability up to this day
      const cumulativeProb = periodPrediction.probability_distribution
        .slice(0, index + 1)
        .reduce((sum, p) => sum + p, 0)
      
      return {
        day: index + 1,
        probability: cumulativeProb * 100, // Convert to percentage
        color: index < 60 ? '#FFB4A2' : index < 120 ? '#C1A7E1' : '#87C4BB'
      }
    }) : []

  // Add invisible padding data point to extend y-axis
  const paddedChartData = chartData.length > 0 ? [
    ...chartData,
    {
      day: 181, // Outside visible range
      probability: Math.max(...chartData.map(d => d.probability)) * 1.4, // 40% higher than max
      color: 'transparent'
    }
  ] : []

  const handleSubmit = async () => {
    if (!session?.user?.email) return
    
    try {
      const today = new Date().toISOString().split('T')[0]
      const userId = session.user.email
      
      // Debug: Log form data
      console.log('Form data before processing:', formData)
      
      // Calculate calorie deficit (expenditure - intake)
      const calorieDeficit = formData.caloriesExpended && formData.caloriesIntake 
        ? parseInt(formData.caloriesExpended) - parseInt(formData.caloriesIntake)
        : null

      const requestBody = {
        ...(formData.bodyTemperature && { body_temperature: parseFloat(formData.bodyTemperature) }),
        ...(formData.heartRateVariability && { heart_rate_variability: parseFloat(formData.heartRateVariability) }),
        ...(calorieDeficit !== null && { calorie_deficit: calorieDeficit }),
      }
      
      // Debug: Log processed request body
      console.log('Request body being sent:', requestBody)
      console.log('API URL:', `http://localhost:8001/api/daily-tracking/date/${today}/health-metrics?user_id=${encodeURIComponent(userId)}`)
      
      const response = await fetch(`http://localhost:8001/api/daily-tracking/date/${today}/health-metrics?user_id=${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      })

      if (response.ok) {
        console.log('Health metrics saved successfully')
        setIsModalOpen(false)
        setFormData({ bodyTemperature: '', heartRateVariability: '', caloriesExpended: '', caloriesIntake: '' })
        fetchTemperatureData() // Refresh the temperature graph data
      } else {
        const errorText = await response.text()
        console.error('Failed to save health metrics. Status:', response.status)
        console.error('Error response:', errorText)
      }
    } catch (error) {
      console.error('Error saving health metrics:', error)
    }
  }

  return (
    <ProtectedRoute>
      <PageLayout>
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#333333]">Insights</h1>
            <p className="text-[#666666]">Track your body's natural rhythms with gentle awareness</p>
          </div>

          {/* BBT Temperature Graph */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-[#333333]">Body Temperature Trends</CardTitle>
              <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="bg-[#87C4BB] hover:bg-[#7AB5AC]">
                    <Plus className="h-4 w-4 mr-2" />
                    Log Data
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-[#333333]">Daily Health Metrics</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="temperature" className="text-[#666666]">Body Temperature (°F)</Label>
                      <Input
                        id="temperature"
                        type="number"
                        step="0.1"
                        placeholder="98.6"
                        value={formData.bodyTemperature}
                        onChange={(e) => handleInputChange('bodyTemperature', e.target.value)}
                        className="focus:ring-[#87C4BB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hrv" className="text-[#666666]">Heart Rate Variability (ms)</Label>
                      <Input
                        id="hrv"
                        type="number"
                        placeholder="45"
                        value={formData.heartRateVariability}
                        onChange={(e) => handleInputChange('heartRateVariability', e.target.value)}
                        className="focus:ring-[#87C4BB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calories-expended" className="text-[#666666]">Calories Expended</Label>
                      <Input
                        id="calories-expended"
                        type="number"
                        placeholder="2200"
                        value={formData.caloriesExpended}
                        onChange={(e) => handleInputChange('caloriesExpended', e.target.value)}
                        className="focus:ring-[#87C4BB]"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="calories-intake" className="text-[#666666]">Calories Intake</Label>
                      <Input
                        id="calories-intake"
                        type="number"
                        placeholder="1800"
                        value={formData.caloriesIntake}
                        onChange={(e) => handleInputChange('caloriesIntake', e.target.value)}
                        className="focus:ring-[#87C4BB]"
                      />
                    </div>
                    <Button 
                      onClick={handleSubmit} 
                      className="w-full bg-[#87C4BB] hover:bg-[#7AB5AC]"
                    >
                      Save Metrics
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveLine
                  data={temperatureData}
                  margin={{ top: 20, right: 20, bottom: 60, left: 60 }}
                  xScale={{ type: 'time', format: '%Y-%m-%d', useUTC: false }}
                  xFormat="time:%Y-%m-%d"
                  yScale={{ type: 'linear', min: 96.5, max: 99 }}
                  axisLeft={{
                    legend: 'Temperature (°F)',
                    legendOffset: -40,
                    legendPosition: 'middle'
                  }}
                  axisBottom={{
                    format: '%m/%d',
                    legend: 'Date',
                    legendOffset: 40,
                    legendPosition: 'middle'
                  }}
                  colors={['#87C4BB']}
                  pointSize={6}
                  pointColor="#87C4BB"
                  pointBorderWidth={2}
                  pointBorderColor="#ffffff"
                  enableGridX={false}
                  enableGridY={true}
                  curve="monotoneX"
                  lineWidth={3}
                  animate={true}
                  motionConfig="gentle"
                />
              </div>
            </CardContent>
          </Card>

          {/* Period Recovery Prediction */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-[#333333]">Period Recovery Prediction</CardTitle>
                {periodPrediction && (
                  <div className="text-sm text-[#666666]">
                    Based on {periodPrediction.days_since_last_period} days since last period
                  </div>
                )}
              </div>
              {periodPrediction && (
                <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
                  <div className="bg-[#FFB4A2]/10 p-3 rounded-lg">
                    <div className="text-[#666666]">30-day probability</div>
                    <div className="text-lg font-semibold text-[#333333]">
                      {(periodPrediction.cumulative_30_day_probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-[#C1A7E1]/10 p-3 rounded-lg">
                    <div className="text-[#666666]">60-day probability</div>
                    <div className="text-lg font-semibold text-[#333333]">
                      {(periodPrediction.cumulative_60_day_probability * 100).toFixed(1)}%
                    </div>
                  </div>
                  <div className="bg-[#87C4BB]/10 p-3 rounded-lg">
                    <div className="text-[#666666]">Peak day</div>
                    <div className="text-lg font-semibold text-[#333333]">
                      Day {periodPrediction.peak_probability_day}
                    </div>
                  </div>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {predictionLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-[#666666]">Loading prediction...</div>
                  </div>
                ) : paddedChartData.length > 0 ? (
                  <ResponsiveBar
                    data={paddedChartData}
                    keys={['probability']}
                    indexBy="day"
                    margin={{ top: 50, right: 30, bottom: 60, left: 70 }}
                    padding={0.1}
                    colors={(d: any) => d.data.color}
                    axisLeft={{
                      legend: 'Cumulative Recovery Probability (%)',
                      legendOffset: -50,
                      legendPosition: 'middle',
                      format: (value) => `${value.toFixed(1)}%`,
                      tickSize: 5,
                      tickPadding: 5,
                      tickRotation: 0
                    }}
                    axisBottom={{
                      legend: 'Days from Today',
                      legendOffset: 40,
                      legendPosition: 'middle',
                      tickValues: [1, 30, 60, 90, 120, 150, 180],
                    }}
                    enableGridY={true}
                    enableGridX={false}
                    enableLabel={false}
                    animate={true}
                    motionConfig="gentle"
                    tooltip={({ data }) => (
                      <div className="bg-white p-2 shadow-lg rounded border">
                        <strong>Day {data.day}</strong><br/>
                        Cumulative Probability: {data.probability.toFixed(1)}%
                      </div>
                    )}
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <div className="text-center text-[#666666]">
                      <p>No prediction data available</p>
                      <p className="text-sm mt-1">Please ensure you have recent HRV data</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Encouraging Words Section */}
          <Card className="bg-gradient-to-r from-[#F7F7F7] to-[#87C4BB]/10">
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <h3 className="text-xl font-semibold text-[#333333]">Your Journey Matters</h3>
                <p className="text-[#666666] max-w-2xl mx-auto">
                  Every data point you track is a step toward understanding your body's unique rhythm. 
                  Trust in your body's wisdom and celebrate the small victories along the way. 
                  You're doing beautifully, and your commitment to gentle self-care is inspiring.
                </p>
                
                {/* Recovery Outlook */}
                <div className="flex justify-center mb-4">
                  <RecoveryOutlookEmoji
                    probability={lstmPrediction?.recovery_probability || 0}
                    confidenceLevel={lstmPrediction?.confidence_level || 'loading'}
                    isLoading={lstmLoading}
                  />
                </div>
                
                <div className="flex justify-center">
                  <div className="inline-flex items-center space-x-2 bg-white/50 rounded-full px-4 py-2">
                    <span className="text-2xl">🌸</span>
                    <span className="text-[#87C4BB] font-medium">Keep nurturing yourself</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    </ProtectedRoute>
  )
}

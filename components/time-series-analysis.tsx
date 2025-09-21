"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  BarChart3,
  Activity,
  Zap,
  Download,
  RefreshCw,
  Play,
  Pause,
  Target,
  Brain,
  Thermometer,
  Droplets,
  Wind,
  TreePine,
  Factory,
  Fish,
} from "lucide-react"

interface TimeSeriesData {
  date: string
  temperature: number
  humidity: number
  airQuality: number
  deforestation: number
  carbonEmission: number
  waterQuality: number
  biodiversity: number
  safetyScore: number
  prediction?: boolean
  confidence?: number
}

interface TrendAnalysis {
  metric: string
  direction: "increasing" | "decreasing" | "stable"
  rate: number
  acceleration: number
  volatility: number
  confidence: number
  criticalPeriods: Array<{ date: string; severity: string; reason: string }>
}

interface SeasonalPattern {
  metric: string
  amplitude: number
  phase: number
  strength: number
  peakMonth: number
}

const METRICS = [
  { key: "temperature", name: "Temperature", unit: "°C", icon: Thermometer, color: "#ff6b6b" },
  { key: "humidity", name: "Humidity", unit: "%", icon: Droplets, color: "#4dabf7" },
  { key: "airQuality", name: "Air Quality", unit: "AQI", icon: Wind, color: "#51cf66" },
  { key: "deforestation", name: "Deforestation", unit: "%", icon: TreePine, color: "#ff8787" },
  { key: "carbonEmission", name: "Carbon Emission", unit: "ppm", icon: Factory, color: "#ffd43b" },
  { key: "waterQuality", name: "Water Quality", unit: "%", icon: Fish, color: "#74c0fc" },
  { key: "biodiversity", name: "Biodiversity", unit: "%", icon: Activity, color: "#69db7c" },
  { key: "safetyScore", name: "Safety Score", unit: "", icon: Target, color: "#9775fa" },
]

export default function TimeSeriesAnalysis({ countryCode }: { countryCode?: string }) {
  const [timeSeriesData, setTimeSeriesData] = useState<TimeSeriesData[]>([])
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis[]>([])
  const [seasonalPatterns, setSeasonalPatterns] = useState<SeasonalPattern[]>([])
  const [loading, setLoading] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState("temperature")
  const [timeRange, setTimeRange] = useState("12") // months
  const [predictionHorizon, setPredictionHorizon] = useState("6") // months
  const [showPredictions, setShowPredictions] = useState(true)
  const [showConfidenceInterval, setShowConfidenceInterval] = useState(true)
  const [showSeasonalDecomposition, setShowSeasonalDecomposition] = useState(false)
  const [analysisMode, setAnalysisMode] = useState("trend") // trend, seasonal, anomaly, forecast
  const [isRealTime, setIsRealTime] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  useEffect(() => {
    generateTimeSeriesData()
  }, [countryCode, timeRange, predictionHorizon])

  useEffect(() => {
    if (autoRefresh && isRealTime) {
      const interval = setInterval(() => {
        generateTimeSeriesData()
      }, 30000) // Refresh every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh, isRealTime])

  const generateTimeSeriesData = async () => {
    setLoading(true)
    console.log(" Generating time series data for analysis")

    try {
      // Simulate API call for historical and predicted data
      const historicalData = generateHistoricalData(Number.parseInt(timeRange))
      const predictionData = generatePredictionData(Number.parseInt(predictionHorizon))

      const combinedData = [...historicalData, ...predictionData]
      setTimeSeriesData(combinedData)

      // Generate trend analysis
      const trends = analyzeTrends(historicalData)
      setTrendAnalysis(trends)

      // Generate seasonal patterns
      const patterns = analyzeSeasonalPatterns(historicalData)
      setSeasonalPatterns(patterns)
    } catch (error) {
      console.error(" Error generating time series data:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateHistoricalData = (months: number): TimeSeriesData[] => {
    const data: TimeSeriesData[] = []
    const now = new Date()

    for (let i = months; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1)

      // Generate realistic time series with trends and seasonality
      const monthIndex = date.getMonth()
      const yearProgress = i / months

      // Base values with country-specific adjustments
      const baseTemp = 20 + Math.sin((monthIndex / 12) * 2 * Math.PI) * 10
      const baseHumidity = 60 + Math.sin((monthIndex / 12) * 2 * Math.PI + Math.PI / 2) * 20

      // Add trends and noise
      const tempTrend = yearProgress * 2 // Warming trend
      const pollutionTrend = yearProgress * 15 // Increasing pollution
      const deforestationTrend = yearProgress * 5 // Increasing deforestation

      data.push({
        date: date.toISOString().split("T")[0],
        temperature: baseTemp + tempTrend + (Math.random() - 0.5) * 3,
        humidity: Math.max(0, Math.min(100, baseHumidity + (Math.random() - 0.5) * 15)),
        airQuality: Math.max(0, 80 + pollutionTrend + (Math.random() - 0.5) * 30),
        deforestation: Math.max(0, Math.min(100, 15 + deforestationTrend + (Math.random() - 0.5) * 5)),
        carbonEmission: Math.max(0, 50 + yearProgress * 10 + (Math.random() - 0.5) * 8),
        waterQuality: Math.max(0, Math.min(100, 75 - yearProgress * 8 + (Math.random() - 0.5) * 12)),
        biodiversity: Math.max(0, Math.min(100, 70 - yearProgress * 6 + (Math.random() - 0.5) * 10)),
        safetyScore: Math.max(0, Math.min(100, 75 - yearProgress * 12 + (Math.random() - 0.5) * 15)),
        prediction: false,
      })
    }

    return data
  }

  const generatePredictionData = (months: number): TimeSeriesData[] => {
    const data: TimeSeriesData[] = []
    const now = new Date()
    const lastHistorical = timeSeriesData[timeSeriesData.length - 1] || {
      temperature: 25,
      humidity: 60,
      airQuality: 100,
      deforestation: 20,
      carbonEmission: 60,
      waterQuality: 65,
      biodiversity: 60,
      safetyScore: 65,
    }

    for (let i = 1; i <= months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
      const confidence = Math.max(0.3, 0.9 - i * 0.08) // Decreasing confidence

      // Apply AI prediction logic with uncertainty
      const uncertainty = (1 - confidence) * 20

      data.push({
        date: date.toISOString().split("T")[0],
        temperature: lastHistorical.temperature + i * 0.1 + (Math.random() - 0.5) * uncertainty,
        humidity: Math.max(0, Math.min(100, lastHistorical.humidity + (Math.random() - 0.5) * uncertainty)),
        airQuality: Math.max(0, lastHistorical.airQuality + i * 2 + (Math.random() - 0.5) * uncertainty),
        deforestation: Math.max(
          0,
          Math.min(100, lastHistorical.deforestation + i * 0.3 + (Math.random() - 0.5) * uncertainty),
        ),
        carbonEmission: Math.max(0, lastHistorical.carbonEmission + i * 0.5 + (Math.random() - 0.5) * uncertainty),
        waterQuality: Math.max(
          0,
          Math.min(100, lastHistorical.waterQuality - i * 0.2 + (Math.random() - 0.5) * uncertainty),
        ),
        biodiversity: Math.max(
          0,
          Math.min(100, lastHistorical.biodiversity - i * 0.15 + (Math.random() - 0.5) * uncertainty),
        ),
        safetyScore: Math.max(
          0,
          Math.min(100, lastHistorical.safetyScore - i * 0.8 + (Math.random() - 0.5) * uncertainty),
        ),
        prediction: true,
        confidence: confidence,
      })
    }

    return data
  }

  const analyzeTrends = (data: TimeSeriesData[]): TrendAnalysis[] => {
    const trends: TrendAnalysis[] = []

    METRICS.forEach((metric) => {
      const values = data.map((d) => d[metric.key as keyof TimeSeriesData] as number)
      const x = data.map((_, i) => i)

      // Calculate linear trend
      const n = values.length
      const sumX = x.reduce((a, b) => a + b, 0)
      const sumY = values.reduce((a, b) => a + b, 0)
      const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
      const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

      const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
      const intercept = (sumY - slope * sumX) / n

      // Calculate R-squared
      const yMean = sumY / n
      const ssRes = values.reduce((sum, yi, i) => {
        const predicted = slope * i + intercept
        return sum + Math.pow(yi - predicted, 2)
      }, 0)
      const ssTot = values.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
      const rSquared = 1 - ssRes / ssTot

      // Calculate volatility
      const volatility = Math.sqrt(
        values.reduce((sum, val) => {
          const diff = val - yMean
          return sum + diff * diff
        }, 0) / n,
      )

      // Determine direction
      let direction: "increasing" | "decreasing" | "stable" = "stable"
      if (Math.abs(slope) > 0.1) {
        direction = slope > 0 ? "increasing" : "decreasing"
      }

      // Find critical periods
      const criticalPeriods = data
        .map((d, i) => ({
          date: d.date,
          value: d[metric.key as keyof TimeSeriesData] as number,
          index: i,
        }))
        .filter((d) => {
          if (metric.key === "safetyScore") return d.value < 40
          if (metric.key === "airQuality") return d.value > 150
          if (metric.key === "temperature") return d.value > 35
          if (metric.key === "deforestation") return d.value > 30
          return false
        })
        .map((d) => ({
          date: d.date,
          severity: d.value < 30 || d.value > 200 ? "critical" : "high",
          reason: `${metric.name} reached ${d.value.toFixed(1)}${metric.unit}`,
        }))

      trends.push({
        metric: metric.key,
        direction,
        rate: slope,
        acceleration: 0, // Simplified - would need second derivative
        volatility,
        confidence: Math.max(0.3, rSquared),
        criticalPeriods,
      })
    })

    return trends
  }

  const analyzeSeasonalPatterns = (data: TimeSeriesData[]): SeasonalPattern[] => {
    const patterns: SeasonalPattern[] = []

    METRICS.forEach((metric) => {
      const values = data.map((d) => d[metric.key as keyof TimeSeriesData] as number)
      const months = data.map((d) => new Date(d.date).getMonth())

      // Calculate monthly averages
      const monthlyAvgs = Array(12)
        .fill(0)
        .map((_, month) => {
          const monthValues = values.filter((_, i) => months[i] === month)
          return monthValues.length > 0 ? monthValues.reduce((a, b) => a + b, 0) / monthValues.length : 0
        })

      const overallAvg = values.reduce((a, b) => a + b, 0) / values.length
      const deviations = monthlyAvgs.map((avg) => avg - overallAvg)
      const amplitude = Math.max(...deviations) - Math.min(...deviations)
      const peakMonth = deviations.indexOf(Math.max(...deviations))

      // Calculate seasonal strength
      const seasonalVariance = deviations.reduce((sum, dev) => sum + dev * dev, 0) / 12
      const totalVariance = values.reduce((sum, val) => sum + Math.pow(val - overallAvg, 2), 0) / values.length
      const strength = Math.min(1, seasonalVariance / totalVariance)

      patterns.push({
        metric: metric.key,
        amplitude,
        phase: peakMonth,
        strength,
        peakMonth,
      })
    })

    return patterns
  }

  const downloadAnalysis = () => {
    const analysisData = {
      timeSeriesData,
      trendAnalysis,
      seasonalPatterns,
      metadata: {
        countryCode,
        timeRange,
        predictionHorizon,
        generatedAt: new Date().toISOString(),
        analysisMode,
      },
    }

    const dataStr = JSON.stringify(analysisData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement("a")
    link.href = url
    link.download = `time_series_analysis_${countryCode || "global"}_${new Date().toISOString().split("T")[0]}.json`
    link.click()
    URL.revokeObjectURL(url)
  }

  const getMetricIcon = (metricKey: string) => {
    const metric = METRICS.find((m) => m.key === metricKey)
    if (!metric) return Activity
    return metric.icon
  }

  const getMetricColor = (metricKey: string) => {
    const metric = METRICS.find((m) => m.key === metricKey)
    return metric?.color || "#8884d8"
  }

  const getTrendIcon = (direction: string) => {
    switch (direction) {
      case "increasing":
        return <TrendingUp className="w-4 h-4 text-red-500" />
      case "decreasing":
        return <TrendingDown className="w-4 h-4 text-green-500" />
      default:
        return <Activity className="w-4 h-4 text-yellow-500" />
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      year: "2-digit",
    })
  }

  const currentMetric = METRICS.find((m) => m.key === selectedMetric)
  const currentTrend = trendAnalysis.find((t) => t.metric === selectedMetric)
  const currentPattern = seasonalPatterns.find((p) => p.metric === selectedMetric)

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Time Series Analysis
              {countryCode && <Badge variant="secondary">{countryCode}</Badge>}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={autoRefresh ? "bg-green-100" : ""}
              >
                {autoRefresh ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                Auto Refresh
              </Button>
              <Button size="sm" variant="outline" onClick={generateTimeSeriesData}>
                <RefreshCw className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={downloadAnalysis}>
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Metric</Label>
              <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {METRICS.map((metric) => {
                    const IconComponent = metric.icon
                    return (
                      <SelectItem key={metric.key} value={metric.key}>
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {metric.name}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Time Range</Label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                  <SelectItem value="36">36 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Prediction Horizon</Label>
              <Select value={predictionHorizon} onValueChange={setPredictionHorizon}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 Months</SelectItem>
                  <SelectItem value="6">6 Months</SelectItem>
                  <SelectItem value="12">12 Months</SelectItem>
                  <SelectItem value="24">24 Months</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Analysis Mode</Label>
              <Select value={analysisMode} onValueChange={setAnalysisMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trend">Trend Analysis</SelectItem>
                  <SelectItem value="seasonal">Seasonal Patterns</SelectItem>
                  <SelectItem value="anomaly">Anomaly Detection</SelectItem>
                  <SelectItem value="forecast">AI Forecast</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center space-x-2">
              <Switch checked={showPredictions} onCheckedChange={setShowPredictions} />
              <Label>Show Predictions</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={showConfidenceInterval} onCheckedChange={setShowConfidenceInterval} />
              <Label>Confidence Intervals</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Switch checked={isRealTime} onCheckedChange={setIsRealTime} />
              <Label>Real-time Mode</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Time Series Chart */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {currentMetric && <currentMetric.icon className="w-5 h-5" />}
                {currentMetric?.name} Time Series
                {loading && (
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={formatDate} tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip
                      labelFormatter={(value) => formatDate(value as string)}
                      formatter={(value: any, name: string) => [`${value.toFixed(2)}${currentMetric?.unit}`, name]}
                    />
                    <Legend />

                    {/* Historical data */}
                    <Line
                      type="monotone"
                      dataKey={selectedMetric}
                      stroke={getMetricColor(selectedMetric)}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                      data={timeSeriesData.filter((d) => !d.prediction)}
                    />

                    {/* Prediction data */}
                    {showPredictions && (
                      <Line
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke={getMetricColor(selectedMetric)}
                        strokeWidth={2}
                        strokeDasharray="5 5"
                        dot={false}
                        connectNulls={false}
                        data={timeSeriesData.filter((d) => d.prediction)}
                      />
                    )}

                    {/* Current date reference line */}
                    <ReferenceLine
                      x={new Date().toISOString().split("T")[0]}
                      stroke="#666"
                      strokeDasharray="2 2"
                      label="Today"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Analysis Summary */}
        <div className="space-y-4">
          {/* Trend Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Trend Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              {currentTrend ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Direction</span>
                    <div className="flex items-center gap-1">
                      {getTrendIcon(currentTrend.direction)}
                      <span className="text-sm capitalize">{currentTrend.direction}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Rate</span>
                    <span className="text-sm">{currentTrend.rate.toFixed(3)}/month</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Volatility</span>
                    <span className="text-sm">{currentTrend.volatility.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Confidence</span>
                    <Badge variant={currentTrend.confidence > 0.7 ? "default" : "secondary"}>
                      {(currentTrend.confidence * 100).toFixed(0)}%
                    </Badge>
                  </div>

                  {currentTrend.criticalPeriods.length > 0 && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-1">
                        <AlertTriangle className="w-4 h-4 text-red-500" />
                        Critical Periods
                      </h4>
                      <div className="space-y-1">
                        {currentTrend.criticalPeriods.slice(0, 3).map((period, index) => (
                          <div key={index} className="text-xs p-2 bg-red-50 rounded">
                            <div className="font-medium">{formatDate(period.date)}</div>
                            <div className="text-muted-foreground">{period.reason}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <BarChart3 className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Loading trend analysis...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Seasonal Patterns */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Seasonal Pattern</CardTitle>
            </CardHeader>
            <CardContent>
              {currentPattern ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Amplitude</span>
                    <span className="text-sm">{currentPattern.amplitude.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Peak Month</span>
                    <span className="text-sm">
                      {new Date(2024, currentPattern.peakMonth, 1).toLocaleDateString("en-US", { month: "long" })}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Strength</span>
                    <Badge variant={currentPattern.strength > 0.5 ? "default" : "secondary"}>
                      {(currentPattern.strength * 100).toFixed(0)}%
                    </Badge>
                  </div>

                  <div className="mt-4">
                    <div className="text-xs text-muted-foreground mb-2">Seasonal Strength</div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentPattern.strength * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground">
                  <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>Loading seasonal analysis...</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Real-time Status */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="w-4 h-4" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Real-time Mode</span>
                  <Badge variant={isRealTime ? "default" : "secondary"}>{isRealTime ? "Active" : "Inactive"}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto Refresh</span>
                  <Badge variant={autoRefresh ? "default" : "secondary"}>{autoRefresh ? "On" : "Off"}</Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Data Points</span>
                  <span className="text-sm">{timeSeriesData.length}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-sm">Last Update</span>
                  <span className="text-xs text-muted-foreground">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Analysis Tabs */}
      <Card>
        <CardContent className="p-0">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="correlations">Correlations</TabsTrigger>
              <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              <TabsTrigger value="forecasting">AI Forecasting</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {METRICS.map((metric) => {
                  const trend = trendAnalysis.find((t) => t.metric === metric.key)
                  const IconComponent = metric.icon

                  return (
                    <Card key={metric.key} className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <IconComponent className="w-5 h-5" style={{ color: metric.color }} />
                        {trend && getTrendIcon(trend.direction)}
                      </div>
                      <h3 className="font-medium text-sm">{metric.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {trend ? `${trend.direction} at ${Math.abs(trend.rate).toFixed(3)}/month` : "Analyzing..."}
                      </p>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="correlations" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Cross-correlation analysis between environmental metrics</p>
                <p className="text-xs">Advanced statistical relationships and dependencies</p>
              </div>
            </TabsContent>

            <TabsContent value="anomalies" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <AlertTriangle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Anomaly detection using statistical and ML methods</p>
                <p className="text-xs">Identifying unusual patterns and outliers</p>
              </div>
            </TabsContent>

            <TabsContent value="forecasting" className="p-6">
              <div className="text-center py-8 text-muted-foreground">
                <Brain className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Advanced AI forecasting with confidence intervals</p>
                <p className="text-xs">Neural networks and ensemble methods</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

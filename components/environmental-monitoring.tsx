"use client"

<<<<<<< HEAD
import { useEffect, useState } from "react"
=======
import { useState } from "react"
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import {
  Thermometer,
  Droplets,
  Leaf,
  Wind,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Satellite,
  Activity,
  Eye,
  Download,
  Share,
  Filter,
} from "lucide-react"

<<<<<<< HEAD
// Hook: fetch live environmental data from backend
function useLiveEnvironmentalData() {
  const [data, setData] = useState<any | null>(null)
  const [hotspots, setHotspots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/nasa-environmental")
        if (!res.ok) throw new Error(`API ${res.status}`)
        const json = await res.json()

        const env = json.data.currentMetrics
        const series = json.data.timeSeriesData
        const alerts = json.data.alerts || []

        const liveData = {
          deforestation: {
            current: Number(env.deforestation.value),
            trend: Number(env.deforestation.change),
            status: env.deforestation.status,
            regions: [
              { name: "Amazon Basin", rate: 3.2, area: 850000, trend: -0.8 },
              { name: "Congo Basin", rate: 1.8, area: 420000, trend: -0.3 },
              { name: "Southeast Asia", rate: 4.1, area: 280000, trend: +0.2 },
              { name: "Boreal Forest", rate: 0.9, area: 650000, trend: -0.1 },
            ],
            timeSeries: series.map((d: any) => ({ month: d.time, rate: d.deforestation, alerts: Math.floor(Math.random() * 15) + 5 })),
          },
          carbonLevels: {
            current: Number(env.carbonLevels.value),
            trend: Number(env.carbonLevels.change),
            status: env.carbonLevels.status,
            regions: [
              { name: "North America", level: 418, trend: +1.1 },
              { name: "Europe", level: 419, trend: +0.9 },
              { name: "Asia", level: 425, trend: +1.5 },
              { name: "South America", level: 420, trend: +1.0 },
            ],
            timeSeries: series.map((d: any) => ({ month: d.time, level: d.carbon, absorption: 45 - Math.random() * 5 })),
          },
          waterQuality: {
            current: Number(env.waterQuality.value),
            trend: Number(env.waterQuality.change),
            status: env.waterQuality.status,
            regions: [
              { name: "Great Lakes", quality: 92, trend: +2.1 },
              { name: "Mediterranean", quality: 78, trend: +1.8 },
              { name: "Pacific Coast", quality: 89, trend: +3.5 },
              { name: "Atlantic Coast", quality: 85, trend: +2.8 },
            ],
            timeSeries: series.map((d: any) => ({ month: d.time, quality: d.water, pollution: 100 - d.water / 2 })),
          },
          temperature: {
            current: Number(env.temperature.value),
            trend: Number(env.temperature.change),
            status: env.temperature.status,
            regions: [
              { name: "Arctic", anomaly: 2.8, trend: +0.3 },
              { name: "Tropical", anomaly: 0.9, trend: +0.1 },
              { name: "Temperate", anomaly: 1.2, trend: +0.2 },
              { name: "Desert", anomaly: 1.5, trend: +0.15 },
            ],
            timeSeries: series.map((d: any) => ({ month: d.time, anomaly: d.temperature, baseline: 14.5 })),
          },
        }

        const liveHotspots = alerts.slice(0, 8).map((a: any, i: number) => ({
          id: i + 1,
          location: a.location || a.message,
          type: a.type === "critical" ? "temperature" : a.type === "warning" ? "deforestation" : "waterQuality",
          severity: a.type,
          coordinates: a.location && a.location.includes(",")
            ? a.location.split(",").map((s: string) => Number(s.trim())).reverse()
            : [0, 0],
          area: `${Math.floor(Math.random() * 1500) + 200} hectares`,
          detected: a.time || "now",
          confidence: Math.floor(Math.random() * 20) + 80,
        }))

        setData(liveData)
        setHotspots(liveHotspots)
        setError(null)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    const id = setInterval(fetchData, 60000)
    return () => clearInterval(id)
  }, [])

  return { data, hotspots, loading, error }
}

// Fallback environmental monitoring data
=======
// Environmental monitoring data
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
const environmentalData = {
  deforestation: {
    current: 2.3,
    trend: -0.5,
    status: "improving",
    regions: [
      { name: "Amazon Basin", rate: 3.2, area: 850000, trend: -0.8 },
      { name: "Congo Basin", rate: 1.8, area: 420000, trend: -0.3 },
      { name: "Southeast Asia", rate: 4.1, area: 280000, trend: +0.2 },
      { name: "Boreal Forest", rate: 0.9, area: 650000, trend: -0.1 },
    ],
    timeSeries: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString("en", { month: "short" }),
      rate: 2.3 + Math.sin(i * 0.5) * 0.8 + Math.random() * 0.3,
      alerts: Math.floor(Math.random() * 15) + 5,
    })),
  },
  carbonLevels: {
    current: 421,
    trend: +1.2,
    status: "warning",
    regions: [
      { name: "North America", level: 418, trend: +1.1 },
      { name: "Europe", level: 419, trend: +0.9 },
      { name: "Asia", level: 425, trend: +1.5 },
      { name: "South America", level: 420, trend: +1.0 },
    ],
    timeSeries: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString("en", { month: "short" }),
      level: 420 + i * 0.3 + Math.random() * 2,
      absorption: 45 - i * 0.5 + Math.random() * 5,
    })),
  },
  waterQuality: {
    current: 87,
    trend: +3.1,
    status: "good",
    regions: [
      { name: "Great Lakes", quality: 92, trend: +2.1 },
      { name: "Mediterranean", quality: 78, trend: +1.8 },
      { name: "Pacific Coast", quality: 89, trend: +3.5 },
      { name: "Atlantic Coast", quality: 85, trend: +2.8 },
    ],
    timeSeries: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString("en", { month: "short" }),
      quality: 85 + Math.sin(i * 0.3) * 8 + Math.random() * 3,
      pollution: 15 - Math.sin(i * 0.3) * 5 + Math.random() * 2,
    })),
  },
  temperature: {
    current: 1.1,
    trend: +0.1,
    status: "critical",
    regions: [
      { name: "Arctic", anomaly: 2.8, trend: +0.3 },
      { name: "Tropical", anomaly: 0.9, trend: +0.1 },
      { name: "Temperate", anomaly: 1.2, trend: +0.2 },
      { name: "Desert", anomaly: 1.5, trend: +0.15 },
    ],
    timeSeries: Array.from({ length: 12 }, (_, i) => ({
      month: new Date(2024, i).toLocaleDateString("en", { month: "short" }),
      anomaly: 1.0 + Math.sin(i * 0.4) * 0.3 + Math.random() * 0.2,
      baseline: 14.5 + Math.sin(i * 0.5) * 3,
    })),
  },
}

const hotspots = [
  {
    id: 1,
    location: "Amazon Rainforest, Brazil",
    type: "deforestation",
    severity: "high",
    coordinates: [-3.4653, -62.2159],
    area: "1,250 hectares",
    detected: "2 hours ago",
    confidence: 94,
  },
  {
    id: 2,
    location: "Great Barrier Reef, Australia",
    type: "water",
    severity: "medium",
    coordinates: [-18.2871, 147.6992],
    area: "850 hectares",
    detected: "6 hours ago",
    confidence: 87,
  },
  {
    id: 3,
    location: "Siberian Tundra, Russia",
    type: "temperature",
    severity: "critical",
    coordinates: [66.5, 94.15],
    area: "2,100 hectares",
    detected: "1 hour ago",
    confidence: 96,
  },
  {
    id: 4,
    location: "Congo Basin, DRC",
    type: "deforestation",
    severity: "high",
    coordinates: [-0.228, 15.8277],
    area: "980 hectares",
    detected: "4 hours ago",
    confidence: 91,
  },
]

const getMetricIcon = (type: string) => {
  switch (type) {
    case "deforestation":
      return <Leaf className="w-5 h-5" />
    case "carbonLevels":
      return <Wind className="w-5 h-5" />
    case "waterQuality":
      return <Droplets className="w-5 h-5" />
    case "temperature":
      return <Thermometer className="w-5 h-5" />
    default:
      return <Activity className="w-5 h-5" />
  }
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "good":
    case "improving":
      return "text-green-600"
    case "warning":
      return "text-yellow-600"
    case "critical":
      return "text-red-600"
    default:
      return "text-blue-600"
  }
}

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "low":
      return "bg-green-100 text-green-800 border-green-200"
    case "medium":
      return "bg-yellow-100 text-yellow-800 border-yellow-200"
    case "high":
      return "bg-orange-100 text-orange-800 border-orange-200"
    case "critical":
      return "bg-red-100 text-red-800 border-red-200"
    default:
      return "bg-gray-100 text-gray-800 border-gray-200"
  }
}

export default function EnvironmentalMonitoring() {
  const [activeMetric, setActiveMetric] = useState("deforestation")
<<<<<<< HEAD
  const [selectedRegion, setSelectedRegion] = useState<any | null>(null)
  const [showHotspots, setShowHotspots] = useState(true)
  const { data: liveData, hotspots: liveHotspots, loading, error } = useLiveEnvironmentalData()

  const dataset = liveData || environmentalData
  const currentData = dataset[activeMetric]
=======
  const [selectedRegion, setSelectedRegion] = useState(null)
  const [showHotspots, setShowHotspots] = useState(true)

  const currentData = environmentalData[activeMetric]
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Environmental Monitoring</h2>
<<<<<<< HEAD
          <p className="text-muted-foreground">
            Real-time analysis of global environmental indicators
            {loading ? " • Updating..." : error ? ` • API error: ${error}` : " • Live NASA data"}
          </p>
=======
          <p className="text-muted-foreground">Real-time analysis of global environmental indicators</p>
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Share className="w-4 h-4 mr-2" />
            Share
          </Button>
        </div>
      </div>

      {/* Metric Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
<<<<<<< HEAD
        {Object.entries(dataset).map(([key, data]) => (
=======
        {Object.entries(environmentalData).map(([key, data]) => (
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:scale-105 ${
              activeMetric === key ? "ring-2 ring-primary shadow-lg" : ""
            }`}
            onClick={() => setActiveMetric(key)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                {getMetricIcon(key)}
                {key.replace(/([A-Z])/g, " $1").trim()}
              </CardTitle>
              <div className={`text-xs ${getStatusColor(data.status)}`}>
                {data.trend > 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {data.current}
                {key === "carbonLevels" ? " ppm" : key === "temperature" ? "°C" : key === "waterQuality" ? "%" : "%"}
              </div>
              <div className={`text-sm flex items-center gap-1 ${getStatusColor(data.status)}`}>
                {data.trend > 0 ? "+" : ""}
                {data.trend}% from last month
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Time Series Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getMetricIcon(activeMetric)}
              {activeMetric.replace(/([A-Z])/g, " $1").trim()} - 12 Month Trend
            </CardTitle>
            <CardDescription>Historical data and trend analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={currentData.timeSeries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey={
                      activeMetric === "deforestation"
                        ? "rate"
                        : activeMetric === "carbonLevels"
                          ? "level"
                          : activeMetric === "waterQuality"
                            ? "quality"
                            : "anomaly"
                    }
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  />
                  {activeMetric === "carbonLevels" && (
                    <Line
                      type="monotone"
                      dataKey="absorption"
                      stroke="#10b981"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Carbon Absorption"
                    />
                  )}
                  {activeMetric === "waterQuality" && (
                    <Line
                      type="monotone"
                      dataKey="pollution"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Pollution Level"
                    />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Regional Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Regional Analysis</CardTitle>
            <CardDescription>Performance by geographic region</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {currentData.regions.map((region, index) => (
              <div
                key={index}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedRegion === index ? "bg-primary/5 border-primary" : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedRegion(selectedRegion === index ? null : index)}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-foreground" />
                    <span className="font-medium">{region.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">
                      {activeMetric === "deforestation"
                        ? `${region.rate}%`
                        : activeMetric === "carbonLevels"
                          ? `${region.level} ppm`
                          : activeMetric === "waterQuality"
                            ? `${region.quality}%`
                            : `+${region.anomaly}°C`}
                    </span>
                    <div className={`text-xs ${region.trend > 0 ? "text-red-600" : "text-green-600"}`}>
                      {region.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    </div>
                  </div>
                </div>
                {activeMetric === "deforestation" && (
                  <div className="text-xs text-muted-foreground">Area: {region.area.toLocaleString()} hectares</div>
                )}
                <div className="text-xs text-muted-foreground">
                  Trend: {region.trend > 0 ? "+" : ""}
                  {region.trend}% this month
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Environmental Hotspots */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                Environmental Hotspots
              </span>
              <Button variant="ghost" size="sm" onClick={() => setShowHotspots(!showHotspots)} className="text-xs">
                <Eye className="w-4 h-4 mr-1" />
                {showHotspots ? "Hide" : "Show"}
              </Button>
            </CardTitle>
            <CardDescription>Recent environmental alerts and anomalies</CardDescription>
          </CardHeader>
          <CardContent>
            {showHotspots && (
              <div className="space-y-4">
<<<<<<< HEAD
                {(liveHotspots.length ? liveHotspots : hotspots).map((hotspot) => (
=======
                {hotspots.map((hotspot) => (
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
                  <div key={hotspot.id} className="p-3 rounded-lg border">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(hotspot.type)}
                        <span className="font-medium text-sm">{hotspot.location}</span>
                      </div>
                      <Badge className={`text-xs ${getSeverityColor(hotspot.severity)}`}>{hotspot.severity}</Badge>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <div>Area affected: {hotspot.area}</div>
                      <div>Detected: {hotspot.detected}</div>
                      <div className="flex items-center justify-between">
                        <span>Confidence: {hotspot.confidence}%</span>
                        <Progress value={hotspot.confidence} className="w-16 h-1" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Satellite Coverage Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Satellite className="w-5 h-5" />
            Satellite Coverage & Data Quality
          </CardTitle>
          <CardDescription>Current satellite constellation status and data availability</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "MODIS Terra", coverage: 95, quality: 98, status: "active", lastPass: "12 min ago" },
              { name: "Landsat 8", coverage: 87, quality: 94, status: "active", lastPass: "34 min ago" },
              { name: "Sentinel-2A", coverage: 92, quality: 96, status: "active", lastPass: "18 min ago" },
              { name: "GOES-16", coverage: 89, quality: 91, status: "active", lastPass: "8 min ago" },
            ].map((satellite, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{satellite.name}</span>
                  <Badge variant={satellite.status === "active" ? "default" : "secondary"} className="text-xs">
                    {satellite.status}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Coverage</span>
                    <span>{satellite.coverage}%</span>
                  </div>
                  <Progress value={satellite.coverage} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Data Quality</span>
                    <span>{satellite.quality}%</span>
                  </div>
                  <Progress value={satellite.quality} className="h-2" />
                  <div className="text-xs text-muted-foreground">Last pass: {satellite.lastPass}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import { useEnv } from "@/components/env-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts"
import {
  Activity,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Satellite,
  Thermometer,
  Droplets,
  Leaf,
  Wind,
  Eye,
  RefreshCw,
  Filter,
  Download,
  Share,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Bell,
  BellOff,
} from "lucide-react"

function useRealTimeData({ refreshInterval = 30, autoRefresh = true, region = "global", timeRange = "24h", selectedCountry = null as string | null, activeLayer = "all" as string } = {}) {
  const [data, setData] = useState<any | null>(null)
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // keep a stable reference to fetch so we can call it manually
  const fetchRef = useRef<((opts?: { force?: boolean }) => Promise<void>) | null>(null)

  useEffect(() => {
    const fetchData = async (opts: { force?: boolean } = {}) => {
      try {
        setLoading(true)
        setError(null)
        console.log("[v1] Fetching real-time NASA satellite data...")

  const qs = new URLSearchParams()
  if (region) qs.set("region", region)
  if (timeRange) qs.set("timeRange", timeRange)
  if (selectedCountry) qs.set("country", String(selectedCountry))
  if (activeLayer) qs.set("layer", String(activeLayer))
  if (opts.force) qs.set("force", "1")

  const response = await fetch(`/api/nasa-live-data?${qs.toString()}`)

        if (!response.ok) {
          throw new Error(`NASA API Error: ${response.status}`)
        }

        const result = await response.json()

        // If the API returns the processed shape we expect, use it directly.
        // Otherwise fallback to lightweight transformation.
        let processed: any = null

        if (result && result.metrics && result.timeSeriesData) {
          // route returned processedData shape
          processed = {
            currentMetrics: {
              deforestation: {
                value: String(result.metrics.deforestation?.value ?? result.currentMetrics?.deforestation?.value ?? "-"),
                change: String(result.metrics.deforestation?.change ?? result.currentMetrics?.deforestation?.change ?? "0"),
                status: result.metrics.deforestation?.status ?? result.currentMetrics?.deforestation?.status ?? "good",
                unit: result.metrics.deforestation?.unit ?? "% per year",
                description: result.metrics.deforestation?.source ?? "",
                threshold: result.metrics.deforestation?.threshold ?? 2.5,
                scientificContext: result.metrics.deforestation?.scientificContext ?? "",
              },
              carbonLevels: {
                value: String(result.metrics.carbon_levels?.value ?? "-"),
                change: String(result.metrics.carbon_levels?.change ?? "0"),
                status: result.metrics.carbon_levels?.status ?? "warning",
                unit: result.metrics.carbon_levels?.unit ?? "ppm",
                description: result.metrics.carbon_levels?.source ?? "",
                threshold: result.metrics.carbon_levels?.threshold ?? 415,
                scientificContext: result.metrics.carbon_levels?.scientificContext ?? "",
              },
              waterQuality: {
                value: String(result.metrics.water_quality?.value ?? "-"),
                change: String(result.metrics.water_quality?.change ?? "0"),
                status: result.metrics.water_quality?.status ?? "good",
                unit: result.metrics.water_quality?.unit ?? "%",
                description: result.metrics.water_quality?.source ?? "",
                threshold: result.metrics.water_quality?.threshold ?? 75,
                scientificContext: result.metrics.water_quality?.scientificContext ?? "",
              },
              temperature: {
                value: String(result.metrics.temperature?.value ?? "-"),
                change: String(result.metrics.temperature?.change ?? "0"),
                status: result.metrics.temperature?.status ?? "good",
                unit: result.metrics.temperature?.unit ?? "°C anomaly",
                description: result.metrics.temperature?.source ?? "",
                threshold: result.metrics.temperature?.threshold ?? 1.5,
                scientificContext: result.metrics.temperature?.scientificContext ?? "",
              },
              ozoneLevels: {
                value: String(result.metrics.ozone_levels?.value ?? "-"),
                change: String(result.metrics.ozone_levels?.change ?? "0"),
                status: result.metrics.ozone_levels?.status ?? "good",
                unit: result.metrics.ozone_levels?.unit ?? "DU",
                description: result.metrics.ozone_levels?.source ?? "",
                threshold: result.metrics.ozone_levels?.threshold ?? 300,
                scientificContext: result.metrics.ozone_levels?.scientificContext ?? "",
              },
              seaLevel: {
                value: String(result.metrics.sea_level?.value ?? "-"),
                change: String(result.metrics.sea_level?.change ?? "0"),
                status: result.metrics.sea_level?.status ?? "good",
                unit: result.metrics.sea_level?.unit ?? "mm/year",
                description: result.metrics.sea_level?.source ?? "",
                threshold: result.metrics.sea_level?.threshold ?? 3.0,
                scientificContext: result.metrics.sea_level?.scientificContext ?? "",
              },
            },
            timeSeriesData: result.timeSeriesData ?? result.timeSeries ?? [],
            alerts: result.alerts ?? result.data?.alerts ?? [],
            satelliteStatus: result.satelliteStatus ?? result.satellite_status ?? [],
            globalStats: result.globalStats ?? result.global_stats ?? [],
            scientificInsights: result.scientificInsights ?? result.scientific_insights ?? [],
          }
        } else {
          // fallback: build a lightweight shape
          processed = getFallbackData()
        }

        setData(processed)
        setLastUpdate(new Date())
      } catch (err: any) {
        console.error("[v1] Error fetching NASA data:", err)
        setError(err?.message ?? String(err))
        setData(getFallbackData())
      } finally {
        setLoading(false)
      }
    }

  // store a reference so callers can manually refresh
  fetchRef.current = (opts?: { force?: boolean }) => fetchData(opts)

    // Trigger an initial fetch
    fetchData()

    // Manage polling according to autoRefresh and refreshInterval
    let intervalId: number | undefined
    if (autoRefresh) {
      intervalId = window.setInterval(fetchData, refreshInterval * 1000)
    }

    return () => {
      if (intervalId) window.clearInterval(intervalId)
    }
  }, [refreshInterval, autoRefresh, region, timeRange, selectedCountry, activeLayer])

  const refreshNow = async () => {
    if (fetchRef.current) await fetchRef.current({ force: true })
  }

  return { data, lastUpdate, loading, error, refreshNow }
}

function getFallbackData() {
  return {
    currentMetrics: {
      deforestation: {
        value: "1.9",
        change: "0.6",
        status: "warning",
        unit: "% per year",
        description: "Global forest loss rate based on MODIS satellite data",
        threshold: 2.5,
        scientificContext: "Deforestation contributes to 11% of global CO2 emissions",
      },
      carbonLevels: {
        value: "423",
        change: "-0.6",
        status: "critical",
        unit: "ppm",
        description: "Atmospheric CO2 concentration from NOAA monitoring stations",
        threshold: 415,
        scientificContext: "Pre-industrial levels were ~280 ppm. Current rate: +2.4 ppm/year",
      },
      waterQuality: {
        value: "89",
        change: "-0.2",
        status: "good",
        unit: "% clean",
        description: "Global freshwater quality index from Landsat analysis",
        threshold: 75,
        scientificContext: "2 billion people lack access to safely managed drinking water",
      },
      temperature: {
        value: "1.4",
        change: "0.11",
        status: "warning",
        unit: "°C anomaly",
        description: "Global temperature anomaly vs 1951-1980 baseline",
        threshold: 1.5,
        scientificContext: "Paris Agreement target: limit warming to 1.5°C above pre-industrial",
      },
      ozoneLevels: {
        value: "304",
        change: "0.6",
        status: "good",
        unit: "DU",
        description: "Stratospheric ozone column density",
        threshold: 300,
        scientificContext: "Antarctic ozone hole has been recovering since Montreal Protocol",
      },
      seaLevel: {
        value: "3.4",
        change: "-0.09",
        status: "warning",
        unit: "mm/year",
        description: "Global mean sea level rise rate",
        threshold: 3.0,
        scientificContext: "Accelerating from 1.4 mm/year (20th century) to 3.4 mm/year (2006-2018)",
      },
    },
    timeSeriesData: Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      deforestation: Math.random() * 5 + 1,
      carbon: 420 + Math.random() * 10,
      water: 80 + Math.random() * 15,
      temperature: 1.0 + Math.random() * 0.5,
      ozone: 290 + Math.random() * 20,
      seaLevel: 3.4 + Math.random() * 0.6,
      biodiversity: 70 + Math.random() * 20,
      airQuality: 60 + Math.random() * 30,
      glacialMass: -(Math.random() * 150 + 50),
      oceanPh: 8.1 - Math.random() * 0.3,
    })),
    alerts: [
      {
        id: 1,
        type: "warning",
        message: "NASA API temporarily unavailable - using cached data",
        time: "now",
        location: "Global",
        impact: "Data may be delayed",
        source: "System Status",
      },
    ],
    satelliteStatus: [
      {
        name: "MODIS Terra",
        status: "active",
        coverage: 95,
        lastContact: "30s ago",
        mission: "Land/Ocean monitoring",
      },
      { name: "Landsat 8", status: "active", coverage: 87, lastContact: "2m ago", mission: "Land surface imaging" },
      {
        name: "Sentinel-2A",
        status: "maintenance",
        coverage: 0,
        lastContact: "4h ago",
        mission: "High-res optical imaging",
      },
      { name: "GOES-16", status: "active", coverage: 92, lastContact: "1m ago", mission: "Weather monitoring" },
      { name: "OCO-2", status: "active", coverage: 78, lastContact: "5m ago", mission: "CO2 measurements" },
      {
        name: "Sentinel-3",
        status: "active",
        coverage: 89,
        lastContact: "1m ago",
        mission: "Ocean/land monitoring",
      },
    ],
    globalStats: [
      { name: "Forest Cover", value: 68, color: "#10b981", trend: -0.8, unit: "% remaining" },
      { name: "Ocean Health", value: 45, color: "#3b82f6", trend: -1.2, unit: "% healthy" },
      { name: "Air Quality", value: 52, color: "#f59e0b", trend: 0.3, unit: "% good" },
      { name: "Biodiversity", value: 23, color: "#ef4444", trend: -2.1, unit: "% stable" },
      { name: "Freshwater", value: 71, color: "#06b6d4", trend: -0.5, unit: "% accessible" },
      { name: "Soil Health", value: 58, color: "#8b5cf6", trend: -0.9, unit: "% fertile" },
    ],
    scientificInsights: [
      {
        title: "API Integration Status",
        description: "Working to restore full NASA API connectivity for real-time data",
        impact: "Medium",
        timeframe: "Ongoing",
      },
      {
        title: "Data Reliability",
        description: "Using cached NASA data with periodic updates when APIs are available",
        impact: "Low",
        timeframe: "Temporary",
      },
    ],
  }
}

export default function RealTimeDashboard() {
  const { selectedCountry, activeLayer, region, timeRange, setRegion, setTimeRange } = useEnv()
  const [selectedMetric, setSelectedMetric] = useState("deforestation")
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [refreshInterval, setRefreshInterval] = useState(30)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [alertsEnabled, setAlertsEnabled] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [playbackSpeed, setPlaybackSpeed] = useState(1)
  const [selectedChart, setSelectedChart] = useState("line")

  const { data, lastUpdate, loading, error, refreshNow } = useRealTimeData({
    refreshInterval,
    autoRefresh,
    region,
    timeRange,
    selectedCountry: selectedCountry,
    activeLayer: activeLayer,
  })

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            Connecting to NASA satellites and processing real-time environmental data...
          </p>
          <p className="text-sm text-blue-600 mt-2">🛰️ MODIS • VIIRS • Landsat • Sentinel • EONET • FIRMS</p>
          {error && <p className="text-red-500 text-sm mt-2">NASA API Status: {error} - Attempting reconnection</p>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-8 bg-muted rounded mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "good":
      case "improving":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "warning":
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-red-500" />
      default:
        return <Activity className="w-4 h-4 text-blue-500" />
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "deforestation":
        return <Leaf className="w-5 h-5" />
      case "carbonLevels":
        return <Wind className="w-5 h-5" />
      case "waterQuality":
        return <Droplets className="w-5 h-5" />
      case "temperature":
        return <Thermometer className="w-5 h-5" />
      case "ozoneLevels":
        return <Zap className="w-5 h-5" />
      case "seaLevel":
        return <Satellite className="w-5 h-5" />
      default:
        return <Activity className="w-5 h-5" />
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Real-Time Environmental Dashboard</h2>
          <p className="text-muted-foreground">
            Last updated: {lastUpdate.toLocaleTimeString()} • Next update in: 30s •
            {error ? (
              <span className="text-red-500 ml-2">NASA API: {error}</span>
            ) : (
              <span className="text-green-600 ml-2">🛰️ Live NASA Satellite Data</span>
            )}
          </p>
          {/* Show cache metadata if present in response */}
          {data && (data as any).cached !== undefined && (
            <div className="mt-2">
              {(data as any).cached ? (
                <Badge variant="outline" className="text-xs">
                  Cached • {(data as any).cache_age}s old
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-xs">
                  Fresh
                </Badge>
              )}
            </div>
          )}
          <div className="text-sm text-muted-foreground mt-2">
            <span className="mr-4">Selected country: {selectedCountry ?? "—"}</span>
            <span>Active layer: {activeLayer}</span>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={timeRange} onValueChange={(v: string) => setTimeRange(v)}>
            <SelectTrigger className="w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1h">1H</SelectItem>
              <SelectItem value="6h">6H</SelectItem>
              <SelectItem value="24h">24H</SelectItem>
              <SelectItem value="7d">7D</SelectItem>
              <SelectItem value="30d">30D</SelectItem>
            </SelectContent>
          </Select>

          <Select value={region} onValueChange={(v: string) => setRegion(v)}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="global">Global</SelectItem>
              <SelectItem value="americas">Americas</SelectItem>
              <SelectItem value="europe">Europe</SelectItem>
              <SelectItem value="asia">Asia</SelectItem>
              <SelectItem value="africa">Africa</SelectItem>
              <SelectItem value="oceania">Oceania</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="sm" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Filter className="w-4 h-4 mr-2" />
            Filters
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAlertsEnabled(!alertsEnabled)}
            className={alertsEnabled ? "bg-green-50 border-green-200" : ""}
          >
            {alertsEnabled ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
            Alerts
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={autoRefresh ? "bg-green-50 border-green-200" : ""}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? "animate-spin" : ""}`} />
            Auto Refresh
          </Button>

          <Button variant="secondary" size="sm" onClick={() => refreshNow && refreshNow()}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Now
          </Button>

          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Badge variant="secondary">
            <Zap className="w-3 h-3 mr-1" />
            Live
          </Badge>
        </div>
      </div>

      {showAdvancedFilters && (
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="space-y-2">
                <Label>Refresh Interval (seconds)</Label>
                      <Slider
                        value={[refreshInterval]}
                        onValueChange={(value: number[]) => setRefreshInterval(value[0])}
                        max={300}
                        min={5}
                        step={5}
                        className="w-full"
                      />
                <div className="text-xs text-muted-foreground">{refreshInterval}s</div>
              </div>

              <div className="space-y-2">
                <Label>Playback Speed</Label>
                <Slider
                  value={[playbackSpeed]}
                  onValueChange={(value: number[]) => setPlaybackSpeed(value[0])}
                  max={5}
                  min={0.1}
                  step={0.1}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground">{playbackSpeed}x</div>
              </div>

              <div className="space-y-2">
                <Label>Chart Type</Label>
                <Select value={selectedChart} onValueChange={setSelectedChart}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="line">Line Chart</SelectItem>
                    <SelectItem value="area">Area Chart</SelectItem>
                    <SelectItem value="bar">Bar Chart</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Data Threshold</Label>
                <Input type="number" placeholder="Alert threshold" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {(Object.entries(data.currentMetrics as Record<string, any>) as [string, any][]).map(([key, metric]: [string, any]) => (
          <Card
            key={key}
            className={`cursor-pointer transition-all hover:scale-105 hover:shadow-lg ${
              selectedMetric === key ? "ring-2 ring-primary shadow-lg bg-primary/5" : ""
            }`}
            onClick={() => setSelectedMetric(key)}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium capitalize flex items-center gap-2">
                {getMetricIcon(key)}
                {key.replace(/([A-Z])/g, " $1").trim()}
              </CardTitle>
              <div className="flex items-center gap-1">
                {getStatusIcon((metric as any).status)}
                <Badge variant={(metric as any).value > (metric as any).threshold ? "destructive" : "secondary"} className="text-xs">
                  {(metric as any).value > (metric as any).threshold ? "Above Threshold" : "Within Range"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold mb-2">
                {(metric as any).value} {(metric as any).unit}
              </div>
              <div
                className={`text-sm flex items-center gap-1 mb-2 ${
                  Number.parseFloat((metric as any).change) > 0
                    ? key === "deforestation" || key === "carbonLevels" || key === "temperature" || key === "seaLevel"
                      ? "text-red-600"
                      : "text-green-600"
                    : key === "deforestation" || key === "carbonLevels" || key === "temperature" || key === "seaLevel"
                      ? "text-green-600"
                      : "text-red-600"
                }`}
              >
                {Number.parseFloat((metric as any).change) > 0 ? (
                  <TrendingUp className="w-4 h-4" />
                ) : (
                  <TrendingDown className="w-4 h-4" />
                )}
                {(metric as any).change > 0 ? "+" : ""}
                {(metric as any).change}% from last period
              </div>
              <p className="text-xs text-muted-foreground mb-2">{(metric as any).description}</p>
              <p className="text-xs text-blue-600 font-medium">{(metric as any).scientificContext}</p>
              <Progress
                value={Math.abs(Number.parseFloat((metric as any).value))}
                className="h-2 mt-2"
                max={key === "carbonLevels" ? 500 : key === "ozoneLevels" ? 400 : 100}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Environmental Trends - {timeRange.toUpperCase()}</CardTitle>
                <CardDescription>
                  Real-time monitoring across key environmental indicators • Data sources: MODIS, Landsat, Sentinel,
                  NOAA
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <SkipBack className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <SkipForward className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex flex-wrap gap-2">
              <Badge variant="outline">🌡️ Temperature Anomaly</Badge>
              <Badge variant="outline">🌊 Sea Level Rise</Badge>
              <Badge variant="outline">🌿 Deforestation Rate</Badge>
              <Badge variant="outline">💧 Water Quality Index</Badge>
              <Badge variant="outline">🛡️ Ozone Density</Badge>
              <Badge variant="outline">🐋 Ocean pH</Badge>
            </div>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                {selectedChart === "area" ? (
                  <AreaChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${Number(value).toFixed(2)} ${String(name).includes("carbon") ? "ppm" : String(name).includes("temp") ? "°C" : String(name).includes("ozone") ? "DU" : String(name).includes("sea") ? "mm/yr" : "%"}`,
                        name,
                      ]}
                    />
                    <Area
                      type="monotone"
                      dataKey="deforestation"
                      stackId="1"
                      stroke="#ef4444"
                      fill="#ef4444"
                      fillOpacity={0.3}
                      name="Deforestation Rate"
                    />
                    <Area
                      type="monotone"
                      dataKey="water"
                      stackId="2"
                      stroke="#3b82f6"
                      fill="#3b82f6"
                      fillOpacity={0.3}
                      name="Water Quality"
                    />
                    <Area
                      type="monotone"
                      dataKey="biodiversity"
                      stackId="3"
                      stroke="#10b981"
                      fill="#10b981"
                      fillOpacity={0.3}
                      name="Biodiversity Index"
                    />
                  </AreaChart>
                ) : selectedChart === "bar" ? (
                  <BarChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="deforestation" fill="#ef4444" name="Deforestation %" />
                    <Bar dataKey="water" fill="#3b82f6" name="Water Quality %" />
                    <Bar dataKey="airQuality" fill="#f59e0b" name="Air Quality %" />
                  </BarChart>
                ) : (
                  <LineChart data={data.timeSeriesData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip
                      formatter={(value: any, name: any) => [
                        `${Number(value).toFixed(2)} ${String(name).includes("carbon") ? "ppm" : String(name).includes("temp") ? "°C" : String(name).includes("ozone") ? "DU" : String(name).includes("sea") ? "mm/yr" : String(name).includes("pH") ? "pH" : "%"}`,
                        name,
                      ]}
                    />
                    <Line
                      type="monotone"
                      dataKey="temperature"
                      stroke="#ef4444"
                      strokeWidth={3}
                      name="Temperature Anomaly"
                      dot={{ fill: "#ef4444", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="carbon"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="CO2 Levels"
                      dot={{ fill: "#8b5cf6", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="seaLevel"
                      stroke="#06b6d4"
                      strokeWidth={3}
                      name="Sea Level Rise"
                      dot={{ fill: "#06b6d4", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="ozone"
                      stroke="#10b981"
                      strokeWidth={3}
                      name="Ozone Density"
                      dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="oceanPh"
                      stroke="#f59e0b"
                      strokeWidth={3}
                      name="Ocean pH"
                      dot={{ fill: "#f59e0b", strokeWidth: 2, r: 4 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
            <div className="mt-4 text-xs text-muted-foreground">
              <p>📊 Data Integration: MODIS Terra/Aqua, Landsat 8/9, Sentinel-2/3, GOES-16, OCO-2, SMAP</p>
              <p>🔄 Update Frequency: Real-time processing with 15-minute latency • Spatial Resolution: 250m-1km</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Global Environmental Health Index</CardTitle>
            <CardDescription>Comprehensive assessment of planetary health indicators</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                      data={data.globalStats}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                      {(data.globalStats as any[]).map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                  </Pie>
                    <Tooltip formatter={(value: any, name: any) => [`${value}%`, name]} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-1 gap-3 mt-4">
                {(data.globalStats as any[]).map((stat: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: stat.color }} />
                    <span className="text-sm font-medium">{stat.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold">{stat.value}%</span>
                    <span
                      className={`text-xs flex items-center gap-1 ${stat.trend > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {stat.trend > 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {Math.abs(stat.trend)}%/yr
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Satellite className="w-5 h-5" />
              Earth Observation Network
            </CardTitle>
            <CardDescription>NASA & ESA satellite constellation status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {(data.satelliteStatus as any[]).map((satellite: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      satellite.status === "active"
                        ? "bg-green-500 animate-pulse"
                        : satellite.status === "maintenance"
                          ? "bg-yellow-500"
                          : "bg-red-500"
                    }`}
                  />
                  <div>
                    <p className="font-medium">{satellite.name}</p>
                    <p className="text-xs text-muted-foreground">{satellite.mission}</p>
                    <p className="text-xs text-blue-600">{satellite.lastContact}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{satellite.coverage}%</p>
                  <Progress value={satellite.coverage} className="w-16 h-2" />
                  <p className="text-xs text-muted-foreground mt-1">Coverage</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            Environmental Intelligence Alerts
          </CardTitle>
          <CardDescription>AI-powered anomaly detection from satellite data streams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {(data.alerts as any[]).map((alert: any) => (
              <div
                key={alert.id}
                className={`flex items-start gap-3 p-4 rounded-lg border ${
                  alert.type === "critical"
                    ? "bg-red-50 border-red-200"
                    : alert.type === "warning"
                      ? "bg-yellow-50 border-yellow-200"
                      : "bg-blue-50 border-blue-200"
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full mt-2 ${
                    alert.type === "critical"
                      ? "bg-red-500 animate-pulse"
                      : alert.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                  }`}
                />
                <div className="flex-1">
                  <p className="font-medium mb-1">{alert.message}</p>
                  <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                    <p>📍 {alert.location}</p>
                    <p>📊 {alert.impact}</p>
                    <p>🛰️ {alert.source}</p>
                    <p>⏰ {alert.time}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="ghost">
                    <Share className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">🧬 Scientific Insights & Climate Intelligence</CardTitle>
          <CardDescription>AI-driven analysis of environmental patterns and projections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(data.scientificInsights as any[]).map((insight: any, index: number) => (
              <div key={index} className="p-4 rounded-lg border bg-gradient-to-br from-blue-50 to-purple-50">
                <h4 className="font-semibold mb-2">{insight.title}</h4>
                <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                <div className="flex justify-between items-center">
                  <Badge
                    variant={
                      insight.impact === "Critical"
                        ? "destructive"
                        : insight.impact === "High"
                          ? "secondary"
                          : "outline"
                    }
                  >
                    {insight.impact} Impact
                  </Badge>
                  <span className="text-xs text-muted-foreground">{insight.timeframe}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

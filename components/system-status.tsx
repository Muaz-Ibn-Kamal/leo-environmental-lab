"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertCircle, Activity, Satellite, Brain, Globe } from "lucide-react"

interface SystemStatus {
  satellite_data: "online" | "offline" | "degraded"
  ai_models: "online" | "offline" | "training"
  real_time_feeds: "online" | "offline" | "delayed"
  prediction_engine: "online" | "offline" | "updating"
}

export default function SystemStatus() {
  const [status, setStatus] = useState<SystemStatus>({
    satellite_data: "online",
    ai_models: "online",
    real_time_feeds: "online",
    prediction_engine: "online",
  })

  const [lastUpdate, setLastUpdate] = useState<string>("")

  useEffect(() => {
    // Simulate real-time status updates
    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString())

      // Occasionally simulate system updates
      if (Math.random() < 0.1) {
        setStatus((prev) => ({
          ...prev,
          prediction_engine: Math.random() < 0.5 ? "updating" : "online",
        }))
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "offline":
        return "bg-red-500"
      case "degraded":
      case "delayed":
      case "training":
      case "updating":
        return "bg-yellow-500"
      default:
        return "bg-gray-500"
    }
  }

  const getStatusTextColor = (status: string) => {
    switch (status) {
      case "online":
      case "offline":
      case "degraded":
      case "delayed":
      case "training":
      case "updating":
        return "text-white"
      default:
        return "text-white"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <CheckCircle className="h-4 w-4" />
      case "offline":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          System Status
        </CardTitle>
        <CardDescription>
          Real-time monitoring of LEO Environmental Lab systems
          {lastUpdate && ` • Last updated: ${lastUpdate}`}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Satellite className="h-5 w-5 text-blue-500" />
              <span className="font-medium">Satellite Data Feeds</span>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(status.satellite_data)} ${getStatusTextColor(status.satellite_data)} border-0`}
            >
              {getStatusIcon(status.satellite_data)}
              {status.satellite_data}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-500" />
              <span className="font-medium">AI Prediction Models</span>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(status.ai_models)} ${getStatusTextColor(status.ai_models)} border-0`}
            >
              {getStatusIcon(status.ai_models)}
              {status.ai_models}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Globe className="h-5 w-5 text-green-500" />
              <span className="font-medium">Real-time Data Feeds</span>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(status.real_time_feeds)} ${getStatusTextColor(status.real_time_feeds)} border-0`}
            >
              {getStatusIcon(status.real_time_feeds)}
              {status.real_time_feeds}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              <Activity className="h-5 w-5 text-orange-500" />
              <span className="font-medium">Prediction Engine</span>
            </div>
            <Badge
              variant="outline"
              className={`${getStatusColor(status.prediction_engine)} ${getStatusTextColor(status.prediction_engine)} border-0`}
            >
              {getStatusIcon(status.prediction_engine)}
              {status.prediction_engine}
            </Badge>
          </div>
        </div>

        <div className="mt-6 p-4 bg-muted rounded-lg">
          <h4 className="font-semibold mb-2">System Capabilities</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• Real-time NASA satellite data integration</li>
            <li>• AI-powered environmental predictions</li>
            <li>• Interactive 3D country selection</li>
            <li>• Time-series analysis and forecasting</li>
            <li>• Safety risk assessment and alerts</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}

"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  Activity,
  Zap,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer2,
  Sparkles,
  Waves,
  Wind,
  Sun,
  Moon,
  Cloud,
  Thermometer,
  Droplets,
} from "lucide-react"

interface AnimatedMetricCardProps {
  title: string
  value: string
  change: number
  icon: React.ComponentType<any>
  color: string
  isActive: boolean
  onClick: () => void
  description: string
}

function AnimatedMetricCard({
  title,
  value,
  change,
  icon: Icon,
  color,
  isActive,
  onClick,
  description,
}: AnimatedMetricCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; opacity: number }>>([])
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (isHovered) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        opacity: Math.random() * 0.8 + 0.2,
      }))
      setParticles(newParticles)
    } else {
      setParticles([])
    }
  }, [isHovered])

  return (
    <Card
      ref={cardRef}
      className={`relative cursor-pointer transition-all duration-500 overflow-hidden group ${
        isActive
          ? "ring-2 ring-primary shadow-2xl scale-105 bg-gradient-to-br from-primary/10 to-accent/10"
          : "hover:scale-102 hover:shadow-xl"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Animated Background Particles */}
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute w-1 h-1 bg-primary/30 rounded-full animate-ping"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            opacity: particle.opacity,
            animationDelay: `${particle.id * 0.1}s`,
          }}
        />
      ))}

      {/* Hover Glow Effect */}
      <div
        className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
      />

      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          <Icon
            className={`w-5 h-5 transition-all duration-300 ${
              isHovered ? "scale-110 rotate-12" : ""
            } ${isActive ? "text-primary animate-pulse" : ""}`}
          />
          {title}
        </CardTitle>

        {/* Interactive Indicator */}
        <div className={`transition-all duration-300 ${isHovered ? "scale-110" : "scale-0"}`}>
          <MousePointer2 className="w-4 h-4 text-primary animate-bounce" />
        </div>
      </CardHeader>

      <CardContent>
        <div className="text-2xl font-bold mb-2 transition-all duration-300 group-hover:text-primary">{value}</div>

        <div
          className={`text-sm flex items-center gap-1 mb-2 transition-all duration-300 ${
            change > 0 ? "text-red-600" : "text-green-600"
          }`}
        >
          {change > 0 ? (
            <TrendingUp className="w-4 h-4 animate-bounce" />
          ) : (
            <TrendingDown className="w-4 h-4 animate-bounce" />
          )}
          {change > 0 ? "+" : ""}
          {change}%
        </div>

        <p className="text-xs text-muted-foreground group-hover:text-foreground transition-colors duration-300">
          {description}
        </p>

        {/* Animated Progress Bar */}
        <Progress
          value={Math.abs(change) * 10}
          className="h-2 mt-2 transition-all duration-500"
          style={{
            background: isActive
              ? "linear-gradient(90deg, rgba(59,130,246,0.3) 0%, rgba(147,51,234,0.3) 100%)"
              : undefined,
          }}
        />

        {/* Sparkle Effect */}
        {isActive && (
          <div className="absolute top-2 right-2">
            <Sparkles className="w-4 h-4 text-primary animate-spin" />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

interface InteractiveControlPanelProps {
  onSettingChange: (setting: string, value: any) => void
}

function InteractiveControlPanel({ onSettingChange }: InteractiveControlPanelProps) {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    soundEffects: false,
    particleEffects: true,
    animationSpeed: 1,
    dataVisualization: "enhanced",
    alertSensitivity: 75,
  })

  const [isExpanded, setIsExpanded] = useState(false)

  const updateSetting = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
    onSettingChange(key, value)
  }

  return (
    <Card className="bg-gradient-to-br from-background/80 to-muted/50 backdrop-blur-sm border-primary/20">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary animate-pulse" />
            Interactive Controls
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="hover:scale-110 transition-transform"
          >
            <Eye className={`w-4 h-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
          </Button>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto Refresh</span>
              <Switch
                checked={settings.autoRefresh}
                onCheckedChange={(checked) => updateSetting("autoRefresh", checked)}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sound Effects</span>
              <Switch
                checked={settings.soundEffects}
                onCheckedChange={(checked) => updateSetting("soundEffects", checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Particle Effects</span>
              <Switch
                checked={settings.particleEffects}
                onCheckedChange={(checked) => updateSetting("particleEffects", checked)}
              />
            </div>

            <div className="space-y-2">
              <span className="text-sm font-medium">Animation Speed</span>
              <Slider
                value={[settings.animationSpeed]}
                onValueChange={(value) => updateSetting("animationSpeed", value[0])}
                max={3}
                min={0.1}
                step={0.1}
                className="w-full"
              />
              <div className="text-xs text-muted-foreground">{settings.animationSpeed}x</div>
            </div>
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Alert Sensitivity</span>
            <Slider
              value={[settings.alertSensitivity]}
              onValueChange={(value) => updateSetting("alertSensitivity", value[0])}
              max={100}
              min={0}
              step={5}
              className="w-full"
            />
            <div className="text-xs text-muted-foreground">{settings.alertSensitivity}%</div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface WeatherVisualizationProps {
  temperature: number
  humidity: number
  windSpeed: number
  timeOfDay: "day" | "night"
}

function WeatherVisualization({ temperature, humidity, windSpeed, timeOfDay }: WeatherVisualizationProps) {
  const [animationPhase, setAnimationPhase] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 360)
    }, 100)
    return () => clearInterval(interval)
  }, [])

  const getWeatherIcon = () => {
    if (temperature > 30) return Sun
    if (temperature < 10) return Cloud
    if (humidity > 80) return Droplets
    return timeOfDay === "day" ? Sun : Moon
  }

  const WeatherIcon = getWeatherIcon()

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950">
      {/* Animated Background */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `radial-gradient(circle at ${50 + Math.sin(animationPhase * 0.01) * 20}% ${50 + Math.cos(animationPhase * 0.01) * 20}%, rgba(59,130,246,0.3) 0%, transparent 50%)`,
        }}
      />

      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WeatherIcon
            className={`w-6 h-6 transition-all duration-1000 ${
              timeOfDay === "day" ? "text-yellow-500 animate-pulse" : "text-blue-300"
            }`}
          />
          Environmental Conditions
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <Thermometer
              className={`w-8 h-8 mx-auto mb-2 transition-colors duration-500 ${
                temperature > 25 ? "text-red-500" : temperature < 15 ? "text-blue-500" : "text-green-500"
              }`}
            />
            <div className="text-2xl font-bold">{temperature}°C</div>
            <div className="text-xs text-muted-foreground">Temperature</div>
          </div>

          <div className="text-center">
            <Droplets
              className={`w-8 h-8 mx-auto mb-2 transition-colors duration-500 ${
                humidity > 70 ? "text-blue-600" : "text-blue-400"
              }`}
            />
            <div className="text-2xl font-bold">{humidity}%</div>
            <div className="text-xs text-muted-foreground">Humidity</div>
          </div>

          <div className="text-center">
            <Wind
              className={`w-8 h-8 mx-auto mb-2 transition-transform duration-500 ${
                windSpeed > 10 ? "animate-spin" : ""
              }`}
              style={{ color: `hsl(${Math.min(windSpeed * 10, 120)}, 70%, 50%)` }}
            />
            <div className="text-2xl font-bold">{windSpeed} m/s</div>
            <div className="text-xs text-muted-foreground">Wind Speed</div>
          </div>
        </div>

        {/* Animated Weather Effects */}
        <div className="relative h-20 overflow-hidden rounded-lg bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900 dark:to-blue-800">
          {/* Rain Effect */}
          {humidity > 80 && (
            <div className="absolute inset-0">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="absolute w-0.5 h-4 bg-blue-400 opacity-60 animate-bounce"
                  style={{
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${Math.random() * 2}s`,
                    animationDuration: "1s",
                  }}
                />
              ))}
            </div>
          )}

          {/* Wind Effect */}
          {windSpeed > 5 && (
            <div className="absolute inset-0">
              <Waves className="w-full h-full text-blue-300 opacity-30 animate-pulse" />
            </div>
          )}

          {/* Sun Rays */}
          {timeOfDay === "day" && temperature > 20 && (
            <div className="absolute top-2 right-2">
              <div className="w-8 h-8 bg-yellow-300 rounded-full animate-ping opacity-75" />
              <div className="absolute top-1 right-1 w-6 h-6 bg-yellow-400 rounded-full" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default function InteractiveDashboardWidgets() {
  const [activeMetric, setActiveMetric] = useState<string | null>(null)
  const [settings, setSettings] = useState({})

  const metrics = [
    {
      id: "temperature",
      title: "Global Temperature",
      value: "+1.2°C",
      change: 0.8,
      icon: Thermometer,
      color: "from-red-500 to-orange-500",
      description: "Temperature anomaly vs baseline",
    },
    {
      id: "carbon",
      title: "CO2 Levels",
      value: "421 ppm",
      change: 2.4,
      icon: Wind,
      color: "from-purple-500 to-pink-500",
      description: "Atmospheric carbon concentration",
    },
    {
      id: "water",
      title: "Water Quality",
      value: "87%",
      change: -1.2,
      icon: Droplets,
      color: "from-blue-500 to-cyan-500",
      description: "Global freshwater quality index",
    },
    {
      id: "energy",
      title: "Renewable Energy",
      value: "34%",
      change: 5.6,
      icon: Zap,
      color: "from-green-500 to-emerald-500",
      description: "Share of renewable energy sources",
    },
  ]

  const handleSettingChange = (setting: string, value: any) => {
    setSettings((prev) => ({ ...prev, [setting]: value }))
  }

  return (
    <div className="space-y-6">
      <InteractiveControlPanel onSettingChange={handleSettingChange} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <AnimatedMetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            change={metric.change}
            icon={metric.icon}
            color={metric.color}
            isActive={activeMetric === metric.id}
            onClick={() => setActiveMetric(activeMetric === metric.id ? null : metric.id)}
            description={metric.description}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherVisualization temperature={25} humidity={65} windSpeed={8} timeOfDay="day" />

        <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary animate-pulse" />
              Live Data Stream
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-background/50">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                  <span className="text-sm">Data stream {i + 1} active</span>
                  <Badge variant="secondary" className="ml-auto">
                    {Math.floor(Math.random() * 100)}% uptime
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

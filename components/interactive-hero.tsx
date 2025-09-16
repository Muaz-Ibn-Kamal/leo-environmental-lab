"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Globe, Satellite, Activity, Shield, Zap, TrendingUp, MousePointer2, Sparkles } from "lucide-react"

interface FloatingParticle {
  id: number
  x: number
  y: number
  size: number
  speed: number
  opacity: number
}

export default function InteractiveHero({ onSectionChange }: { onSectionChange: (section: string) => void }) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [particles, setParticles] = useState<FloatingParticle[]>([])
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Initialize floating particles
  useEffect(() => {
    const initialParticles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      opacity: Math.random() * 0.5 + 0.3,
    }))
    setParticles(initialParticles)
    setIsLoaded(true)
  }, [])

  // Animate particles
  useEffect(() => {
    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => ({
          ...particle,
          y: particle.y - particle.speed,
          x: particle.x + Math.sin(particle.y * 0.01) * 0.5,
          y: particle.y < -10 ? window.innerHeight + 10 : particle.y - particle.speed,
        })),
      )
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [])

  // Track mouse movement
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [])

  const features = [
    {
      id: "satellite",
      icon: Satellite,
      title: "Satellite Integration",
      description: "Real-time data from MODIS, Landsat, and Sentinel satellites",
      color: "from-blue-500 to-cyan-500",
      section: "dashboard",
    },
    {
      id: "ai",
      icon: Activity,
      title: "AI Analytics",
      description: "Machine learning models for environmental change detection",
      color: "from-purple-500 to-pink-500",
      section: "safety",
    },
    {
      id: "3d",
      icon: Globe,
      title: "3D Visualization",
      description: "Interactive Earth models with real-time data layers",
      color: "from-green-500 to-emerald-500",
      section: "3d",
    },
    {
      id: "safety",
      icon: Shield,
      title: "Safety Predictions",
      description: "AI-powered risk assessment and early warning systems",
      color: "from-orange-500 to-red-500",
      section: "safety",
    },
  ]

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />

      {/* Floating Particles */}
      {isLoaded &&
        particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute rounded-full bg-primary/30 pointer-events-none"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              opacity: particle.opacity,
              transform: `translate(-50%, -50%)`,
            }}
          />
        ))}

      {/* Mouse Follower */}
      <div
        className="fixed w-6 h-6 rounded-full bg-primary/20 pointer-events-none z-50 transition-transform duration-100"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${hoveredCard ? 1.5 : 1})`,
        }}
      />

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-4">
        <div
          className={`transition-all duration-1000 ${isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          <Badge variant="secondary" className="mb-4 animate-pulse">
            <Satellite className="w-4 h-4 mr-2" />
            NASA Space Apps Challenge 2025
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-gradient">
            LEO Environmental Lab
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
            AI-Powered Geospatial Intelligence for Real-Time Environmental Monitoring
          </p>

          {/* Interactive Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="text-lg px-8 group hover:scale-105 transition-all duration-300"
              onClick={() => onSectionChange("3d")}
            >
              <Globe className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
              Explore 3D Earth
              <Sparkles className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent group hover:scale-105 transition-all duration-300"
              onClick={() => onSectionChange("dashboard")}
            >
              <Activity className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              View Live Data
              <TrendingUp className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>

            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent group hover:scale-105 transition-all duration-300"
              onClick={() => onSectionChange("safety")}
            >
              <Shield className="w-5 h-5 mr-2 group-hover:animate-bounce" />
              Safety Predictions
              <Zap className="w-4 h-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </Button>
          </div>

          {/* Interactive Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <Card
                key={feature.id}
                className={`group cursor-pointer transition-all duration-500 hover:scale-105 hover:-translate-y-2 hover:shadow-2xl ${
                  isLoaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                }`}
                style={{
                  transitionDelay: `${index * 100}ms`,
                  background:
                    hoveredCard === feature.id
                      ? `linear-gradient(135deg, ${feature.color.split(" ")[1]}, ${feature.color.split(" ")[3]})`
                      : undefined,
                }}
                onMouseEnter={() => setHoveredCard(feature.id)}
                onMouseLeave={() => setHoveredCard(null)}
                onClick={() => onSectionChange(feature.section)}
              >
                <CardContent className="p-6 text-center relative overflow-hidden">
                  {/* Animated Background Gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}
                  />

                  {/* Icon with Animation */}
                  <div className="relative mb-4">
                    <feature.icon
                      className={`w-12 h-12 mx-auto transition-all duration-300 ${
                        hoveredCard === feature.id
                          ? "text-white scale-110 rotate-12"
                          : "text-primary group-hover:scale-110 group-hover:rotate-6"
                      }`}
                    />

                    {/* Pulse Effect */}
                    <div
                      className={`absolute inset-0 rounded-full bg-primary/20 animate-ping ${
                        hoveredCard === feature.id ? "opacity-100" : "opacity-0"
                      } transition-opacity duration-300`}
                    />
                  </div>

                  <h3
                    className={`text-xl font-bold mb-2 transition-colors duration-300 ${
                      hoveredCard === feature.id ? "text-white" : "text-foreground"
                    }`}
                  >
                    {feature.title}
                  </h3>

                  <p
                    className={`transition-colors duration-300 ${
                      hoveredCard === feature.id ? "text-white/90" : "text-muted-foreground"
                    }`}
                  >
                    {feature.description}
                  </p>

                  {/* Interactive Indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <MousePointer2 className="w-4 h-4 text-primary animate-bounce" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-primary/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-primary/50 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  )
}

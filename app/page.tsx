"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Satellite, Activity } from "lucide-react"
import Earth3D from "@/components/earth-3d"
import RealTimeDashboard from "@/components/real-time-dashboard"
import EnvironmentalMonitoring from "@/components/environmental-monitoring"
import InteractiveFeatures from "@/components/interactive-features"
import TeamSection from "@/components/team-section"
import BusinessModelShowcase from "@/components/business-model-showcase"

// NASA API integration hook
function useNASAData() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulated NASA API call - replace with actual NASA API endpoints
    const fetchNASAData = async () => {
      try {
        // Example: NASA Earth Imagery API, MODIS data, etc.
        const response = await fetch("/api/nasa-data")
        if (response.ok) {
          const result = await response.json()
          setData(result)
        }
      } catch (error) {
        console.log("[v0] NASA API simulation - replace with real endpoints")
      } finally {
        setLoading(false)
      }
    }

    fetchNASAData()
  }, [])

  return { data, loading }
}

export default function HomePage() {
  const { data: nasaData, loading } = useNASAData()
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/10" />
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4">
          <Badge variant="secondary" className="mb-4">
            <Satellite className="w-4 h-4 mr-2" />
            NASA Space Apps Challenge 2025
          </Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance">LEO Environmental Lab</h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 text-pretty">
            AI-Powered Geospatial Intelligence for Real-Time Environmental Monitoring
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8" onClick={() => setActiveSection("3d")}>
              <Globe className="w-5 h-5 mr-2" />
              Explore 3D Earth
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="text-lg px-8 bg-transparent"
              onClick={() => setActiveSection("dashboard")}
            >
              <Activity className="w-5 h-5 mr-2" />
              View Live Data
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content Tabs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-7 mb-12">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="dashboard">Live Dashboard</TabsTrigger>
              <TabsTrigger value="monitoring">Environmental</TabsTrigger>
              <TabsTrigger value="3d">3D Visualization</TabsTrigger>
              <TabsTrigger value="interactive">Interactive</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
              <TabsTrigger value="business">Business Model</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4">Environmental Intelligence Platform</h2>
                <p className="text-xl text-muted-foreground">Comprehensive monitoring powered by NASA satellite data</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="text-center">
                  <CardContent className="p-8">
                    <Satellite className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">Satellite Integration</h3>
                    <p className="text-muted-foreground">Real-time data from MODIS, Landsat, and Sentinel satellites</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">AI Analytics</h3>
                    <p className="text-muted-foreground">Machine learning models for environmental change detection</p>
                  </CardContent>
                </Card>

                <Card className="text-center">
                  <CardContent className="p-8">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-primary" />
                    <h3 className="text-xl font-bold mb-2">3D Visualization</h3>
                    <p className="text-muted-foreground">Interactive Earth models with real-time data layers</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="dashboard">
              <RealTimeDashboard />
            </TabsContent>

            <TabsContent value="monitoring">
              <EnvironmentalMonitoring />
            </TabsContent>

            <TabsContent value="3d">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4">Interactive 3D Earth</h2>
                <p className="text-xl text-muted-foreground">Explore environmental data in three dimensions</p>
              </div>
              <Earth3D />
            </TabsContent>

            <TabsContent value="interactive">
              <InteractiveFeatures />
            </TabsContent>

            <TabsContent value="team">
              <TeamSection />
            </TabsContent>

            <TabsContent value="business">
              <BusinessModelShowcase />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

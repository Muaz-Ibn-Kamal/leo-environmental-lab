"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Satellite, Activity, Shield } from "lucide-react"
import dynamic from "next/dynamic"
import RealTimeDashboard from "@/components/real-time-dashboard"
import EnvironmentalMonitoring from "@/components/environmental-monitoring"
import InteractiveFeatures from "@/components/interactive-features"
import TeamSection from "@/components/team-section"
import BusinessModelShowcase from "@/components/business-model-showcase"
import NASAResourcesDashboard from "@/components/nasa-resources-dashboard"
import SafetyPredictionDashboard from "@/components/safety-prediction-dashboard"
import SystemStatus from "@/components/system-status"
import InteractiveHero from "@/components/interactive-hero"
import GISMappingDashboard from "@/components/gis-mapping-dashboard"

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

const Earth3D = dynamic(() => import("@/components/earth-3d"), {
  ssr: false,
  loading: () => (
    <Card className="h-[600px] bg-gradient-to-br from-primary/5 to-accent/5">
      <CardContent className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <h3 className="text-2xl font-bold mb-3">Loading 3D Earth</h3>
          <p className="text-muted-foreground">Preparing interactive visualization...</p>
        </div>
      </CardContent>
    </Card>
  ),
})

export default function HomePage() {
  const { data: nasaData, loading } = useNASAData()
  const [activeSection, setActiveSection] = useState("overview")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <InteractiveHero onSectionChange={setActiveSection} />

      {/* Main Content Tabs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeSection} onValueChange={setActiveSection} className="w-full">
            <TabsList className="grid w-full grid-cols-11 mb-12 transition-all duration-300">
              <TabsTrigger value="overview" className="transition-all duration-200 hover:scale-105">
                Overview
              </TabsTrigger>
              <TabsTrigger value="nasa-resources" className="transition-all duration-200 hover:scale-105">
                NASA Resources
              </TabsTrigger>
              <TabsTrigger value="dashboard" className="transition-all duration-200 hover:scale-105">
                Live Dashboard
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="transition-all duration-200 hover:scale-105">
                Environmental
              </TabsTrigger>
              <TabsTrigger value="gis-mapping" className="transition-all duration-200 hover:scale-105">
                GIS Mapping
              </TabsTrigger>
              <TabsTrigger value="3d" className="transition-all duration-200 hover:scale-105">
                3D Visualization
              </TabsTrigger>
              <TabsTrigger value="safety" className="transition-all duration-200 hover:scale-105">
                Safety Predictions
              </TabsTrigger>
              <TabsTrigger value="interactive" className="transition-all duration-200 hover:scale-105">
                Interactive
              </TabsTrigger>
              <TabsTrigger value="status" className="transition-all duration-200 hover:scale-105">
                System Status
              </TabsTrigger>
              <TabsTrigger value="team" className="transition-all duration-200 hover:scale-105">
                Team
              </TabsTrigger>
              <TabsTrigger value="business" className="transition-all duration-200 hover:scale-105">
                Business Model
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12 animate-in fade-in-50 duration-500">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Environmental Intelligence Platform
                </h2>
                <p className="text-xl text-muted-foreground">Comprehensive monitoring powered by NASA satellite data</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <Card className="text-center group hover:scale-105 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <Satellite className="w-12 h-12 mx-auto mb-4 text-primary group-hover:animate-pulse" />
                    <h3 className="text-xl font-bold mb-2">Satellite Integration</h3>
                    <p className="text-muted-foreground">Real-time data from MODIS, Landsat, and Sentinel satellites</p>
                  </CardContent>
                </Card>

                <Card className="text-center group hover:scale-105 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <Activity className="w-12 h-12 mx-auto mb-4 text-primary group-hover:animate-pulse" />
                    <h3 className="text-xl font-bold mb-2">AI Analytics</h3>
                    <p className="text-muted-foreground">Machine learning models for environmental change detection</p>
                  </CardContent>
                </Card>

                <Card className="text-center group hover:scale-105 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <Globe className="w-12 h-12 mx-auto mb-4 text-primary group-hover:animate-spin" />
                    <h3 className="text-xl font-bold mb-2">3D Visualization</h3>
                    <p className="text-muted-foreground">Interactive Earth models with real-time data layers</p>
                  </CardContent>
                </Card>

                <Card className="text-center group hover:scale-105 hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-8">
                    <Shield className="w-12 h-12 mx-auto mb-4 text-primary group-hover:animate-bounce" />
                    <h3 className="text-xl font-bold mb-2">Safety Predictions</h3>
                    <p className="text-muted-foreground">AI-powered risk assessment and early warning systems</p>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="nasa-resources" className="animate-in fade-in-50 duration-500">
              <NASAResourcesDashboard />
            </TabsContent>

            <TabsContent value="dashboard" className="animate-in fade-in-50 duration-500">
              <RealTimeDashboard />
            </TabsContent>

            <TabsContent value="monitoring" className="animate-in fade-in-50 duration-500">
              <EnvironmentalMonitoring />
            </TabsContent>

            <TabsContent value="gis-mapping" className="animate-in fade-in-50 duration-500">
              <GISMappingDashboard />
            </TabsContent>

            <TabsContent value="3d" className="animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Interactive 3D Earth
                </h2>
                <p className="text-xl text-muted-foreground">Explore environmental data in three dimensions</p>
              </div>
              <Earth3D />
            </TabsContent>

            <TabsContent value="safety" className="animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  AI Safety Predictions
                </h2>
                <p className="text-xl text-muted-foreground">
                  Advanced risk assessment and environmental safety forecasting
                </p>
              </div>
              <SafetyPredictionDashboard />
            </TabsContent>

            <TabsContent value="interactive" className="animate-in fade-in-50 duration-500">
              <InteractiveFeatures />
            </TabsContent>

            <TabsContent value="status" className="animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  System Status
                </h2>
                <p className="text-xl text-muted-foreground">
                  Real-time monitoring of all LEO Environmental Lab systems
                </p>
              </div>
              <SystemStatus />
            </TabsContent>

            <TabsContent value="team" className="animate-in fade-in-50 duration-500">
              <TeamSection />
            </TabsContent>

            <TabsContent value="business" className="animate-in fade-in-50 duration-500">
              <BusinessModelShowcase />
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </div>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Globe, Satellite, Activity, Shield } from "lucide-react"
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
import Earth3D from "@/components/earth-3d"
import SatelliteSources3D from "@/components/satellite-sources-3d"
<<<<<<< HEAD
import ConjunctionDashboard from "@/components/conjunction-dashboard"
import LEOBusinessModel from "@/components/leo-business-model"
import LEOInspectionService from "@/components/leo-inspection-service"
=======
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b

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

<<<<<<< HEAD
  // Handle mobile navigation - redirect conjunctions to safety on mobile
  const handleSectionChange = (section: string) => {
    if (section === "conjunctions" && window.innerWidth < 768) {
      setActiveSection("safety")
    } else {
      setActiveSection(section)
    }
  }

  // Interactive navigation with hover effects and status indicators
  const [hoveredTab, setHoveredTab] = useState<string | null>(null)
  const [projectStatus, setProjectStatus] = useState({
    phase: "Development",
    startYear: 2025,
    endYear: 2026,
    progress: 25,
    status: "Active Development"
  })

  const navigationTabs = [
    { id: "overview", label: "Overview", icon: "", status: "active" },
    { id: "nasa-resources", label: "NASA Resources", icon: "", status: "active" },
    { id: "dashboard", label: "Live Dashboard", icon: "", status: "active" },
    { id: "monitoring", label: "Environmental", icon: "", status: "active" },
    { id: "gis-mapping", label: "GIS Mapping", icon: "", status: "active" },
    { id: "3d", label: "3D Visualization", icon: "", status: "active" },
    { id: "safety", label: "Safety Predictions", icon: "", status: "active" },
    { id: "conjunctions", label: "Conjunctions", icon: "", status: "active" },
    { id: "interactive", label: "Interactive", icon: "", status: "active" },
    { id: "status", label: "System Status", icon: "", status: "active" },
    { id: "team", label: "Team", icon: "", status: "active" },
    { id: "leo-business", label: "LEO Business", icon: "", status: "planning" },
    { id: "inspection-service", label: "Inspection Service", icon: "", status: "planning" }
  ]

=======
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <InteractiveHero onSectionChange={setActiveSection} />

<<<<<<< HEAD
      {/* Project Status Banner */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-blue-700">Project Status: {projectStatus.status}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Phase: {projectStatus.phase} ({projectStatus.startYear} - {projectStatus.endYear})
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Progress:</span>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${projectStatus.progress}%` }}
                  ></div>
                </div>
                <span className="text-sm font-medium">{projectStatus.progress}%</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>LEO Environmental Lab 2025</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Tabs */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeSection} onValueChange={handleSectionChange} className="w-full">
            <TabsList className="w-full mb-12 transition-all duration-300 overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2 md:gap-0 md:grid md:grid-cols-12 lg:grid-cols-13">
              {navigationTabs.map((tab) => (
                <TabsTrigger 
                  key={tab.id}
                  value={tab.id} 
                  className={`
                    transition-all duration-300 hover:scale-105 relative group
                    ${tab.id === "conjunctions" ? "hidden md:flex" : ""}
                    ${tab.status === "planning" ? "opacity-75" : ""}
                  `}
                  onMouseEnter={() => setHoveredTab(tab.id)}
                  onMouseLeave={() => setHoveredTab(null)}
                >
                  <div className="flex items-center gap-2">
                    <span className="hidden sm:inline">{tab.label}</span>
                  </div>
                  
                  {/* Hover Tooltip */}
                  {hoveredTab === tab.id && (
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg z-50 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span>{tab.label}</span>
                      </div>
                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
                    </div>
                  )}
                </TabsTrigger>
              ))}
=======
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
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
            </TabsList>

            <TabsContent value="overview" className="space-y-12 animate-in fade-in-50 duration-500">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Environmental Intelligence Platform
                </h2>
                <p className="text-xl text-muted-foreground">Comprehensive monitoring powered by NASA satellite data</p>
<<<<<<< HEAD
                
                {/* Project Timeline */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border">
                  <h3 className="text-lg font-semibold mb-4 text-blue-700">Project Development Timeline</h3>
                  <div className="flex items-center justify-center gap-8">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                        2025
                      </div>
                      <div className="text-sm font-medium">Development Phase</div>
                      <div className="text-xs text-muted-foreground">Q1-Q4 2025</div>
                    </div>
                    <div className="flex-1 h-0.5 bg-blue-200 relative">
                      <div className="absolute top-1/2 left-0 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2"></div>
                      <div className="absolute top-1/2 right-0 w-3 h-3 bg-green-500 rounded-full transform -translate-y-1/2"></div>
                    </div>
                    <div className="text-center">
                      <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white font-bold text-lg mb-2">
                        2026
                      </div>
                      <div className="text-sm font-medium">Full Deployment</div>
                      <div className="text-xs text-muted-foreground">Q1-Q2 2026</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">
                    LEO Environmental Lab • Active Development 2025 • Full Deployment 2026
                  </div>
                </div>
=======
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
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

              <Tabs defaultValue="earth" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8">
                  <TabsTrigger value="earth" className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Earth Visualization
                  </TabsTrigger>
                  <TabsTrigger value="satellites" className="flex items-center gap-2">
                    <Satellite className="w-4 h-4" />
                    Satellite Data Sources
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="earth">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold mb-2">Interactive Earth with Environmental Data</h3>
                    <p className="text-muted-foreground">
                      Click on countries to explore real-time environmental metrics
                    </p>
                  </div>
                  <Earth3D />
                </TabsContent>

                <TabsContent value="satellites">
                  <div className="text-center mb-4">
                    <h3 className="text-2xl font-bold mb-2">Our Satellite Data Network</h3>
                    <p className="text-muted-foreground">
                      Discover why we use each satellite for environmental monitoring
                    </p>
                  </div>
                  <SatelliteSources3D />
                </TabsContent>
              </Tabs>
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

<<<<<<< HEAD
            <TabsContent value="conjunctions" className="animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  Conjunction Monitor
                </h2>
                <p className="text-xl text-muted-foreground">Near-term CDMs and risk assessment</p>
              </div>
              <ConjunctionDashboard />
            </TabsContent>

=======
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
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
<<<<<<< HEAD

            <TabsContent value="leo-business" className="animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LEO Business Model
                </h2>
                <p className="text-xl text-muted-foreground">
                  Scalable, Sustainable Business Model for Low Earth Orbit Operations
                </p>
              </div>
              <LEOBusinessModel />
            </TabsContent>

            <TabsContent value="inspection-service" className="animate-in fade-in-50 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  LEO Inspection-as-a-Service
                </h2>
                <p className="text-xl text-muted-foreground">
                  Real-time Satellite Health Monitoring & Predictive Maintenance
                </p>
              </div>
              <LEOInspectionService />
            </TabsContent>
=======
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
          </Tabs>
        </div>
      </section>
    </div>
  )
}

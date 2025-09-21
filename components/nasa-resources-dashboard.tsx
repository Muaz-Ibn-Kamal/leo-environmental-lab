"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Satellite, Globe, Database, AlertTriangle, Download, ExternalLink } from "lucide-react"
import { NASA_DATA_SOURCES, LEO_BUSINESS_MODELS } from "@/lib/nasa-official-apis"

interface NASADataState {
  worldview: any
  landsat: any
  debris: any
  sentinel: any
  loading: boolean
  lastUpdate: string
}

export default function NASAResourcesDashboard() {
  const [nasaData, setNasaData] = useState<NASADataState>({
    worldview: null,
    landsat: null,
    debris: null,
    sentinel: null,
    loading: true,
    lastUpdate: "",
  })
  const [selectedLocation, setSelectedLocation] = useState({ lat: 23.8103, lng: 90.4125 }) // Dhaka, Bangladesh

  useEffect(() => {
    fetchNASAData()
    const interval = setInterval(fetchNASAData, 300000) // Update every 5 minutes
    return () => clearInterval(interval)
  }, [selectedLocation])

  const fetchNASAData = async () => {
    setNasaData((prev) => ({ ...prev, loading: true }))

    try {
      const response = await fetch(`/api/official-nasa-data?lat=${selectedLocation.lat}&lng=${selectedLocation.lng}`)
      const result = await response.json()

      if (result.success) {
        setNasaData({
          ...result.data,
          loading: false,
          lastUpdate: result.timestamp,
        })
      }
    } catch (error) {
      console.error(" Failed to fetch NASA data:", error)
      setNasaData((prev) => ({ ...prev, loading: false }))
    }
  }

  const getDataFreshness = (timestamp: string) => {
    const now = new Date().getTime()
    const dataTime = new Date(timestamp).getTime()
    const diffMinutes = Math.floor((now - dataTime) / (1000 * 60))

    if (diffMinutes < 60) return { text: `${diffMinutes}m ago`, color: "bg-green-500" }
    if (diffMinutes < 1440) return { text: `${Math.floor(diffMinutes / 60)}h ago`, color: "bg-yellow-500" }
    return { text: `${Math.floor(diffMinutes / 1440)}d ago`, color: "bg-red-500" }
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Official NASA Resources Integration</h2>
        <p className="text-xl text-muted-foreground mb-6">
          Real-time data from NASA Space Apps Challenge 2025 approved sources
        </p>
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {NASA_DATA_SOURCES.map((source, index) => (
            <Badge key={index} variant="outline" className="text-sm">
              {source.name}
            </Badge>
          ))}
        </div>
      </div>

      <Tabs defaultValue="live-data" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="live-data">Live Data</TabsTrigger>
          <TabsTrigger value="business-models">LEO Business</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        <TabsContent value="live-data" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  NASA Worldview
                </CardTitle>
                <CardDescription>Near real-time imagery</CardDescription>
              </CardHeader>
              <CardContent>
                {nasaData.loading ? (
                  <Progress value={66} className="mb-4" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Status</span>
                      <Badge variant="outline" className="text-green-600">
                        {nasaData.worldview?.source || "Loading..."}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Update</span>
                      <span className="text-xs text-muted-foreground">
                        {nasaData.lastUpdate ? getDataFreshness(nasaData.lastUpdate).text : "N/A"}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Imagery
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  USGS Landsat
                </CardTitle>
                <CardDescription>50+ years archive</CardDescription>
              </CardHeader>
              <CardContent>
                {nasaData.loading ? (
                  <Progress value={45} className="mb-4" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Scenes</span>
                      <Badge variant="outline">{nasaData.landsat?.scenes?.length || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cloud Cover</span>
                      <span className="text-xs text-muted-foreground">
                        {nasaData.landsat?.scenes?.[0]?.cloudCover || 0}%
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <Download className="w-4 h-4 mr-2" />
                      Download Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Orbital Debris
                </CardTitle>
                <CardDescription>ODPO tracking</CardDescription>
              </CardHeader>
              <CardContent>
                {nasaData.loading ? (
                  <Progress value={80} className="mb-4" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Objects</span>
                      <Badge variant="outline">{nasaData.debris?.debrisObjects?.length || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Risk Level</span>
                      <Badge variant="outline" className="text-green-600">
                        {nasaData.debris?.riskAssessment?.riskLevel || "LOW"}
                      </Badge>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <Globe className="w-4 h-4 mr-2" />
                      View Tracking
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Satellite className="w-5 h-5" />
                  Copernicus
                </CardTitle>
                <CardDescription>Sentinel satellites</CardDescription>
              </CardHeader>
              <CardContent>
                {nasaData.loading ? (
                  <Progress value={90} className="mb-4" />
                ) : (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Products</span>
                      <Badge variant="outline">{nasaData.sentinel?.products?.length || 0}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Satellite</span>
                      <span className="text-xs text-muted-foreground">
                        {nasaData.sentinel?.satellite || "sentinel-2"}
                      </span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access Data
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="business-models" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {LEO_BUSINESS_MODELS.map((model, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-xl">{model.category}</CardTitle>
                  <CardDescription>{model.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">Applications:</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.applications.map((app, i) => (
                        <Badge key={i} variant="secondary">
                          {app}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Sustainability Focus:</h4>
                    <div className="flex flex-wrap gap-2">
                      {model.sustainability_focus.map((focus, i) => (
                        <Badge key={i} variant="outline">
                          {focus}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Debris Mitigation</CardTitle>
                <CardDescription>Active debris removal strategies</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Collision Risk</span>
                    <Badge variant="outline" className="text-green-600">
                      LOW
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>End-of-Life Planning</span>
                    <Badge variant="outline" className="text-blue-600">
                      ACTIVE
                    </Badge>
                  </div>
                  <Progress value={85} className="mt-4" />
                  <p className="text-sm text-muted-foreground">85% compliance with guidelines</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Resource Efficiency</CardTitle>
                <CardDescription>Optimal orbital usage</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Orbital Slots</span>
                    <Badge variant="outline">OPTIMIZED</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Power Usage</span>
                    <Badge variant="outline" className="text-green-600">
                      EFFICIENT
                    </Badge>
                  </div>
                  <Progress value={92} className="mt-4" />
                  <p className="text-sm text-muted-foreground">92% efficiency rating</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>International Cooperation</CardTitle>
                <CardDescription>Global partnerships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>NASA Partnership</span>
                    <Badge variant="outline" className="text-blue-600">
                      ACTIVE
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>ESA Collaboration</span>
                    <Badge variant="outline" className="text-blue-600">
                      ACTIVE
                    </Badge>
                  </div>
                  <Progress value={78} className="mt-4" />
                  <p className="text-sm text-muted-foreground">78% partnership coverage</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {NASA_DATA_SOURCES.map((source, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-lg">{source.name}</CardTitle>
                  <CardDescription>{source.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Type</span>
                      <Badge variant="outline">{source.dataType}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Update Frequency</span>
                      <span className="text-xs text-muted-foreground">{source.updateFrequency}</span>
                    </div>
                    <Button size="sm" variant="outline" className="w-full bg-transparent">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access Resource
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

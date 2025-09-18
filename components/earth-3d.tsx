"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { TextureLoader, Raycaster, Vector2, Vector3 } from "three"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MapPin,
  Activity,
  Globe,
  Search,
  Download,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  Thermometer,
  Droplets,
  Wind,
  TreePine,
  Factory,
  Fish,
} from "lucide-react"

const COUNTRIES = {
  BD: { name: "Bangladesh", coords: [23.685, 90.3563], flag: "🇧🇩" },
  US: { name: "United States", coords: [39.8283, -98.5795], flag: "🇺🇸" },
  IN: { name: "India", coords: [20.5937, 78.9629], flag: "🇮🇳" },
  CN: { name: "China", coords: [35.8617, 104.1954], flag: "🇨🇳" },
  BR: { name: "Brazil", coords: [-14.235, -51.9253], flag: "🇧🇷" },
  RU: { name: "Russia", coords: [61.524, 105.3188], flag: "🇷🇺" },
  CA: { name: "Canada", coords: [56.1304, -106.3468], flag: "🇨🇦" },
  AU: { name: "Australia", coords: [-25.2744, 133.7751], flag: "🇦🇺" },
  DE: { name: "Germany", coords: [51.1657, 10.4515], flag: "🇩🇪" },
  FR: { name: "France", coords: [46.2276, 2.2137], flag: "🇫🇷" },
  GB: { name: "United Kingdom", coords: [55.3781, -3.436], flag: "🇬🇧" },
  JP: { name: "Japan", coords: [36.2048, 138.2529], flag: "🇯🇵" },
  KR: { name: "South Korea", coords: [35.9078, 127.7669], flag: "🇰🇷" },
  MX: { name: "Mexico", coords: [23.6345, -102.5528], flag: "🇲🇽" },
  AR: { name: "Argentina", coords: [-38.4161, -63.6167], flag: "🇦🇷" },
  ZA: { name: "South Africa", coords: [-30.5595, 22.9375], flag: "🇿🇦" },
  EG: { name: "Egypt", coords: [26.0975, 30.0444], flag: "🇪🇬" },
  NG: { name: "Nigeria", coords: [9.082, 8.6753], flag: "🇳🇬" },
  KE: { name: "Kenya", coords: [-0.0236, 37.9062], flag: "🇰🇪" },
  TH: { name: "Thailand", coords: [15.87, 100.9925], flag: "🇹🇭" },
}

function latLonToVector3(lat: number, lon: number, radius = 2): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new Vector3(x, y, z)
}

function Earth({
  activeLayer,
  rotationSpeed,
  showHeatmap,
  timeOfDay,
  onCountryClick,
  selectedCountry,
}: {
  activeLayer: string
  rotationSpeed: number
  showHeatmap: boolean
  timeOfDay: number
  onCountryClick: (countryCode: string, coords: [number, number]) => void
  selectedCountry: string | null
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [textureError, setTextureError] = useState(false)
  const { camera, gl } = useThree()
  const earthTexture = useLoader(TextureLoader, "/earth-texture-blue-green-continents.jpg")

  useEffect(() => {
    if (!earthTexture) {
      console.log("[v0] Texture loading failed, using fallback")
      setTextureError(true)
    }
  }, [earthTexture])

  // Rotate the Earth with variable speed
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  const handleClick = (event: React.PointerEvent) => {
    // event.stopPropagation() // Removed because THREE.Event does not have stopPropagation

    if (typeof window === "undefined" || !gl?.domElement) return

    const raycaster = new Raycaster()
    const mouse = new Vector2()

    // Convert click position to normalized device coordinates
    const rect = gl.domElement.getBoundingClientRect()
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

    raycaster.setFromCamera(mouse, camera)

    if (meshRef.current) {
      const intersects = raycaster.intersectObject(meshRef.current)
      if (intersects.length > 0) {
        const point = intersects[0].point

        // Convert 3D point back to lat/lon
        const lat = Math.asin(point.y / 2) * (180 / Math.PI)
        const lon = Math.atan2(point.z, -point.x) * (180 / Math.PI)

        // Find nearest country
        let nearestCountry = "US"
        let minDistance = Number.POSITIVE_INFINITY

        Object.entries(COUNTRIES).forEach(([code, country]) => {
          const distance = Math.sqrt(Math.pow(lat - country.coords[0], 2) + Math.pow(lon - country.coords[1], 2))
          if (distance < minDistance) {
            minDistance = distance
            nearestCountry = code
          }
        })

        onCountryClick(nearestCountry, [lat, lon])
      }
    }
  }

  const getEarthMaterial = () => {
    const baseIntensity = 0.1 + (timeOfDay / 100) * 0.3

    const texture = textureError ? null : earthTexture

    switch (activeLayer) {
      case "deforestation":
        return (
          <meshStandardMaterial
            map={texture}
            color="#ff6b6b"
            transparent
            opacity={0.8}
            emissive="#ff2222"
            emissiveIntensity={showHeatmap ? 0.3 : baseIntensity}
          />
        )
      case "temperature":
        return (
          <meshStandardMaterial
            map={texture}
            color="#ff4444"
            emissive="#ff2222"
            emissiveIntensity={showHeatmap ? 0.4 : baseIntensity}
            roughness={0.3}
          />
        )
      case "water":
        return (
          <meshStandardMaterial
            map={texture}
            color="#4dabf7"
            transparent
            opacity={0.9}
            emissive="#0066cc"
            emissiveIntensity={showHeatmap ? 0.2 : baseIntensity}
          />
        )
      case "carbon":
        return (
          <meshStandardMaterial
            map={texture}
            color="#51cf66"
            transparent
            opacity={0.85}
            emissive="#22cc44"
            emissiveIntensity={showHeatmap ? 0.25 : baseIntensity}
          />
        )
      default:
        return <meshStandardMaterial map={texture} emissiveIntensity={baseIntensity} color="#4a90e2" />
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      onClick={handleClick}
      scale={hovered ? 1.02 : 1}
    >
      <sphereGeometry args={[2, 128, 128]} />
      {getEarthMaterial()}
    </mesh>
  )
}

function CountryMarkers({
  selectedCountry,
  onCountrySelect,
  showLabels,
}: {
  selectedCountry: string | null
  onCountrySelect: (countryCode: string) => void
  showLabels: boolean
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  return (
    <group ref={groupRef}>
      {Object.entries(COUNTRIES).map(([code, country]) => {
        const position = latLonToVector3(country.coords[0], country.coords[1], 2.1)
        const isSelected = selectedCountry === code

        return (
          <group key={code}>
            {/* Country marker */}
            <mesh position={[position.x, position.y, position.z]} onClick={() => onCountrySelect(code)}>
              <sphereGeometry args={[isSelected ? 0.08 : 0.05, 16, 16]} />
              <meshStandardMaterial
                color={isSelected ? "#fbbf24" : "#06b6d4"}
                emissive={isSelected ? "#f59e0b" : "#0891b2"}
                emissiveIntensity={isSelected ? 0.8 : 0.4}
              />
            </mesh>

            {/* Country label */}
            {(showLabels || isSelected) && (
              <Html position={[position.x, position.y + 0.2, position.z]}>
                <div
                  className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition-all ${
                    isSelected
                      ? "bg-yellow-500 text-black scale-110 shadow-lg"
                      : "bg-black/80 text-white hover:bg-black/90"
                  }`}
                  onClick={() => onCountrySelect(code)}
                >
                  <div className="flex items-center gap-1">
                    <span>{country.flag}</span>
                    <span>{country.name}</span>
                  </div>
                </div>
              </Html>
            )}
          </group>
        )
      })}
    </group>
  )
}

function DataPoints({ activeLayer, showLabels }: { activeLayer: string; showLabels: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
  })

  const dataPoints = [
    { position: [3, 1, 0], type: "deforestation", value: "2.3%", location: "Amazon Basin", severity: "high" },
    { position: [-2.5, 2, 1], type: "temperature", value: "+1.1°C", location: "Arctic Circle", severity: "critical" },
    { position: [1, -2.5, 2], type: "water", value: "87%", location: "Great Lakes", severity: "good" },
    { position: [-1.5, 0, -3], type: "carbon", value: "421ppm", location: "Southeast Asia", severity: "warning" },
    { position: [2, 2.5, -1], type: "deforestation", value: "1.8%", location: "Congo Basin", severity: "medium" },
    { position: [-3, -1, 0.5], type: "temperature", value: "+0.9°C", location: "Siberia", severity: "high" },
    { position: [0, 3, 1.5], type: "water", value: "62%", location: "Mediterranean", severity: "warning" },
    {
      position: [2.8, -1.5, -0.5],
      type: "carbon",
      value: "435ppm",
      location: "Industrial China",
      severity: "critical",
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-600 text-white"
      case "high":
        return "bg-red-500 text-white"
      case "warning":
        return "bg-yellow-500 text-black"
      case "medium":
        return "bg-orange-500 text-white"
      case "good":
        return "bg-green-500 text-white"
      default:
        return "bg-gray-500 text-white"
    }
  }

  return (
    <group ref={groupRef}>
      {dataPoints.map((point, index) => (
        <Html key={index} position={point.position as [number, number, number]}>
          <div
            className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer transform hover:scale-110 ${
              activeLayer === point.type || activeLayer === "all"
                ? `${getSeverityColor(point.severity)} scale-100 opacity-100 shadow-lg`
                : "bg-muted text-muted-foreground scale-75 opacity-50"
            } ${selectedPoint === index ? "ring-2 ring-white" : ""}`}
            onClick={() => setSelectedPoint(selectedPoint === index ? null : index)}
          >
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              {point.value}
            </div>
            {(showLabels || selectedPoint === index) && <div className="text-xs mt-1 opacity-90">{point.location}</div>}
          </div>
        </Html>
      ))}
    </group>
  )
}

function CountryDataPanel({
  countryCode,
  onClose,
}: {
  countryCode: string | null
  onClose: () => void
}) {
  const [countryData, setCountryData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("current")

  useEffect(() => {
    if (countryCode) {
      fetchCountryData(countryCode)
    }
  }, [countryCode])

  const fetchCountryData = async (code: string) => {
    setLoading(true)
    try {
      console.log("[v0] Fetching country data for:", code)

      setCountryData(generateSimulatedCountryData(code))
    } catch (error) {
      console.error("[v0] Error fetching country data:", error)
      setCountryData(generateSimulatedCountryData(code))
    } finally {
      setLoading(false)
    }
  }

  const generateSimulatedCountryData = (code: string) => {
    const country = COUNTRIES[code as keyof typeof COUNTRIES]
    return {
      country: country.name,
      countryCode: code,
      coordinates: country.coords,
      currentData: {
        temperature: 25 + Math.random() * 15,
        humidity: 50 + Math.random() * 40,
        airQuality: 80 + Math.random() * 100,
        deforestation: Math.random() * 40,
        carbonEmission: 40 + Math.random() * 60,
        waterQuality: 40 + Math.random() * 50,
        biodiversity: 40 + Math.random() * 50,
      },
      safetyAnalysis: {
        currentRisk: Math.random() > 0.7 ? "high" : Math.random() > 0.4 ? "medium" : "low",
        futureRisk: Math.random() > 0.6 ? "high" : Math.random() > 0.3 ? "medium" : "low",
        riskFactors: ["Climate change impacts", "Environmental degradation"],
        recommendations: ["Implement monitoring systems", "Develop adaptation strategies"],
      },
    }
  }

  const downloadData = () => {
    if (countryData && typeof window !== "undefined") {
      const dataStr = JSON.stringify(countryData, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `${countryData.country}_environmental_data.json`
      link.click()
      URL.revokeObjectURL(url)
    }
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "critical":
        return "text-red-600 bg-red-100"
      case "high":
        return "text-red-500 bg-red-50"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "low":
        return "text-green-600 bg-green-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getMetricIcon = (metric: string) => {
    switch (metric) {
      case "temperature":
        return <Thermometer className="w-4 h-4" />
      case "humidity":
        return <Droplets className="w-4 h-4" />
      case "airQuality":
        return <Wind className="w-4 h-4" />
      case "deforestation":
        return <TreePine className="w-4 h-4" />
      case "carbonEmission":
        return <Factory className="w-4 h-4" />
      case "waterQuality":
        return <Fish className="w-4 h-4" />
      default:
        return <Activity className="w-4 h-4" />
    }
  }

  const getMetricTrend = (value: number) => {
    if (value > 70) return <TrendingUp className="w-4 h-4 text-red-500" />
    if (value < 30) return <TrendingDown className="w-4 h-4 text-green-500" />
    return <Minus className="w-4 h-4 text-yellow-500" />
  }

  if (!countryCode || !countryData) return null

  const country = COUNTRIES[countryCode as keyof typeof COUNTRIES]

  return (
    <Card className="w-96 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span className="text-2xl">{country.flag}</span>
            <span>{country.name}</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={downloadData}>
              <Download className="w-4 h-4" />
            </Button>
            <Button size="sm" variant="outline" onClick={onClose}>
              ×
            </Button>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          {country.coords[0].toFixed(2)}°, {country.coords[1].toFixed(2)}°
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="current">Current</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
              <TabsTrigger value="safety">Safety</TabsTrigger>
            </TabsList>

            <TabsContent value="current" className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {Object.entries(countryData.currentData).map(([metric, value]) => (
                  <div key={metric} className="p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        {getMetricIcon(metric)}
                        <span className="text-xs font-medium capitalize">
                          {metric.replace(/([A-Z])/g, " $1").trim()}
                        </span>
                      </div>
                      {getMetricTrend(value as number)}
                    </div>
                    <div className="text-lg font-bold">
                      {typeof value === "number" ? (value as number).toFixed(1) : String(value)}
                      {metric === "temperature" && "°C"}
                      {metric === "humidity" && "%"}
                      {metric.includes("Quality") && "%"}
                      {metric.includes("deforestation") && "%"}
                      {metric.includes("carbon") && " ppm"}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-3">
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>Historical trends and AI predictions</p>
                <p className="text-xs">Coming from time-series analysis</p>
              </div>
            </TabsContent>

            <TabsContent value="safety" className="space-y-3">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Current Risk Level</span>
                  <Badge className={getRiskColor(countryData.safetyAnalysis.currentRisk)}>
                    {countryData.safetyAnalysis.currentRisk.toUpperCase()}
                  </Badge>
                </div>

                <div className="flex items-center justify-between">
                  <span className="font-medium">Future Risk Level</span>
                  <Badge className={getRiskColor(countryData.safetyAnalysis.futureRisk)}>
                    {countryData.safetyAnalysis.futureRisk.toUpperCase()}
                  </Badge>
                </div>

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" />
                    Risk Factors
                  </h4>
                  <ul className="text-sm space-y-1">
                    {countryData.safetyAnalysis.riskFactors.map((factor: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        {factor}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Recommendations</h4>
                  <ul className="text-sm space-y-1">
                    {countryData.safetyAnalysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="w-1 h-1 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  )
}

export default function Earth3D() {
  const [activeLayer, setActiveLayer] = useState("all")
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(0.1)
  const [timeOfDay, setTimeOfDay] = useState(50)
  const [showAdvancedControls, setShowAdvancedControls] = useState(false)

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCountryPanel, setShowCountryPanel] = useState(false)
  const [clientReady, setClientReady] = useState(false)

  useEffect(() => {
    setClientReady(true)
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const handleCountryClick = (countryCode: string, coords: [number, number]) => {
    console.log("[v0] Country selected:", countryCode, coords)
    setSelectedCountry(countryCode)
    setShowCountryPanel(true)
  }

  const handleCountrySelect = (countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowCountryPanel(true)
  }

  const filteredCountries = Object.entries(COUNTRIES).filter(([code, country]) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const layers = [
    { id: "all", name: "All Layers", color: "bg-primary", icon: Globe },
    { id: "deforestation", name: "Deforestation", color: "bg-red-500", icon: TreePine },
    { id: "temperature", name: "Temperature", color: "bg-orange-500", icon: Thermometer },
    { id: "water", name: "Water Quality", color: "bg-blue-500", icon: Fish },
    { id: "carbon", name: "Carbon Levels", color: "bg-green-500", icon: Factory },
  ]

  if (!clientReady) {
    return (
      <Card className="h-[600px] bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <h3 className="text-2xl font-bold mb-3">Initializing Client</h3>
            <p className="text-muted-foreground mb-4">Preparing 3D visualization...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="h-[600px] bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <h3 className="text-2xl font-bold mb-3">Initializing 3D Earth</h3>
            <p className="text-muted-foreground mb-4">Loading satellite data and environmental layers...</p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.1s" }} />
              <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card className="h-[600px] overflow-hidden">
        <CardContent className="p-0 h-full relative">
          <div className="w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              onCreated={({ gl }) => {
                gl.setClearColor("#000011")
              }}
            >
              <ambientLight intensity={0.3 + (timeOfDay / 100) * 0.4} />
              <pointLight position={[10, 10, 10]} intensity={0.8 + (timeOfDay / 100) * 0.5} />
              <pointLight position={[-10, -10, -10]} intensity={0.3 + (timeOfDay / 100) * 0.2} />
              <spotLight position={[0, 10, 0]} intensity={0.5} angle={Math.PI / 4} />

              <Earth
                activeLayer={activeLayer}
                rotationSpeed={isPlaying ? rotationSpeed : 0}
                showHeatmap={showHeatmap}
                timeOfDay={timeOfDay}
                onCountryClick={handleCountryClick}
                selectedCountry={selectedCountry}
              />

              <CountryMarkers
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
                showLabels={showLabels}
              />

              <DataPoints activeLayer={activeLayer} showLabels={showLabels} />

              <SatelliteOrbits showOrbits={showOrbits} animationSpeed={isPlaying ? 1 : 0} />

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={4}
                maxDistance={20}
                autoRotate={false}
                autoRotateSpeed={0.5}
              />
              <Environment preset="night" />
            </Canvas>
          </div>

          <div className="absolute top-4 left-4 space-y-3">
            <div className="flex flex-wrap gap-2">
              {layers.map((layer) => {
                const IconComponent = layer.icon
                return (
                  <Button
                    key={layer.id}
                    size="sm"
                    variant={activeLayer === layer.id ? "default" : "outline"}
                    onClick={() => setActiveLayer(layer.id)}
                    className="text-xs bg-background/80 backdrop-blur-sm"
                  >
                    <IconComponent className="w-3 h-3 mr-2" />
                    <div className={`w-2 h-2 rounded-full mr-2 ${layer.color}`} />
                    {layer.name}
                  </Button>
                )
              })}
            </div>

            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search countries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-48 bg-background/80 backdrop-blur-sm"
                />
              </div>
              {searchQuery && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-background/95 backdrop-blur-sm rounded-lg border shadow-lg max-h-40 overflow-y-auto z-10">
                  {filteredCountries.map(([code, country]) => (
                    <button
                      key={code}
                      onClick={() => {
                        handleCountrySelect(code)
                        setSearchQuery("")
                      }}
                      className="w-full px-3 py-2 text-left hover:bg-muted/50 flex items-center gap-2"
                    >
                      <span>{country.flag}</span>
                      <span className="text-sm">{country.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {showCountryPanel && selectedCountry && (
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-20">
              <CountryDataPanel
                countryCode={selectedCountry}
                onClose={() => {
                  setShowCountryPanel(false)
                  setSelectedCountry(null)
                }}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function SatelliteOrbits({ showOrbits, animationSpeed }: { showOrbits: boolean; animationSpeed: number }) {
  const orbitRef = useRef<THREE.Group>(null)
  const satelliteRefs = useRef<THREE.Mesh[]>([])

  useFrame((state, delta) => {
    if (orbitRef.current && showOrbits) {
      orbitRef.current.rotation.y += delta * 0.3 * animationSpeed
      orbitRef.current.rotation.x += delta * 0.1 * animationSpeed
    }

    // Animate individual satellites
    satelliteRefs.current.forEach((satellite, index) => {
      if (satellite) {
        satellite.rotation.x += delta * (1 + index * 0.5) * animationSpeed
        satellite.rotation.z += delta * (0.5 + index * 0.3) * animationSpeed
      }
    })
  })

  if (!showOrbits) return null

  return (
    <group ref={orbitRef}>
      {/* Multiple orbit rings */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 3.6, 64]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.4} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[4, 4.1, 64]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <ringGeometry args={[4.5, 4.6, 64]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.2} />
      </mesh>

      {/* Enhanced satellite representations */}
      <mesh position={[3.5, 0, 0]} ref={(el) => el && (satelliteRefs.current[0] = el)}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[-4, 0, 0]} ref={(el) => el && (satelliteRefs.current[1] = el)}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#06b6d4" emissive="#0891b2" emissiveIntensity={0.6} />
      </mesh>
      <mesh position={[0, 4.5, 0]} ref={(el) => el && (satelliteRefs.current[2] = el)}>
        <boxGeometry args={[0.15, 0.15, 0.15]} />
        <meshStandardMaterial color="#10b981" emissive="#059669" emissiveIntensity={0.6} />
      </mesh>

      {/* Satellite labels */}
      <Html position={[3.5, 0.5, 0]}>
        <div className="text-xs text-foreground bg-black/80 px-2 py-1 rounded border border-white/20">MODIS</div>
      </Html>
      <Html position={[-4, 0.5, 0]}>
        <div className="text-xs text-foreground bg-black/80 px-2 py-1 rounded border border-white/20">Landsat</div>
      </Html>
      <Html position={[0, 5, 0]}>
        <div className="text-xs text-foreground bg-black/80 px-2 py-1 rounded border border-white/20">Sentinel</div>
      </Html>
    </group>
  )
}

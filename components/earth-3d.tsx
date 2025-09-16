"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { TextureLoader } from "three"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Zap, Eye, EyeOff, Play, Pause, Settings, MapPin, Activity, Globe } from "lucide-react"

function Earth({
  activeLayer,
  rotationSpeed,
  showHeatmap,
  timeOfDay,
}: {
  activeLayer: string
  rotationSpeed: number
  showHeatmap: boolean
  timeOfDay: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  // Load Earth texture
  const earthTexture = useLoader(TextureLoader, "/assets/3d/texture_earth.jpg")

  // Rotate the Earth with variable speed
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed
    }
  })

  const getEarthMaterial = () => {
    const baseIntensity = 0.1 + (timeOfDay / 100) * 0.3

    switch (activeLayer) {
      case "deforestation":
        return (
          <meshStandardMaterial
            map={earthTexture}
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
            map={earthTexture}
            color="#ff4444"
            emissive="#ff2222"
            emissiveIntensity={showHeatmap ? 0.4 : baseIntensity}
            roughness={0.3}
          />
        )
      case "water":
        return (
          <meshStandardMaterial
            map={earthTexture}
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
            map={earthTexture}
            color="#51cf66"
            transparent
            opacity={0.85}
            emissive="#22cc44"
            emissiveIntensity={showHeatmap ? 0.25 : baseIntensity}
          />
        )
      default:
        return <meshStandardMaterial map={earthTexture} emissiveIntensity={baseIntensity} />
    }
  }

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? 1.05 : 1}
    >
      <sphereGeometry args={[2, 128, 128]} />
      {getEarthMaterial()}
    </mesh>
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

// Main 3D Earth component with enhanced interactivity
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

  useEffect(() => {
    // Simulate loading time for 3D assets
    const timer = setTimeout(() => setIsLoading(false), 2000)
    return () => clearTimeout(timer)
  }, [])

  const layers = [
    { id: "all", name: "All Layers", color: "bg-primary", icon: Globe },
    { id: "deforestation", name: "Deforestation", color: "bg-red-500", icon: Activity },
    { id: "temperature", name: "Temperature", color: "bg-orange-500", icon: Activity },
    { id: "water", name: "Water Quality", color: "bg-blue-500", icon: Activity },
    { id: "carbon", name: "Carbon Levels", color: "bg-green-500", icon: Activity },
  ]

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
          <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
            <ambientLight intensity={0.3 + (timeOfDay / 100) * 0.4} />
            <pointLight position={[10, 10, 10]} intensity={0.8 + (timeOfDay / 100) * 0.5} />
            <pointLight position={[-10, -10, -10]} intensity={0.3 + (timeOfDay / 100) * 0.2} />
            <spotLight position={[0, 10, 0]} intensity={0.5} angle={Math.PI / 4} />

            <Earth
              activeLayer={activeLayer}
              rotationSpeed={isPlaying ? rotationSpeed : 0}
              showHeatmap={showHeatmap}
              timeOfDay={timeOfDay}
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
          </div>

          <div className="absolute top-4 right-4 space-y-2">
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-background/80 backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowOrbits(!showOrbits)}
                className="bg-background/80 backdrop-blur-sm"
              >
                {showOrbits ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {showAdvancedControls && (
            <div className="absolute top-4 right-20 w-64 bg-background/90 backdrop-blur-sm rounded-lg p-4 space-y-4">
              <div className="space-y-2">
                <Label className="text-sm font-medium">Rotation Speed</Label>
                <Slider
                  value={[rotationSpeed * 100]}
                  onValueChange={(value) => setRotationSpeed(value[0] / 100)}
                  max={50}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium">Time of Day</Label>
                <Slider
                  value={[timeOfDay]}
                  onValueChange={(value) => setTimeOfDay(value[0])}
                  max={100}
                  min={0}
                  step={1}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Show Labels</Label>
                <Switch checked={showLabels} onCheckedChange={setShowLabels} />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Heatmap Mode</Label>
                <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} />
              </div>
            </div>
          )}

          <div className="absolute bottom-4 left-4 right-4">
            <Card className="bg-background/90 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1 flex items-center gap-2">
                      <Globe className="w-4 h-4" />
                      {layers.find((l) => l.id === activeLayer)?.name || "Earth Visualization"}
                    </h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      Real-time environmental data from NASA satellites
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Speed: {(rotationSpeed * 100).toFixed(0)}%</span>
                      <span>Time: {timeOfDay}%</span>
                      <span>Satellites: {showOrbits ? "3 Active" : "Hidden"}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      <Zap className="w-3 h-3 mr-1" />
                      Live
                    </Badge>
                    <Badge variant={isPlaying ? "default" : "secondary"}>
                      {isPlaying ? <Play className="w-3 h-3 mr-1" /> : <Pause className="w-3 h-3 mr-1" />}
                      {isPlaying ? "Playing" : "Paused"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

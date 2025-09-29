"use client"

import { useRef, useEffect, useState, useCallback } from "react"
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber"
import { OrbitControls, Environment, Html, Stars, Sparkles as ThreeSparkles } from "@react-three/drei"
import { TextureLoader, Raycaster, Vector2, Vector3 } from "three"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  MapPin,
  Globe,
  Search,
  Download,
  Thermometer,
  Droplets,
  TreePine,
  Factory,
  Fish,
  Zap,
  Sparkles,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Settings,
  Layers,
  Satellite,
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
}

function latLonToVector3(lat: number, lon: number, radius = 2): Vector3 {
  const phi = (90 - lat) * (Math.PI / 180)
  const theta = (lon + 180) * (Math.PI / 180)

  const x = -(radius * Math.sin(phi) * Math.cos(theta))
  const z = radius * Math.sin(phi) * Math.sin(theta)
  const y = radius * Math.cos(phi)

  return new Vector3(x, y, z)
}

function EnhancedEarth({
  activeLayer,
  rotationSpeed,
  showHeatmap,
  timeOfDay,
  onCountryClick,
  selectedCountry,
  visualMode,
  particleIntensity,
}: {
  activeLayer: string
  rotationSpeed: number
  showHeatmap: boolean
  timeOfDay: number
  onCountryClick: (countryCode: string, coords: [number, number]) => void
  selectedCountry: string | null
  visualMode: string
  particleIntensity: number
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const atmosphereRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)
  const [pulsePhase, setPulsePhase] = useState(0)
  const { camera, gl } = useThree()

  const earthTexture = useLoader(TextureLoader, "/earth-texture-blue-green-continents.jpg")

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * rotationSpeed

      setPulsePhase((prev) => prev + delta * 2)
      const scale = 1 + Math.sin(pulsePhase) * 0.02
      meshRef.current.scale.setScalar(hovered ? scale * 1.05 : scale)
    }

    if (atmosphereRef.current) {
      atmosphereRef.current.rotation.y += delta * rotationSpeed * 0.5
      atmosphereRef.current.material.opacity = 0.1 + Math.sin(state.clock.elapsedTime) * 0.05
    }
  })

  const handleClick = useCallback(
    (event: THREE.Event) => {
      event.stopPropagation()
      if (typeof window === "undefined" || !gl?.domElement) return

      const raycaster = new Raycaster()
      const mouse = new Vector2()
      const rect = gl.domElement.getBoundingClientRect()
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1

      raycaster.setFromCamera(mouse, camera)

      if (meshRef.current) {
        const intersects = raycaster.intersectObject(meshRef.current)
        if (intersects.length > 0) {
          const point = intersects[0].point
          const lat = Math.asin(point.y / 2) * (180 / Math.PI)
          const lon = Math.atan2(point.z, -point.x) * (180 / Math.PI)

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
    },
    [camera, gl, onCountryClick],
  )

  const getEarthMaterial = () => {
    const baseIntensity = 0.1 + (timeOfDay / 100) * 0.3
    const emissiveIntensity = showHeatmap ? 0.4 : baseIntensity

    switch (activeLayer) {
      case "deforestation":
        return (
          <meshStandardMaterial
            map={earthTexture}
            color="#ff6b6b"
            transparent
            opacity={0.9}
            emissive="#ff2222"
            emissiveIntensity={emissiveIntensity}
            roughness={0.4}
            metalness={0.1}
          />
        )
      case "temperature":
        return (
          <meshStandardMaterial
            map={earthTexture}
            color="#ff4444"
            emissive="#ff2222"
            emissiveIntensity={emissiveIntensity}
            roughness={0.3}
            metalness={0.2}
          />
        )
      case "water":
        return (
          <meshStandardMaterial
            map={earthTexture}
            color="#4dabf7"
            transparent
            opacity={0.95}
            emissive="#0066cc"
            emissiveIntensity={emissiveIntensity}
            roughness={0.2}
            metalness={0.3}
          />
        )
      case "carbon":
        return (
          <meshStandardMaterial
            map={earthTexture}
            color="#51cf66"
            transparent
            opacity={0.9}
            emissive="#22cc44"
            emissiveIntensity={emissiveIntensity}
            roughness={0.3}
            metalness={0.1}
          />
        )
      default:
        return (
          <meshStandardMaterial
            map={earthTexture}
            emissiveIntensity={baseIntensity}
            color="#4a90e2"
            roughness={0.4}
            metalness={0.1}
          />
        )
    }
  }

  return (
    <group>
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={handleClick}
      >
        <sphereGeometry args={[2, 128, 128]} />
        {getEarthMaterial()}
      </mesh>

      <mesh ref={atmosphereRef} position={[0, 0, 0]}>
        <sphereGeometry args={[2.1, 64, 64]} />
        <meshBasicMaterial color="#4dabf7" transparent opacity={0.1} side={2} />
      </mesh>

      {visualMode === "enhanced" && (
        <ThreeSparkles count={particleIntensity * 100} scale={[8, 8, 8]} size={2} speed={0.5} color="#10b981" />
      )}
    </group>
  )
}

function HolographicCountryMarkers({
  selectedCountry,
  onCountrySelect,
  showLabels,
  visualMode,
}: {
  selectedCountry: string | null
  onCountrySelect: (countryCode: string) => void
  showLabels: boolean
  visualMode: string
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05
    }
    setAnimationPhase((prev) => prev + delta)
  })

  return (
    <group ref={groupRef}>
      {Object.entries(COUNTRIES).map(([code, country]) => {
        const position = latLonToVector3(country.coords[0], country.coords[1], 2.15)
        const isSelected = selectedCountry === code
        const pulseScale = 1 + Math.sin(animationPhase * 3) * 0.2

        return (
          <group key={code}>
            <mesh
              position={[position.x, position.y, position.z]}
              onClick={() => onCountrySelect(code)}
              scale={isSelected ? [pulseScale, pulseScale, pulseScale] : [1, 1, 1]}
            >
              <sphereGeometry args={[isSelected ? 0.12 : 0.08, 16, 16]} />
              <meshStandardMaterial
                color={isSelected ? "#fbbf24" : "#10b981"}
                emissive={isSelected ? "#f59e0b" : "#059669"}
                emissiveIntensity={isSelected ? 1.2 : 0.8}
                transparent
                opacity={0.9}
                roughness={0.1}
                metalness={0.8}
              />
            </mesh>

            {isSelected && visualMode === "enhanced" && (
              <mesh position={[position.x, position.y, position.z]}>
                <cylinderGeometry args={[0.02, 0.02, 1, 8]} />
                <meshBasicMaterial color="#10b981" transparent opacity={0.6} />
              </mesh>
            )}

            {/* Enhanced country labels */}
            {(showLabels || isSelected) && (
              <Html position={[position.x, position.y + 0.25, position.z]}>
                <div
                  className={`px-3 py-2 rounded-lg text-xs font-medium cursor-pointer transition-all duration-300 glass-effect ${
                    isSelected
                      ? "bg-primary text-primary-foreground scale-110 shadow-2xl animate-neon-glow"
                      : "bg-card/80 text-card-foreground hover:bg-card/90 hover-3d"
                  }`}
                  onClick={() => onCountrySelect(code)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{country.flag}</span>
                    <span>{country.name}</span>
                    {isSelected && <Sparkles className="w-3 h-3 animate-spin" />}
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

function QuantumDataPoints({
  activeLayer,
  showLabels,
  visualMode,
  particleIntensity,
}: {
  activeLayer: string
  showLabels: boolean
  visualMode: string
  particleIntensity: number
}) {
  const groupRef = useRef<THREE.Group>(null)
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null)
  const [animationPhase, setAnimationPhase] = useState(0)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.03
    }
    setAnimationPhase((prev) => prev + delta * 2)
  })

  const dataPoints = [
    {
      position: [3.2, 1.2, 0.5],
      type: "deforestation",
      value: "2.3%",
      location: "Amazon Basin",
      severity: "critical",
      icon: TreePine,
    },
    {
      position: [-2.8, 2.1, 1.2],
      type: "temperature",
      value: "+1.1°C",
      location: "Arctic Circle",
      severity: "critical",
      icon: Thermometer,
    },
    {
      position: [1.5, -2.8, 2.2],
      type: "water",
      value: "87%",
      location: "Great Lakes",
      severity: "good",
      icon: Droplets,
    },
    {
      position: [-1.8, 0.5, -3.1],
      type: "carbon",
      value: "421ppm",
      location: "Southeast Asia",
      severity: "warning",
      icon: Factory,
    },
    {
      position: [2.5, 2.8, -1.2],
      type: "deforestation",
      value: "1.8%",
      location: "Congo Basin",
      severity: "high",
      icon: TreePine,
    },
    {
      position: [-3.2, -1.2, 0.8],
      type: "temperature",
      value: "+0.9°C",
      location: "Siberia",
      severity: "high",
      icon: Thermometer,
    },
  ]

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return { bg: "bg-red-600", text: "text-white", glow: "#dc2626" }
      case "high":
        return { bg: "bg-red-500", text: "text-white", glow: "#ef4444" }
      case "warning":
        return { bg: "bg-yellow-500", text: "text-black", glow: "#eab308" }
      case "good":
        return { bg: "bg-green-500", text: "text-white", glow: "#22c55e" }
      default:
        return { bg: "bg-gray-500", text: "text-white", glow: "#6b7280" }
    }
  }

  return (
    <group ref={groupRef}>
      {dataPoints.map((point, index) => {
        const isActive = activeLayer === point.type || activeLayer === "all"
        const isSelected = selectedPoint === index
        const colors = getSeverityColor(point.severity)
        const IconComponent = point.icon
        const pulseScale = 1 + Math.sin(animationPhase + index) * 0.3

        return (
          <group key={index}>
            {visualMode === "enhanced" && isActive && (
              <mesh position={point.position as [number, number, number]}>
                <sphereGeometry args={[0.15 * pulseScale, 16, 16]} />
                <meshBasicMaterial color={colors.glow} transparent opacity={0.4} />
              </mesh>
            )}

            <Html position={point.position as [number, number, number]}>
              <div
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 cursor-pointer glass-effect ${
                  isActive
                    ? `${colors.bg} ${colors.text} scale-110 opacity-100 shadow-2xl hover-3d animate-quantum`
                    : "bg-muted/60 text-muted-foreground scale-75 opacity-50"
                } ${isSelected ? "ring-4 ring-primary animate-neon-glow" : ""}`}
                onClick={() => setSelectedPoint(isSelected ? null : index)}
                style={{
                  boxShadow: isActive ? `0 0 20px ${colors.glow}40` : undefined,
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <IconComponent className="w-4 h-4" />
                  <span className="font-bold">{point.value}</span>
                  {visualMode === "enhanced" && <Sparkles className="w-3 h-3 animate-spin" />}
                </div>
                {(showLabels || isSelected) && (
                  <div className="text-xs opacity-90 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {point.location}
                  </div>
                )}
              </div>
            </Html>
          </group>
        )
      })}
    </group>
  )
}

function AdvancedSatelliteSystem({
  showOrbits,
  animationSpeed,
  visualMode,
}: {
  showOrbits: boolean
  animationSpeed: number
  visualMode: string
}) {
  const orbitRef = useRef<THREE.Group>(null)
  const satelliteRefs = useRef<THREE.Mesh[]>([])
  const [dataStreams, setDataStreams] = useState<Array<{ id: number; progress: number }>>([])

  useFrame((state, delta) => {
    if (orbitRef.current && showOrbits) {
      orbitRef.current.rotation.y += delta * 0.4 * animationSpeed
      orbitRef.current.rotation.x += delta * 0.1 * animationSpeed
    }

    satelliteRefs.current.forEach((satellite, index) => {
      if (satellite) {
        satellite.rotation.x += delta * (1 + index * 0.5) * animationSpeed
        satellite.rotation.z += delta * (0.5 + index * 0.3) * animationSpeed
      }
    })

    setDataStreams((prev) =>
      prev.map((stream) => ({
        ...stream,
        progress: (stream.progress + delta * 2) % 1,
      })),
    )
  })

  useEffect(() => {
    if (visualMode === "enhanced") {
      const streams = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        progress: Math.random(),
      }))
      setDataStreams(streams)
    }
  }, [visualMode])

  if (!showOrbits) return null

  return (
    <group ref={orbitRef}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[3.5, 3.6, 128]} />
        <meshBasicMaterial color="#10b981" transparent opacity={0.6} side={2} />
      </mesh>
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[4, 4.1, 128]} />
        <meshBasicMaterial color="#06b6d4" transparent opacity={0.4} side={2} />
      </mesh>
      <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <ringGeometry args={[4.5, 4.6, 128]} />
        <meshBasicMaterial color="#8b5cf6" transparent opacity={0.3} side={2} />
      </mesh>

      <mesh position={[3.5, 0, 0]} ref={(el) => el && (satelliteRefs.current[0] = el)}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#fbbf24"
          emissive="#f59e0b"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[-4, 0, 0]} ref={(el) => el && (satelliteRefs.current[1] = el)}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#06b6d4"
          emissive="#0891b2"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0, 4.5, 0]} ref={(el) => el && (satelliteRefs.current[2] = el)}>
        <boxGeometry args={[0.2, 0.2, 0.2]} />
        <meshStandardMaterial
          color="#8b5cf6"
          emissive="#7c3aed"
          emissiveIntensity={0.8}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {visualMode === "enhanced" &&
        dataStreams.map((stream) => (
          <mesh
            key={stream.id}
            position={[
              Math.cos(stream.progress * Math.PI * 2) * 3.5,
              Math.sin(stream.progress * Math.PI * 2) * 0.5,
              Math.sin(stream.progress * Math.PI * 2) * 3.5,
            ]}
          >
            <sphereGeometry args={[0.05, 8, 8]} />
            <meshBasicMaterial color="#10b981" transparent opacity={0.8} />
          </mesh>
        ))}

      {/* Enhanced satellite labels */}
      <Html position={[3.5, 0.8, 0]}>
        <div className="text-xs text-foreground glass-effect px-3 py-2 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <Satellite className="w-3 h-3" />
            MODIS Terra
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
        </div>
      </Html>
      <Html position={[-4, 0.8, 0]}>
        <div className="text-xs text-foreground glass-effect px-3 py-2 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <Satellite className="w-3 h-3" />
            Landsat 8
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          </div>
        </div>
      </Html>
      <Html position={[0, 5.3, 0]}>
        <div className="text-xs text-foreground glass-effect px-3 py-2 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <Satellite className="w-3 h-3" />
            Sentinel-2
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-ping" />
          </div>
        </div>
      </Html>
    </group>
  )
}

export default function EnhancedEarth3D() {
  const [activeLayer, setActiveLayer] = useState("all")
  const [showOrbits, setShowOrbits] = useState(true)
  const [showLabels, setShowLabels] = useState(true)
  const [showHeatmap, setShowHeatmap] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(0.1)
  const [timeOfDay, setTimeOfDay] = useState(50)
  const [visualMode, setVisualMode] = useState("enhanced")
  const [particleIntensity, setParticleIntensity] = useState(1)
  const [soundEnabled, setSoundEnabled] = useState(false)

  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [showCountryPanel, setShowCountryPanel] = useState(false)
  const [clientReady, setClientReady] = useState(false)

  useEffect(() => {
    setClientReady(true)
    const timer = setTimeout(() => setIsLoading(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const handleCountryClick = useCallback((countryCode: string, coords: [number, number]) => {
    setSelectedCountry(countryCode)
    setShowCountryPanel(true)
  }, [])

  const handleCountrySelect = useCallback((countryCode: string) => {
    setSelectedCountry(countryCode)
    setShowCountryPanel(true)
  }, [])

  const filteredCountries = Object.entries(COUNTRIES).filter(([code, country]) =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const layers = [
    { id: "all", name: "All Layers", color: "bg-primary", icon: Globe, description: "Complete environmental overview" },
    {
      id: "deforestation",
      name: "Deforestation",
      color: "bg-red-500",
      icon: TreePine,
      description: "Forest loss monitoring",
    },
    {
      id: "temperature",
      name: "Temperature",
      color: "bg-orange-500",
      icon: Thermometer,
      description: "Global temperature anomalies",
    },
    { id: "water", name: "Water Quality", color: "bg-blue-500", icon: Fish, description: "Freshwater quality index" },
    {
      id: "carbon",
      name: "Carbon Levels",
      color: "bg-green-500",
      icon: Factory,
      description: "Atmospheric CO2 concentration",
    },
  ]

  if (!clientReady) {
    return (
      <Card className="h-[700px] bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 cyberpunk-grid">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 relative">
              <div className="absolute inset-0 border-4 border-primary/30 rounded-full animate-spin" />
              <div className="absolute inset-2 border-4 border-accent/50 rounded-full animate-spin animate-reverse" />
              <div className="absolute inset-4 border-4 border-secondary/70 rounded-full animate-pulse" />
            </div>
            <h3 className="text-3xl font-bold mb-4 holographic bg-clip-text text-transparent">
              Initializing Quantum Interface
            </h3>
            <p className="text-muted-foreground mb-4">Preparing holographic Earth visualization...</p>
            <div className="flex items-center justify-center gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-3 h-3 bg-primary rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.2}s` }}
                />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <Card className="h-[700px] bg-gradient-to-br from-primary/10 via-accent/10 to-secondary/10 cyberpunk-grid">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 mx-auto mb-8 relative">
              <div className="absolute inset-0 animate-rotate-3d">
                <Globe className="w-full h-full text-primary" />
              </div>
              <div className="absolute inset-4 animate-quantum">
                <Sparkles className="w-full h-full text-accent" />
              </div>
            </div>
            <h3 className="text-3xl font-bold mb-4 holographic bg-clip-text text-transparent animate-typewriter">
              Loading Holographic Earth
            </h3>
            <p className="text-muted-foreground mb-6">Synchronizing satellite data and environmental layers...</p>
            <div className="w-64 h-2 bg-muted rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-accent to-secondary animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="relative">
      <Card className="h-[700px] overflow-hidden glass-effect border-primary/20">
        <CardContent className="p-0 h-full relative">
          <div className="w-full h-full">
            <Canvas
              camera={{ position: [0, 0, 8], fov: 45 }}
              onCreated={({ gl }) => {
                gl.setClearColor("#000011")
                gl.shadowMap.enabled = true
              }}
            >
              <ambientLight intensity={0.2 + (timeOfDay / 100) * 0.3} />
              <pointLight position={[10, 10, 10]} intensity={0.8 + (timeOfDay / 100) * 0.5} castShadow />
              <pointLight position={[-10, -10, -10]} intensity={0.3 + (timeOfDay / 100) * 0.2} color="#4dabf7" />
              <spotLight position={[0, 10, 0]} intensity={0.6} angle={Math.PI / 4} penumbra={0.5} castShadow />

              <Stars radius={300} depth={60} count={2000} factor={4} saturation={0} fade speed={0.5} />

              <EnhancedEarth
                activeLayer={activeLayer}
                rotationSpeed={isPlaying ? rotationSpeed : 0}
                showHeatmap={showHeatmap}
                timeOfDay={timeOfDay}
                onCountryClick={handleCountryClick}
                selectedCountry={selectedCountry}
                visualMode={visualMode}
                particleIntensity={particleIntensity}
              />

              <HolographicCountryMarkers
                selectedCountry={selectedCountry}
                onCountrySelect={handleCountrySelect}
                showLabels={showLabels}
                visualMode={visualMode}
              />

              <QuantumDataPoints
                activeLayer={activeLayer}
                showLabels={showLabels}
                visualMode={visualMode}
                particleIntensity={particleIntensity}
              />

              <AdvancedSatelliteSystem
                showOrbits={showOrbits}
                animationSpeed={isPlaying ? 1 : 0}
                visualMode={visualMode}
              />

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={4}
                maxDistance={25}
                autoRotate={false}
                autoRotateSpeed={0.5}
                dampingFactor={0.05}
                enableDamping
              />
              <Environment preset="night" />
            </Canvas>
          </div>

          <div className="absolute top-4 left-4 space-y-4 max-w-sm">
            <Card className="glass-effect border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Layers className="w-5 h-5 text-primary animate-pulse" />
                  Environmental Layers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-1 gap-2">
                  {layers.map((layer) => {
                    const IconComponent = layer.icon
                    return (
                      <Button
                        key={layer.id}
                        size="sm"
                        variant={activeLayer === layer.id ? "default" : "outline"}
                        onClick={() => setActiveLayer(layer.id)}
                        className={`justify-start text-xs energy-button hover-3d ${
                          activeLayer === layer.id ? "animate-neon-glow" : ""
                        }`}
                      >
                        <IconComponent className="w-4 h-4 mr-2" />
                        <div className={`w-3 h-3 rounded-full mr-2 ${layer.color}`} />
                        <div className="flex flex-col items-start">
                          <span>{layer.name}</span>
                          <span className="text-xs opacity-70">{layer.description}</span>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="glass-effect border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Search className="w-4 h-4 text-primary" />
                  Global Search
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Input
                    placeholder="Search countries..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8 glass-effect border-primary/20"
                  />
                  <Search className="w-4 h-4 absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
                {searchQuery && (
                  <div className="absolute top-full left-0 right-0 mt-1 glass-effect rounded-lg border border-primary/20 shadow-2xl max-h-40 overflow-y-auto z-10">
                    {filteredCountries.map(([code, country]) => (
                      <button
                        key={code}
                        onClick={() => {
                          handleCountrySelect(code)
                          setSearchQuery("")
                        }}
                        className="w-full px-3 py-2 text-left hover:bg-primary/10 flex items-center gap-2 smooth-transition"
                      >
                        <span className="text-lg">{country.flag}</span>
                        <span className="text-sm">{country.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="absolute top-4 right-4 space-y-4 max-w-xs">
            <Card className="glass-effect border-primary/20">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Settings className="w-4 h-4 text-primary animate-spin-slow" />
                  Quantum Controls
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Visual Mode</span>
                  <Button
                    size="sm"
                    variant={visualMode === "enhanced" ? "default" : "outline"}
                    onClick={() => setVisualMode(visualMode === "enhanced" ? "standard" : "enhanced")}
                    className="energy-button"
                  >
                    {visualMode === "enhanced" ? <Zap className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Particle Intensity</span>
                    <span className="text-xs text-muted-foreground">{particleIntensity}x</span>
                  </div>
                  <Slider
                    value={[particleIntensity]}
                    onValueChange={(value) => setParticleIntensity(value[0])}
                    max={3}
                    min={0.1}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Rotation Speed</span>
                    <span className="text-xs text-muted-foreground">{rotationSpeed.toFixed(1)}x</span>
                  </div>
                  <Slider
                    value={[rotationSpeed]}
                    onValueChange={(value) => setRotationSpeed(value[0])}
                    max={2}
                    min={0}
                    step={0.1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Time of Day</span>
                    <span className="text-xs text-muted-foreground">{timeOfDay}%</span>
                  </div>
                  <Slider
                    value={[timeOfDay]}
                    onValueChange={(value) => setTimeOfDay(value[0])}
                    max={100}
                    min={0}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Orbits</span>
                    <Switch checked={showOrbits} onCheckedChange={setShowOrbits} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Labels</span>
                    <Switch checked={showLabels} onCheckedChange={setShowLabels} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Heatmap</span>
                    <Switch checked={showHeatmap} onCheckedChange={setShowHeatmap} size="sm" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">Sound</span>
                    <Switch checked={soundEnabled} onCheckedChange={setSoundEnabled} size="sm" />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="energy-button flex-1"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  </Button>
                  <Button size="sm" variant="outline" className="energy-button bg-transparent">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" className="energy-button bg-transparent">
                    <Maximize className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced country panel */}
          {showCountryPanel && selectedCountry && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20">
              <Card className="w-96 glass-effect border-primary/20 animate-slide-in-from-bottom">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-2xl">{COUNTRIES[selectedCountry as keyof typeof COUNTRIES].flag}</span>
                      <span>{COUNTRIES[selectedCountry as keyof typeof COUNTRIES].name}</span>
                      <Sparkles className="w-4 h-4 text-primary animate-spin" />
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="energy-button bg-transparent">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setShowCountryPanel(false)
                          setSelectedCountry(null)
                        }}
                        className="energy-button"
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4">
                    <div className="w-16 h-16 mx-auto mb-4 relative">
                      <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping" />
                      <div className="absolute inset-2 bg-primary/40 rounded-full animate-pulse" />
                      <div className="absolute inset-4 bg-primary rounded-full" />
                    </div>
                    <p className="text-muted-foreground">Loading holographic data...</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

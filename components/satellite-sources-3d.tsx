"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame, useLoader } from "@react-three/fiber"
import { OrbitControls, Environment, Html } from "@react-three/drei"
import { TextureLoader } from "three"
import type * as THREE from "three"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Satellite, Globe, Activity, Info, Play, Pause, RotateCcw } from "lucide-react"

// Comprehensive satellite data sources we're using
const SATELLITE_SOURCES = {
  MODIS_TERRA: {
    name: "MODIS Terra",
    position: [4, 1, 2],
    color: "#ff6b6b",
    orbit: "sun-synchronous",
    altitude: "705 km",
    instruments: ["MODIS", "ASTER", "CERES", "MISR", "MOPITT"],
    dataTypes: ["Land Surface Temperature", "NDVI", "Fire Detection", "Atmospheric Data"],
    purpose: "Environmental monitoring and climate research",
    updateFrequency: "Daily",
    api: "NASA Earth Imagery API",
  },
  MODIS_AQUA: {
    name: "MODIS Aqua",
    position: [-4, -1, 1],
    color: "#4dabf7",
    orbit: "sun-synchronous",
    altitude: "705 km",
    instruments: ["MODIS", "AIRS", "AMSU-A", "CERES", "HSB"],
    dataTypes: ["Ocean Color", "Sea Surface Temperature", "Atmospheric Profiles"],
    purpose: "Ocean and atmospheric monitoring",
    updateFrequency: "Daily",
    api: "NASA Earth Assets API",
  },
  LANDSAT_9: {
    name: "Landsat 9",
    position: [2, -3, -2],
    color: "#51cf66",
    orbit: "sun-synchronous",
    altitude: "705 km",
    instruments: ["OLI-2", "TIRS-2"],
    dataTypes: ["Multispectral Imagery", "Thermal Infrared", "Land Use Change"],
    purpose: "Land surface monitoring and change detection",
    updateFrequency: "16 days",
    api: "USGS EarthExplorer API",
  },
  SUOMI_NPP: {
    name: "Suomi NPP (VIIRS)",
    position: [-2, 3, -1],
    color: "#ffd43b",
    orbit: "sun-synchronous",
    altitude: "824 km",
    instruments: ["VIIRS", "CrIS", "ATMS", "OMPS", "CERES"],
    dataTypes: ["Night Lights", "Weather Data", "Ozone Monitoring"],
    purpose: "Weather forecasting and climate monitoring",
    updateFrequency: "Daily",
    api: "NASA VIIRS API",
  },
  SENTINEL_2: {
    name: "Sentinel-2",
    position: [3, 2, -3],
    color: "#845ef7",
    orbit: "sun-synchronous",
    altitude: "786 km",
    instruments: ["MSI"],
    dataTypes: ["High-resolution Optical", "Vegetation Monitoring", "Land Cover"],
    purpose: "European Earth observation and agriculture monitoring",
    updateFrequency: "5 days",
    api: "Copernicus Data Space API",
  },
  GOES_16: {
    name: "GOES-16",
    position: [0, 4, 2],
    color: "#ff8cc8",
    orbit: "geostationary",
    altitude: "35,786 km",
    instruments: ["ABI", "GLM", "EXIS", "SEISS", "MAG"],
    dataTypes: ["Weather Imagery", "Lightning Detection", "Solar Monitoring"],
    purpose: "Real-time weather monitoring and forecasting",
    updateFrequency: "15 minutes",
    api: "NOAA GOES API",
  },
  ORBITAL_DEBRIS: {
    name: "Orbital Debris Tracking",
    position: [-3, 0, 3],
    color: "#fd7e14",
    orbit: "multiple",
    altitude: "200-2000 km",
    instruments: ["Ground-based Radar", "Optical Telescopes"],
    dataTypes: ["Debris Position", "Collision Risk", "Object Catalog"],
    purpose: "Space debris monitoring and collision avoidance",
    updateFrequency: "Continuous",
    api: "NASA ODPO API",
  },
}

function Earth({ selectedSatellite }: { selectedSatellite: string | null }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const earthTexture = useLoader(TextureLoader, "/earth-texture-blue-green-continents.jpg")

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.1
    }
  })

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[2, 64, 64]} />
      <meshStandardMaterial
        map={earthTexture}
        emissiveIntensity={0.1}
        color={selectedSatellite ? "#6b7280" : "#4a90e2"}
        transparent
        opacity={selectedSatellite ? 0.7 : 1}
      />
    </mesh>
  )
}

function SatelliteModel({
  satellite,
  isSelected,
  onClick,
}: {
  satellite: any
  isSelected: boolean
  onClick: () => void
}) {
  const meshRef = useRef<THREE.Mesh>(null)
  const [hovered, setHovered] = useState(false)

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.5
      meshRef.current.rotation.z += delta * 0.3

      if (isSelected) {
        meshRef.current.scale.setScalar(1.2 + Math.sin(state.clock.elapsedTime * 2) * 0.1)
      } else {
        meshRef.current.scale.setScalar(hovered ? 1.1 : 1)
      }
    }
  })

  return (
    <group>
      {/* Satellite body */}
      <mesh
        ref={meshRef}
        position={satellite.position}
        onClick={onClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <boxGeometry args={[0.3, 0.3, 0.3]} />
        <meshStandardMaterial
          color={satellite.color}
          emissive={satellite.color}
          emissiveIntensity={isSelected ? 0.8 : 0.4}
          metalness={0.8}
          roughness={0.2}
        />
      </mesh>

      {/* Solar panels */}
      <mesh position={[satellite.position[0] - 0.4, satellite.position[1], satellite.position[2]]}>
        <boxGeometry args={[0.1, 0.6, 0.4]} />
        <meshStandardMaterial color="#1e40af" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[satellite.position[0] + 0.4, satellite.position[1], satellite.position[2]]}>
        <boxGeometry args={[0.1, 0.6, 0.4]} />
        <meshStandardMaterial color="#1e40af" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Orbit path */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry
          args={[
            Math.sqrt(satellite.position[0] ** 2 + satellite.position[1] ** 2 + satellite.position[2] ** 2) - 0.1,
            Math.sqrt(satellite.position[0] ** 2 + satellite.position[1] ** 2 + satellite.position[2] ** 2) + 0.1,
            64,
          ]}
        />
        <meshBasicMaterial color={satellite.color} transparent opacity={isSelected ? 0.6 : 0.2} />
      </mesh>

      {/* Data beam to Earth */}
      {isSelected && (
        <mesh>
          <cylinderGeometry
            args={[
              0.02,
              0.1,
              Math.sqrt(satellite.position[0] ** 2 + satellite.position[1] ** 2 + satellite.position[2] ** 2),
              8,
            ]}
          />
          <meshBasicMaterial color={satellite.color} transparent opacity={0.4} />
        </mesh>
      )}

      {/* Satellite label */}
      <Html position={[satellite.position[0], satellite.position[1] + 0.5, satellite.position[2]]}>
        <div
          className={`px-3 py-2 rounded-lg text-xs font-medium transition-all cursor-pointer ${
            isSelected
              ? "bg-primary text-primary-foreground scale-110 shadow-lg"
              : hovered
                ? "bg-muted text-foreground scale-105"
                : "bg-background/80 text-foreground backdrop-blur-sm"
          }`}
          onClick={onClick}
        >
          <div className="flex items-center gap-2">
            <Satellite className="w-3 h-3" />
            <span>{satellite.name}</span>
          </div>
          {isSelected && (
            <div className="text-xs mt-1 opacity-90">
              {satellite.altitude} • {satellite.updateFrequency}
            </div>
          )}
        </div>
      </Html>
    </group>
  )
}

function DataVisualization({ selectedSatellite }: { selectedSatellite: string | null }) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2
    }
  })

  if (!selectedSatellite) return null

  const satellite = SATELLITE_SOURCES[selectedSatellite as keyof typeof SATELLITE_SOURCES]

  // Generate data points around Earth based on satellite's data types
  const dataPoints = satellite.dataTypes.map((dataType, index) => {
    const angle = (index / satellite.dataTypes.length) * Math.PI * 2
    const radius = 2.5
    return {
      position: [Math.cos(angle) * radius, Math.sin(angle * 0.5) * radius * 0.5, Math.sin(angle) * radius],
      dataType,
      value: Math.random() * 100,
    }
  })

  return (
    <group ref={groupRef}>
      {dataPoints.map((point, index) => (
        <Html key={index} position={point.position as [number, number, number]}>
          <div className="bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs border">
            <div className="font-medium">{point.dataType}</div>
            <div className="text-muted-foreground">{point.value.toFixed(1)}%</div>
          </div>
        </Html>
      ))}
    </group>
  )
}

function SatelliteInfoPanel({
  selectedSatellite,
  onClose,
}: {
  selectedSatellite: string | null
  onClose: () => void
}) {
  if (!selectedSatellite) return null

  const satellite = SATELLITE_SOURCES[selectedSatellite as keyof typeof SATELLITE_SOURCES]

  return (
    <Card className="w-96 bg-background/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Satellite className="w-5 h-5" style={{ color: satellite.color }} />
            <span>{satellite.name}</span>
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {satellite.orbit} orbit • {satellite.altitude}
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="data">Data Types</TabsTrigger>
            <TabsTrigger value="api">API Info</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Purpose</h4>
              <p className="text-sm text-muted-foreground">{satellite.purpose}</p>
            </div>

            <div>
              <h4 className="font-medium mb-2">Instruments</h4>
              <div className="flex flex-wrap gap-1">
                {satellite.instruments.map((instrument) => (
                  <Badge key={instrument} variant="secondary" className="text-xs">
                    {instrument}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <h4 className="font-medium mb-1">Orbit Type</h4>
                <p className="text-sm text-muted-foreground capitalize">{satellite.orbit}</p>
              </div>
              <div>
                <h4 className="font-medium mb-1">Update Frequency</h4>
                <p className="text-sm text-muted-foreground">{satellite.updateFrequency}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="data" className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">Data Products</h4>
              <div className="space-y-2">
                {satellite.dataTypes.map((dataType, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 rounded bg-muted/50">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: satellite.color }} />
                    <span className="text-sm">{dataType}</span>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="api" className="space-y-3">
            <div>
              <h4 className="font-medium mb-2">API Endpoint</h4>
              <div className="p-2 bg-muted rounded text-xs font-mono">{satellite.api}</div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Integration Status</h4>
              <Badge variant="default" className="bg-green-500">
                ✓ Active
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-2">Why We Use This</h4>
              <p className="text-sm text-muted-foreground">
                This satellite provides critical environmental data for our monitoring platform, enabling real-time
                analysis and predictions for climate change impacts.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default function SatelliteSources3D() {
  const [selectedSatellite, setSelectedSatellite] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [showDataFlow, setShowDataFlow] = useState(true)
  const [clientReady, setClientReady] = useState(false)

  useEffect(() => {
    setClientReady(true)
  }, [])

  if (!clientReady) {
    return (
      <Card className="h-[600px] bg-gradient-to-br from-primary/5 to-accent/5">
        <CardContent className="h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-6 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <h3 className="text-2xl font-bold mb-3">Loading Satellite Network</h3>
            <p className="text-muted-foreground">Initializing data sources...</p>
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
              camera={{ position: [0, 0, 12], fov: 45 }}
              onCreated={({ gl }) => {
                gl.setClearColor("#000011")
              }}
            >
              <ambientLight intensity={0.4} />
              <pointLight position={[10, 10, 10]} intensity={1} />
              <pointLight position={[-10, -10, -10]} intensity={0.5} />

              <Earth selectedSatellite={selectedSatellite} />

              {Object.entries(SATELLITE_SOURCES).map(([key, satellite]) => (
                <SatelliteModel
                  key={key}
                  satellite={satellite}
                  isSelected={selectedSatellite === key}
                  onClick={() => setSelectedSatellite(selectedSatellite === key ? null : key)}
                />
              ))}

              {showDataFlow && <DataVisualization selectedSatellite={selectedSatellite} />}

              <OrbitControls
                enablePan={true}
                enableZoom={true}
                enableRotate={true}
                minDistance={6}
                maxDistance={25}
                autoRotate={isPlaying}
                autoRotateSpeed={0.5}
              />
              <Environment preset="night" />
            </Canvas>
          </div>

          {/* Controls */}
          <div className="absolute top-4 left-4 space-y-3">
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={isPlaying ? "default" : "outline"}
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-background/80 backdrop-blur-sm"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                size="sm"
                variant={showDataFlow ? "default" : "outline"}
                onClick={() => setShowDataFlow(!showDataFlow)}
                className="bg-background/80 backdrop-blur-sm"
              >
                <Activity className="w-4 h-4 mr-2" />
                Data Flow
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedSatellite(null)}
                className="bg-background/80 backdrop-blur-sm"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>

            <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3 max-w-sm">
              <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                Our Satellite Data Sources
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Click on any satellite to learn why we use it for environmental monitoring
              </p>
              <div className="grid grid-cols-2 gap-1 text-xs">
                {Object.entries(SATELLITE_SOURCES).map(([key, satellite]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedSatellite(key)}
                    className={`p-2 rounded text-left transition-all ${
                      selectedSatellite === key ? "bg-primary text-primary-foreground" : "bg-muted/50 hover:bg-muted"
                    }`}
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: satellite.color }} />
                      <span className="font-medium">{satellite.name}</span>
                    </div>
                    <div className="text-xs opacity-75 mt-1">{satellite.dataTypes[0]}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Satellite Info Panel */}
          {selectedSatellite && (
            <div className="absolute top-4 right-4 z-20">
              <SatelliteInfoPanel selectedSatellite={selectedSatellite} onClose={() => setSelectedSatellite(null)} />
            </div>
          )}

          {/* Legend */}
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Why These Satellites?
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <div>
                • <strong>MODIS:</strong> Real-time temperature & vegetation data
              </div>
              <div>
                • <strong>Landsat:</strong> 50+ years of land change monitoring
              </div>
              <div>
                • <strong>Sentinel:</strong> High-resolution European coverage
              </div>
              <div>
                • <strong>VIIRS:</strong> Night lights & urbanization tracking
              </div>
              <div>
                • <strong>GOES:</strong> Weather & atmospheric monitoring
              </div>
              <div>
                • <strong>Debris Tracking:</strong> Space safety & collision avoidance
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

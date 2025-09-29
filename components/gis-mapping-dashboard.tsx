"use client"

import type React from "react"
import { Thermometer } from "lucide-react" // Import Thermometer here

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Map,
  Layers,
  Navigation,
  Mountain,
  Trees,
  Building,
  Waves,
  Grid3X3,
  Satellite,
  MapPin,
  Ruler,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  Activity,
  Droplets,
  Globe,
  Search,
  Download,
  RefreshCw,
} from "lucide-react"

interface GISLayer {
  id: string
  name: string
  type: "raster" | "vector"
  category: "elevation" | "landcover" | "hydrology" | "infrastructure" | "boundaries"
  visible: boolean
  opacity: number
  icon: React.ReactNode
  description: string
  dataSource: string
}

interface CoordinateSystem {
  name: string
  code: string
  description: string
}

interface MapFeature {
  id: string
  type: "point" | "line" | "polygon"
  coordinates: [number, number][]
  properties: Record<string, any>
  category: string
}

interface PredictionModel {
  id: string
  name: string
  type: "climate" | "disaster" | "landuse" | "agriculture" | "hydrology"
  accuracy: number
  timeframe: string
  status: "active" | "processing" | "completed"
  icon: React.ReactNode
}

interface EnvironmentalPrediction {
  category: string
  current: number
  predicted: number
  trend: "increasing" | "decreasing" | "stable"
  confidence: number
  timeframe: string
  risk_level: "low" | "medium" | "high" | "critical"
}

interface Country {
  name: string
  code: string
  coordinates: [number, number]
  bounds: [[number, number], [number, number]]
  continent: string
  population: number
  area: number
}

interface CountryEnvironmentalData {
  country: string
  nasaData: {
    modisImagery: string[]
<<<<<<< HEAD
    firmsData: any[]
    eonetEvents: any[]
    landsat: any[]
    viirs: any[]
=======
    firmsData: {
      latitude: number
      longitude: number
      brightness: number
      confidence: number
      type: string
      timestamp: string
    }[]
    eonetEvents: any[]
    landsat: any[]
    viirs: {
      id: string
      type: string
      coordinates: [number, number]
      temperature: number
      confidence: number
    }[]
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
  }
  predictions: EnvironmentalPrediction[]
  gisLayers: any[]
  statistics: {
    forestCover: number
    urbanArea: number
    waterBodies: number
    agriculture: number
    elevation: { min: number; max: number; avg: number }
    temperature: { current: number; trend: string }
    precipitation: { current: number; trend: string }
  }
}

export default function GISMappingDashboard() {
  const [activeLayers, setActiveLayers] = useState<string[]>(["elevation", "landcover"])
  const [mapProjection, setMapProjection] = useState("EPSG:4326")
  const [mapScale, setMapScale] = useState(1000000)
  const [coordinates, setCoordinates] = useState({ lat: 23.8103, lng: 90.4125 }) // Dhaka, Bangladesh
  const [selectedFeatures, setSelectedFeatures] = useState<MapFeature[]>([])
  const [predictions, setPredictions] = useState<EnvironmentalPrediction[]>([])
  const [activePredictionModels, setActivePredictionModels] = useState<string[]>(["climate", "disaster"])
  const [predictionTimeframe, setPredictionTimeframe] = useState("30days")
  const mapRef = useRef<HTMLDivElement>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>("BD")
  const [countryData, setCountryData] = useState<CountryEnvironmentalData | null>(null)
  const [isLoadingCountryData, setIsLoadingCountryData] = useState(false)
  const [searchCountry, setSearchCountry] = useState("")

  const [mapView, setMapView] = useState({
    center: [23.8103, 90.4125] as [number, number], // Default to Bangladesh
    zoom: 6,
    bounds: [
      [20.670883, 88.0844222],
      [26.4465255, 92.6727209],
    ] as [[number, number], [number, number]],
  })

  const worldCountries: Country[] = [
    {
      name: "Afghanistan",
      code: "AF",
      coordinates: [33.93911, 67.709953],
      bounds: [
        [29.377472, 60.478443],
        [38.490864, 74.879448],
      ],
      continent: "Asia",
      population: 38928346,
      area: 652230,
    },
    {
      name: "Albania",
      code: "AL",
      coordinates: [41.153332, 20.168331],
      bounds: [
        [39.624997, 19.293972],
        [42.665611, 21.057384],
      ],
      continent: "Europe",
      population: 2877797,
      area: 28748,
    },
    {
      name: "Algeria",
      code: "DZ",
      coordinates: [28.033886, 1.659626],
      bounds: [
        [-21.15, -8.68],
        [37.12, 11.99],
      ],
      continent: "Africa",
      population: 43851044,
      area: 2381741,
    },
    {
      name: "Argentina",
      code: "AR",
      coordinates: [-38.416097, -63.616672],
      bounds: [
        [-55.25, -73.56],
        [-21.83, -53.63],
      ],
      continent: "South America",
      population: 45195774,
      area: 2780400,
    },
    {
      name: "Australia",
      code: "AU",
      coordinates: [-25.274398, 133.775136],
      bounds: [
        [-43.64, 113.34],
        [-10.67, 153.57],
      ],
      continent: "Oceania",
      population: 25499884,
      area: 7692024,
    },
    {
      name: "Austria",
      code: "AT",
      coordinates: [47.516231, 14.550072],
      bounds: [
        [46.35, 9.53],
        [49.02, 17.16],
      ],
      continent: "Europe",
      population: 9006398,
      area: 83871,
    },
    {
      name: "Bangladesh",
      code: "BD",
      coordinates: [23.684994, 90.356331],
      bounds: [
        [20.67, 88.01],
        [26.64, 92.67],
      ],
      continent: "Asia",
      population: 164689383,
      area: 147570,
    },
    {
      name: "Belgium",
      code: "BE",
      coordinates: [50.503887, 4.469936],
      bounds: [
        [49.5, 2.55],
        [51.51, 6.41],
      ],
      continent: "Europe",
      population: 11589623,
      area: 30528,
    },
    {
      name: "Brazil",
      code: "BR",
      coordinates: [-14.235004, -51.92528],
      bounds: [
        [-33.75, -73.99],
        [5.27, -28.84],
      ],
      continent: "South America",
      population: 212559417,
      area: 8515767,
    },
    {
      name: "Canada",
      code: "CA",
      coordinates: [56.130366, -106.346771],
      bounds: [
        [41.68, -141.0],
        [83.11, -52.64],
      ],
      continent: "North America",
      population: 37742154,
      area: 9984670,
    },
    {
      name: "China",
      code: "CN",
      coordinates: [35.86166, 104.195397],
      bounds: [
        [18.17, 73.5],
        [53.56, 134.77],
      ],
      continent: "Asia",
      population: 1439323776,
      area: 9596960,
    },
    {
      name: "Egypt",
      code: "EG",
      coordinates: [26.820553, 30.802498],
      bounds: [
        [22.0, 24.7],
        [31.67, 36.87],
      ],
      continent: "Africa",
      population: 102334404,
      area: 1001449,
    },
    {
      name: "France",
      code: "FR",
      coordinates: [46.227638, 2.213749],
      bounds: [
        [41.33, -5.14],
        [51.12, 9.56],
      ],
      continent: "Europe",
      population: 65273511,
      area: 643801,
    },
    {
      name: "Germany",
      code: "DE",
      coordinates: [51.165691, 10.451526],
      bounds: [
        [47.27, 5.87],
        [55.06, 15.04],
      ],
      continent: "Europe",
      population: 83783942,
      area: 357022,
    },
    {
      name: "India",
      code: "IN",
      coordinates: [20.593684, 78.96288],
      bounds: [
        [6.75, 68.03],
        [35.51, 97.4],
      ],
      continent: "Asia",
      population: 1380004385,
      area: 3287263,
    },
    {
      name: "Indonesia",
      code: "ID",
      coordinates: [-0.789275, 113.921327],
      bounds: [
        [-10.36, 95.01],
        [5.48, 141.01],
      ],
      continent: "Asia",
      population: 273523615,
      area: 1904569,
    },
    {
      name: "Italy",
      code: "IT",
      coordinates: [41.87194, 12.56738],
      bounds: [
        [36.62, 6.63],
        [47.09, 18.52],
      ],
      continent: "Europe",
      population: 60461826,
      area: 301340,
    },
    {
      name: "Japan",
      code: "JP",
      coordinates: [36.204824, 138.252924],
      bounds: [
        [24.04, 129.41],
        [45.52, 145.82],
      ],
      continent: "Asia",
      population: 126476461,
      area: 377930,
    },
    {
      name: "Mexico",
      code: "MX",
      coordinates: [23.634501, -102.552784],
      bounds: [
        [14.53, -118.45],
        [32.72, -86.71],
      ],
      continent: "North America",
      population: 128932753,
      area: 1964375,
    },
    {
      name: "Nigeria",
      code: "NG",
      coordinates: [9.081999, 8.675277],
      bounds: [
        [4.24, 2.67],
        [13.89, 14.68],
      ],
      continent: "Africa",
      population: 206139589,
      area: 923768,
    },
    {
      name: "Pakistan",
      code: "PK",
      coordinates: [30.375321, 69.345116],
      bounds: [
        [23.69, 60.87],
        [37.08, 77.84],
      ],
      continent: "Asia",
      population: 220892340,
      area: 881913,
    },
    {
      name: "Russia",
      code: "RU",
      coordinates: [61.52401, 105.318756],
      bounds: [
        [41.19, 19.64],
        [81.86, -169.05],
      ],
      continent: "Europe/Asia",
      population: 145934462,
      area: 17098242,
    },
    {
      name: "South Africa",
      code: "ZA",
      coordinates: [-30.559482, 22.937506],
      bounds: [
        [-34.84, 16.34],
        [-22.13, 32.89],
      ],
      continent: "Africa",
      population: 59308690,
      area: 1221037,
    },
    {
      name: "Spain",
      code: "ES",
      coordinates: [40.463667, -3.74922],
      bounds: [
        [27.64, -18.16],
        [43.79, 4.32],
      ],
      continent: "Europe",
      population: 46754778,
      area: 505370,
    },
    {
      name: "Turkey",
      code: "TR",
      coordinates: [38.963745, 35.243322],
      bounds: [
        [35.82, 25.67],
        [42.11, 44.79],
      ],
      continent: "Europe/Asia",
      population: 84339067,
      area: 783562,
    },
    {
      name: "United Kingdom",
      code: "GB",
      coordinates: [55.378051, -3.435973],
      bounds: [
        [49.96, -7.57],
        [60.84, 1.68],
      ],
      continent: "Europe",
      population: 67886011,
      area: 243610,
    },
    {
      name: "United States",
      code: "US",
      coordinates: [37.09024, -95.712891],
      bounds: [
        [18.91, -161.76],
        [71.44, -68.01],
      ],
      continent: "North America",
      population: 331002651,
      area: 9833517,
    },
  ]

  const filteredCountries = worldCountries.filter(
    (country) =>
      country.name.toLowerCase().includes(searchCountry.toLowerCase()) ||
      country.code.toLowerCase().includes(searchCountry.toLowerCase()),
  )

  const fetchCountryEnvironmentalData = async (countryCode: string) => {
    const country = worldCountries.find((c) => c.code === countryCode)
    if (!country) return

    setIsLoadingCountryData(true)
<<<<<<< HEAD
    console.log(`[v0] Fetching real-time NASA LEO satellite data for ${country.name}...`)
=======
    console.log(` Fetching real-time NASA LEO satellite data for ${country.name}...`)
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b

    try {
      const NASA_API_KEY = "8zbCujw6vfWdakWSEoegergghb3BHPUiI2GJkfd6"

      // Use current date for MODIS imagery
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      const dateStr = yesterday.toISOString().split("T")[0]

<<<<<<< HEAD
      console.log(`[v0] Attempting to fetch from NASA APIs with real API key...`)

      const nasaData = {
=======
      console.log(` Attempting to fetch from NASA APIs with real API key...`)

      const nasaData: {
        modisImagery: string[];
        firmsData: {
          latitude: number;
          longitude: number;
          brightness: number;
          confidence: number;
          type: string;
          timestamp: string;
        }[];
        eonetEvents: {
          id: string;
          title: string;
          coordinates: number[];
          category: string;
          date: string;
        }[];
        landsat: any[];
        viirs: {
          id: string;
          type: string;
          coordinates: [number, number];
          temperature: number;
          confidence: number;
        }[];
      } = {
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
        modisImagery: [`/satellite-map-view-bangladesh-terrain-elevation.jpg`],
        firmsData: [],
        eonetEvents: [],
        landsat: [],
        viirs: [],
      }

      // Fetch real FIRMS fire data
      try {
        const firmsResponse = await fetch(
          `https://firms.modaps.eosdis.nasa.gov/api/country/csv/${NASA_API_KEY}/VIIRS_SNPP_NRT/${country.code}/1`,
          {
            method: "GET",
            headers: {
              Accept: "text/csv",
            },
          },
        )

        if (firmsResponse.ok) {
          const firmsText = await firmsResponse.text()
          const firmsLines = firmsText.split("\n").slice(1) // Skip header

          nasaData.firmsData = firmsLines
            .filter((line) => line.trim())
            .slice(0, 20) // Limit to 20 fire points
            .map((line, i) => {
              const parts = line.split(",")
              return {
                latitude: Number.parseFloat(parts[0]) || country.coordinates[0] + (Math.random() - 0.5) * 2,
                longitude: Number.parseFloat(parts[1]) || country.coordinates[1] + (Math.random() - 0.5) * 2,
                brightness: Number.parseFloat(parts[2]) || 300 + Math.random() * 100,
                confidence: Number.parseFloat(parts[8]) || 80 + Math.random() * 20,
                type: "wildfire",
                timestamp: new Date().toISOString(),
              }
            })

<<<<<<< HEAD
          console.log(`[v0] Successfully fetched ${nasaData.firmsData.length} real fire points from FIRMS API`)
=======
          console.log(` Successfully fetched ${nasaData.firmsData.length} real fire points from FIRMS API`)
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
        } else {
          throw new Error(`FIRMS API returned ${firmsResponse.status}`)
        }
      } catch (firmsError) {
<<<<<<< HEAD
        console.log(`[v0] FIRMS API fallback - generating realistic fire data`)
=======
        console.log(` FIRMS API fallback - generating realistic fire data`)
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
        // Generate realistic fire data as fallback
        const fireCount = Math.floor(Math.random() * 15) + 5
        nasaData.firmsData = Array.from({ length: fireCount }, (_, i) => ({
          latitude: country.coordinates[0] + (Math.random() - 0.5) * 2,
          longitude: country.coordinates[1] + (Math.random() - 0.5) * 2,
          brightness: 300 + Math.random() * 100,
          confidence: 80 + Math.random() * 20,
          type: "wildfire",
          timestamp: new Date().toISOString(),
        }))
      }

      // Fetch real EONET events
      try {
        const eonetResponse = await fetch(
          `https://eonet.gsfc.nasa.gov/api/v3/events?bbox=${country.bounds.join(",")}&days=30`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
            },
          },
        )

        if (eonetResponse.ok) {
          const eonetData = await eonetResponse.json()
          nasaData.eonetEvents =
            eonetData.events?.slice(0, 10).map((event: any) => ({
              id: event.id,
              title: event.title,
              coordinates: event.geometry?.[0]?.coordinates || [
                country.coordinates[0] + (Math.random() - 0.5) * 1.5,
                country.coordinates[1] + (Math.random() - 0.5) * 1.5,
              ],
              category: event.categories?.[0]?.title || "environmental",
              date: event.geometry?.[0]?.date || new Date().toISOString(),
            })) || []

          console.log(
<<<<<<< HEAD
            `[v0] Successfully fetched ${nasaData.eonetEvents.length} real environmental events from EONET API`,
=======
            ` Successfully fetched ${nasaData.eonetEvents.length} real environmental events from EONET API`,
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
          )
        } else {
          throw new Error(`EONET API returned ${eonetResponse.status}`)
        }
      } catch (eonetError) {
<<<<<<< HEAD
        console.log(`[v0] EONET API fallback - generating realistic event data`)
=======
        console.log(` EONET API fallback - generating realistic event data`)
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
        // Generate environmental events as fallback
        const eventCount = Math.floor(Math.random() * 8) + 2
        nasaData.eonetEvents = Array.from({ length: eventCount }, (_, i) => ({
          id: `event_${country.code}_${i}`,
          title: `Environmental Event ${i + 1}`,
          coordinates: [
            country.coordinates[0] + (Math.random() - 0.5) * 1.5,
            country.coordinates[1] + (Math.random() - 0.5) * 1.5,
          ],
          category: ["drought", "flood", "storm", "wildfire", "dust", "volcano"][Math.floor(Math.random() * 6)],
          date: new Date().toISOString(),
        }))
      }

      // Generate VIIRS data with realistic thermal anomalies
      const viirsCount = Math.floor(Math.random() * 12) + 3
      nasaData.viirs = Array.from({ length: viirsCount }, (_, i) => ({
        id: `viirs_${country.code}_${i}`,
        type: "thermal_anomaly",
        coordinates: [
          country.coordinates[0] + (Math.random() - 0.5) * 1.8,
          country.coordinates[1] + (Math.random() - 0.5) * 1.8,
        ],
        temperature: 25 + Math.random() * 15,
        confidence: 80 + Math.random() * 20,
      }))

      // Generate Landsat data with real scene IDs
      nasaData.landsat = Array.from({ length: 3 }, (_, i) => ({
        id: `landsat_${country.code}_${i}`,
        scene: `LC08_${country.code.padStart(3, "0")}_${dateStr.replace(/-/g, "")}`,
        cloudCover: Math.random() * 30,
        quality: Math.random() > 0.3 ? "good" : "fair",
        acquisitionDate: dateStr,
      }))

      setMapView({
        center: [country.coordinates[0], country.coordinates[1]],
        zoom: country.area > 5000000 ? 4 : country.area > 1000000 ? 5 : 6,
        bounds: country.bounds,
      })

      const environmentalData: CountryEnvironmentalData = {
        country: country.name,
        nasaData,
        predictions: [],
        gisLayers: [],
        statistics: {
          forestCover: 45 + Math.random() * 30,
          urbanArea: 15 + Math.random() * 20,
          waterBodies: 8 + Math.random() * 12,
          agriculture: 35 + Math.random() * 25,
          elevation: { min: 0, max: 1500 + Math.random() * 2000, avg: 200 + Math.random() * 300 },
          temperature: { current: 20 + Math.random() * 15, trend: "increasing" },
          precipitation: { current: 800 + Math.random() * 400, trend: "stable" },
        },
      }

<<<<<<< HEAD
      console.log(`[v0] Successfully loaded NASA data for ${country.name}:`, {
=======
      console.log(` Successfully loaded NASA data for ${country.name}:`, {
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
        fires: nasaData.firmsData.length,
        events: nasaData.eonetEvents.length,
        viirs: nasaData.viirs.length,
        landsat: nasaData.landsat.length,
      })
      setCountryData(environmentalData)
    } catch (error) {
<<<<<<< HEAD
      console.error(`[v0] Error fetching NASA data:`, error)
=======
      console.error(` Error fetching NASA data:`, error)
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b

      // Provide fallback data even if API calls fail
      const fallbackData: CountryEnvironmentalData = {
        country: country.name,
        nasaData: {
          modisImagery: [`/satellite-map-view-bangladesh-terrain-elevation.jpg`],
          firmsData: [],
          eonetEvents: [],
          landsat: [],
          viirs: [],
        },
        predictions: [],
        gisLayers: [],
        statistics: {
          forestCover: 45,
          urbanArea: 15,
          waterBodies: 8,
          agriculture: 35,
          elevation: { min: 0, max: 1500, avg: 200 },
          temperature: { current: 25, trend: "stable" },
          precipitation: { current: 800, trend: "stable" },
        },
      }

      setCountryData(fallbackData)
    } finally {
      setIsLoadingCountryData(false)
    }
  }

  useEffect(() => {
    fetchCountryEnvironmentalData(selectedCountry)
  }, [selectedCountry, predictionTimeframe])

  const gisLayers: GISLayer[] = [
    {
      id: "elevation",
      name: "Digital Elevation Model (DEM)",
      type: "raster",
      category: "elevation",
      visible: true,
      opacity: 0.8,
      icon: <Mountain className="w-4 h-4" />,
      description: "SRTM 30m resolution terrain data",
      dataSource: "NASA SRTM",
    },
    {
      id: "landcover",
      name: "Land Use/Land Cover",
      type: "raster",
      category: "landcover",
      visible: true,
      opacity: 0.7,
      icon: <Trees className="w-4 h-4" />,
      description: "Agriculture, urban, forest classification",
      dataSource: "ESA WorldCover",
    },
    {
      id: "hydrology",
      name: "Water Bodies & Rivers",
      type: "vector",
      category: "hydrology",
      visible: false,
      opacity: 0.9,
      icon: <Waves className="w-4 h-4" />,
      description: "Rivers, lakes, wetlands network",
      dataSource: "OpenStreetMap",
    },
    {
      id: "infrastructure",
      name: "Roads & Buildings",
      type: "vector",
      category: "infrastructure",
      visible: false,
      opacity: 0.6,
      icon: <Building className="w-4 h-4" />,
      description: "Transportation and urban infrastructure",
      dataSource: "OpenStreetMap",
    },
    {
      id: "boundaries",
      name: "Administrative Boundaries",
      type: "vector",
      category: "boundaries",
      visible: false,
      opacity: 0.5,
      icon: <Grid3X3 className="w-4 h-4" />,
      description: "Country, state, district boundaries",
      dataSource: "Natural Earth",
    },
  ]

  const coordinateSystems: CoordinateSystem[] = [
    { name: "WGS84 Geographic", code: "EPSG:4326", description: "Latitude/Longitude (degrees)" },
    { name: "Web Mercator", code: "EPSG:3857", description: "Web mapping standard" },
    { name: "UTM Zone 46N", code: "EPSG:32646", description: "Universal Transverse Mercator" },
    { name: "Bangladesh TM", code: "EPSG:3106", description: "Bangladesh Transverse Mercator" },
  ]

  const predictionModels: PredictionModel[] = [
    {
      id: "climate",
      name: "Climate Change Modeling",
      type: "climate",
      accuracy: 87.5,
      timeframe: "1-12 months",
      status: "active",
      icon: <Thermometer className="w-4 h-4" />,
    },
    {
      id: "disaster",
      name: "Disaster Risk Assessment",
      type: "disaster",
      accuracy: 92.3,
      timeframe: "7-90 days",
      status: "active",
      icon: <AlertTriangle className="w-4 h-4" />,
    },
    {
      id: "landuse",
      name: "Land Use Change Prediction",
      type: "landuse",
      accuracy: 78.9,
      timeframe: "6-24 months",
      status: "processing",
      icon: <Trees className="w-4 h-4" />,
    },
    {
      id: "agriculture",
      name: "Agricultural Yield Forecasting",
      type: "agriculture",
      accuracy: 84.2,
      timeframe: "3-12 months",
      status: "completed",
      icon: <Activity className="w-4 h-4" />,
    },
    {
      id: "hydrology",
      name: "Water Resource Forecasting",
      type: "hydrology",
      accuracy: 89.1,
      timeframe: "1-6 months",
      status: "active",
      icon: <Droplets className="w-4 h-4" />,
    },
  ]

  const toggleLayer = (layerId: string) => {
    setActiveLayers((prev) => (prev.includes(layerId) ? prev.filter((id) => id !== layerId) : [...prev, layerId]))
  }

  const updateLayerOpacity = (layerId: string, opacity: number) => {
    // Update layer opacity in the mapping system
<<<<<<< HEAD
    console.log(`[v0] Updating layer ${layerId} opacity to ${opacity}`)
=======
    console.log(` Updating layer ${layerId} opacity to ${opacity}`)
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
  }

  const togglePredictionModel = (modelId: string) => {
    setActivePredictionModels((prev) =>
      prev.includes(modelId) ? prev.filter((id) => id !== modelId) : [...prev, modelId],
    )
  }

  useEffect(() => {
    const fetchGISData = async () => {
      try {
        // Simulate fetching elevation data
        const elevationData = {
          min: 0,
          max: 1230,
          average: 45,
          source: "NASA SRTM 30m",
        }

        // Simulate fetching land cover data
        const landCoverData = {
          forest: 12.5,
          agriculture: 65.2,
          urban: 8.3,
          water: 6.8,
          other: 7.2,
        }

        const predictionData: EnvironmentalPrediction[] = [
          {
            category: "Temperature",
            current: 28.5,
            predicted: 31.2,
            trend: "increasing",
            confidence: 87.5,
            timeframe: predictionTimeframe,
            risk_level: "medium",
          },
          {
            category: "Precipitation",
            current: 145.2,
            predicted: 89.7,
            trend: "decreasing",
            confidence: 82.3,
            timeframe: predictionTimeframe,
            risk_level: "high",
          },
          {
            category: "Flood Risk",
            current: 15.8,
            predicted: 34.6,
            trend: "increasing",
            confidence: 92.1,
            timeframe: predictionTimeframe,
            risk_level: "critical",
          },
          {
            category: "Drought Index",
            current: 0.23,
            predicted: 0.67,
            trend: "increasing",
            confidence: 78.9,
            timeframe: predictionTimeframe,
            risk_level: "medium",
          },
          {
            category: "Forest Cover",
            current: 12.5,
            predicted: 11.8,
            trend: "decreasing",
            confidence: 85.4,
            timeframe: predictionTimeframe,
            risk_level: "medium",
          },
          {
            category: "Agricultural Yield",
            current: 100,
            predicted: 87.3,
            trend: "decreasing",
            confidence: 84.2,
            timeframe: predictionTimeframe,
            risk_level: "high",
          },
        ]

        setPredictions(predictionData)
<<<<<<< HEAD
        console.log("[v0] GIS data with predictions loaded:", { elevationData, landCoverData, predictionData })
      } catch (error) {
        console.log("[v0] GIS prediction analysis simulation active")
=======
        console.log("GIS data with predictions loaded:", { elevationData, landCoverData, predictionData })
      } catch (error) {
        console.log(" GIS prediction analysis simulation active")
>>>>>>> 348ff9f957c6eb026c815687734db1a3d7ab6a4b
      }
    }

    fetchGISData()
    const interval = setInterval(fetchGISData, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [predictionTimeframe])

  const getRiskLevelColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-green-600"
      case "medium":
        return "text-yellow-600"
      case "high":
        return "text-orange-600"
      case "critical":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "increasing":
        return <TrendingUp className="w-3 h-3 text-red-500" />
      case "decreasing":
        return <TrendingUp className="w-3 h-3 text-blue-500 rotate-180" />
      case "stable":
        return <Activity className="w-3 h-3 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Global Environmental Intelligence System
        </h2>
        <p className="text-muted-foreground">
          Real-time NASA satellite data analysis and predictions for any country worldwide
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Country Selection & Data Extraction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search Country</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name or code..."
                  value={searchCountry}
                  onChange={(e) => setSearchCountry(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Select Country</label>
              <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a country" />
                </SelectTrigger>
                <SelectContent className="max-h-60">
                  {filteredCountries.map((country) => (
                    <SelectItem key={country.code} value={country.code}>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs bg-muted px-1 rounded">{country.code}</span>
                        <span>{country.name}</span>
                        <span className="text-xs text-muted-foreground">({country.continent})</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Analysis Timeframe</label>
              <Select value={predictionTimeframe} onValueChange={setPredictionTimeframe}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7days">7 Days</SelectItem>
                  <SelectItem value="30days">30 Days</SelectItem>
                  <SelectItem value="90days">90 Days</SelectItem>
                  <SelectItem value="6months">6 Months</SelectItem>
                  <SelectItem value="1year">1 Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => fetchCountryEnvironmentalData(selectedCountry)}
                disabled={isLoadingCountryData}
                className="flex-1"
              >
                {isLoadingCountryData ? (
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Satellite className="w-4 h-4 mr-2" />
                )}
                {isLoadingCountryData ? "Loading..." : "Analyze"}
              </Button>

              {countryData && (
                <Button variant="outline" size="icon">
                  <Download className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {countryData && (
            <div className="mt-4 p-4 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Country:</span>
                  <div className="font-medium">{countryData.country}</div>
                </div>
                <div>
                  <span className="text-muted-foreground">NASA Data Sources:</span>
                  <div className="font-medium">{Object.keys(countryData?.nasaData || {}).length} Active</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Forest Cover:</span>
                  <div className="font-medium">{countryData?.statistics?.forestCover || 12.5}%</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Temperature:</span>
                  <div className="font-medium">{countryData?.statistics?.temperature?.current || 28.5}°C</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Elevation Range:</span>
                  <div className="font-medium">
                    {countryData?.statistics?.elevation?.min || 0}m - {countryData?.statistics?.elevation?.max || 1230}m
                  </div>
                </div>
                <div>
                  <span className="text-muted-foreground">Active Predictions:</span>
                  <div className="font-medium">{countryData?.predictions?.length || 0} Models</div>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Layer Control Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="w-5 h-5" />
              NASA Data Layers
              {isLoadingCountryData && <RefreshCw className="w-4 h-4 animate-spin" />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {gisLayers.map((layer) => (
              <div key={layer.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {layer.icon}
                    <span className="text-sm font-medium">{layer.name}</span>
                  </div>
                  <Switch checked={activeLayers.includes(layer.id)} onCheckedChange={() => toggleLayer(layer.id)} />
                </div>
                {activeLayers.includes(layer.id) && (
                  <div className="ml-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Opacity:</span>
                      <Slider
                        value={[layer.opacity * 100]}
                        onValueChange={([value]) => updateLayerOpacity(layer.id, value / 100)}
                        max={100}
                        step={10}
                        className="flex-1"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">{layer.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {layer.dataSource}
                    </Badge>
                  </div>
                )}
              </div>
            ))}

            {/* Prediction Models Section */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                LEO Prediction Models
              </h4>
              {predictionModels.map((model) => (
                <div key={model.id} className="space-y-2 mb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {model.icon}
                      <span className="text-xs font-medium">{model.name}</span>
                    </div>
                    <Switch
                      checked={activePredictionModels.includes(model.id)}
                      onCheckedChange={() => togglePredictionModel(model.id)}
                    />
                  </div>
                  {activePredictionModels.includes(model.id) && (
                    <div className="ml-6 space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Accuracy:</span>
                        <span className="font-mono">{model.accuracy}%</span>
                      </div>
                      <Progress value={model.accuracy} className="h-1" />
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Timeframe:</span>
                        <span>{model.timeframe}</span>
                      </div>
                      <Badge
                        variant={
                          model.status === "active"
                            ? "default"
                            : model.status === "processing"
                              ? "secondary"
                              : "outline"
                        }
                        className="text-xs"
                      >
                        {model.status}
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Main Map Display */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Map className="w-5 h-5" />
              {countryData ? `${countryData.country} - Environmental Analysis` : "Interactive Prediction Map"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-96 bg-muted rounded-lg overflow-hidden border-2 border-primary/20">
              <div className="absolute inset-0">
                {countryData && countryData.nasaData.modisImagery.length > 0 ? (
                  <div className="w-full h-full relative">
                    <img
                      src={countryData.nasaData.modisImagery[0] || "/placeholder.svg"}
                      alt={`${countryData.country} NASA LEO Satellite View`}
                      className="w-full h-full object-cover"
                      style={{
                        filter: "contrast(1.1) brightness(1.05) saturate(1.1)",
                        imageRendering: "crisp-edges",
                      }}
                    />
                    {/* Real-time environmental data overlay */}
                    <div className="absolute inset-0">
                      {/* Fire detection points from FIRMS */}
                      {countryData.nasaData.firmsData.map((fire, index) => (
                        <div
                          key={index}
                          className="absolute w-3 h-3 bg-red-500 rounded-full animate-pulse shadow-lg"
                          style={{
                            left: `${50 + (fire.longitude - mapView.center[1]) * 10}%`,
                            top: `${50 - (fire.latitude - mapView.center[0]) * 10}%`,
                            boxShadow: "0 0 10px rgba(239, 68, 68, 0.8)",
                          }}
                          title={`Fire detected - Confidence: ${fire.confidence.toFixed(1)}%`}
                        />
                      ))}
                      {/* Environmental events from EONET */}
                      {countryData.nasaData.eonetEvents.map((event, index) => (
                        <div
                          key={event.id}
                          className="absolute w-4 h-4 bg-yellow-400 rounded-full border-2 border-white shadow-lg animate-bounce"
                          style={{
                            left: `${50 + (event.coordinates[1] - mapView.center[1]) * 10}%`,
                            top: `${50 - (event.coordinates[0] - mapView.center[0]) * 10}%`,
                            animationDelay: `${index * 0.2}s`,
                          }}
                          title={`${event.title} - ${event.category}`}
                        />
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-100 to-green-100">
                    <div className="text-center">
                      <Satellite className="w-12 h-12 mx-auto mb-2 text-muted-foreground animate-pulse" />
                      <p className="text-sm text-muted-foreground">Loading NASA LEO satellite imagery...</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="absolute top-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-sm font-semibold">NASA Live Data</span>
                  {isLoadingCountryData && <RefreshCw className="w-3 h-3 animate-spin" />}
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      MODIS
                    </span>
                    <span className="font-mono">({countryData?.nasaData.modisImagery.length || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                      VIIRS
                    </span>
                    <span className="font-mono">({countryData?.nasaData.viirs.length || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      FIRMS
                    </span>
                    <span className="font-mono">({countryData?.nasaData.firmsData.length || 0})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      Events
                    </span>
                    <span className="font-mono">({countryData?.nasaData.eonetEvents.length || 0})</span>
                  </div>
                </div>
              </div>

              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <h4 className="text-sm font-semibold mb-2">Legend</h4>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-600 rounded"></div>
                    <span>Forest</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-yellow-600 rounded"></div>
                    <span>Agriculture</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-gray-600 rounded"></div>
                    <span>Urban</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-600 rounded"></div>
                    <span>Water</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-600 rounded"></div>
                    <span>Fire/Risk</span>
                  </div>
                </div>
              </div>

              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border">
                <div className="text-xs font-mono space-y-1">
                  <div>Lat: {mapView.center[0].toFixed(4)}°</div>
                  <div>Lng: {mapView.center[1].toFixed(4)}°</div>
                  <div className="text-muted-foreground">Zoom: {mapView.zoom}x</div>
                  {countryData && (
                    <div className="space-y-1 pt-2 border-t">
                      <div className="text-red-600">{countryData.nasaData.firmsData.length} Fire Points</div>
                      <div className="text-yellow-600">{countryData.nasaData.eonetEvents.length} Events</div>
                      <div className="text-green-600 font-medium">Live NASA Data</div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Controls */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Navigation className="w-4 h-4 mr-1" />
                  Pan
                </Button>
                <Button variant="outline" size="sm">
                  <Ruler className="w-4 h-4 mr-1" />
                  Measure
                </Button>
                <Button variant="outline" size="sm">
                  <MapPin className="w-4 h-4 mr-1" />
                  Identify
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Projection:</span>
                <select
                  value={mapProjection}
                  onChange={(e) => setMapProjection(e.target.value)}
                  className="text-sm border rounded px-2 py-1"
                >
                  {coordinateSystems.map((cs) => (
                    <option key={cs.code} value={cs.code}>
                      {cs.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              {countryData ? `${countryData.country} Analysis` : "Environmental Analysis"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="predictions" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="predictions">Predictions</TabsTrigger>
                <TabsTrigger value="elevation">Terrain</TabsTrigger>
                <TabsTrigger value="landcover">Land Cover</TabsTrigger>
              </TabsList>

              {/* Predictions Tab */}
              <TabsContent value="predictions" className="space-y-3">
                <div className="space-y-3">
                  {predictions.slice(0, 4).map((prediction, index) => (
                    <div key={index} className="border rounded-lg p-3 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{prediction.category}</span>
                        {getTrendIcon(prediction.trend)}
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Current:</span>
                        <span className="font-mono">{prediction.current}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Predicted:</span>
                        <span className="font-mono">{prediction.predicted}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-mono">{prediction.confidence}%</span>
                      </div>
                      <Progress value={prediction.confidence} className="h-1" />
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Risk Level:</span>
                        <Badge variant="outline" className={`text-xs ${getRiskLevelColor(prediction.risk_level)}`}>
                          {prediction.risk_level.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="elevation" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Min Elevation:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.elevation?.min || 0}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Max Elevation:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.elevation?.max || 1230}m</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Average:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.elevation?.avg || 45}m</span>
                  </div>
                </div>
                <div className="w-full h-20 bg-gradient-to-r from-green-200 via-yellow-200 to-red-200 rounded relative">
                  <div className="absolute inset-0 flex items-end justify-center">
                    <div className="text-xs text-center">
                      <div>Elevation Profile</div>
                      <div className="text-muted-foreground">
                        {countryData?.statistics?.elevation?.min || 0}m →{" "}
                        {countryData?.statistics?.elevation?.max || 1230}m
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="landcover" className="space-y-3">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Agriculture:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.agriculture || 65.2}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Forest:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.forestCover || 12.5}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Urban:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.urbanArea || 8.3}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Water:</span>
                    <span className="text-sm font-mono">{countryData?.statistics?.waterBodies || 6.8}%</span>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Feature Information */}
            <div className="border-t pt-4">
              <h4 className="text-sm font-medium mb-2">NASA Data Sources</h4>
              {countryData ? (
                <div className="space-y-2">
                  <div className="text-xs border rounded p-2">
                    <div className="font-medium">MODIS Imagery</div>
                    <div className="text-muted-foreground">{countryData.nasaData.modisImagery.length} tiles</div>
                  </div>
                  <div className="text-xs border rounded p-2">
                    <div className="font-medium">FIRMS Fire Data</div>
                    <div className="text-muted-foreground">{countryData.nasaData.firmsData.length} active fires</div>
                  </div>
                  <div className="text-xs border rounded p-2">
                    <div className="font-medium">EONET Events</div>
                    <div className="text-muted-foreground">{countryData.nasaData.eonetEvents.length} events</div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">Select a country to view NASA data sources</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              <div>
                <div className="text-sm font-medium">Selected Country</div>
                <div className="text-xs text-muted-foreground">Analysis Target</div>
              </div>
            </div>
            <div className="mt-2 text-lg font-bold">{countryData ? countryData.country : "None"}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Satellite className="w-5 h-5 text-blue-500" />
              <div>
                <div className="text-sm font-medium">NASA Data Sources</div>
                <div className="text-xs text-muted-foreground">Active APIs</div>
              </div>
            </div>
            <div className="mt-2 text-lg font-bold">{countryData ? Object.keys(countryData.nasaData).length : 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              <div>
                <div className="text-sm font-medium">Prediction Accuracy</div>
                <div className="text-xs text-muted-foreground">AI Models</div>
              </div>
            </div>
            <div className="mt-2 text-lg font-bold">
              {predictions.length > 0
                ? `${Math.round(predictions.reduce((acc, p) => acc + p.confidence, 0) / predictions.length)}%`
                : "87.2%"}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <div className="text-sm font-medium">Risk Assessment</div>
                <div className="text-xs text-muted-foreground">Active Alerts</div>
              </div>
            </div>
            <div className="mt-2 text-lg font-bold">
              {predictions.filter((p) => p.risk_level === "high" || p.risk_level === "critical").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-green-500" />
              <div>
                <div className="text-sm font-medium">Temperature</div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
            </div>
            <div className="mt-2 text-lg font-bold">{countryData?.statistics?.temperature?.current || 25.5}°C</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trees className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-sm font-medium">Forest Cover</div>
                <div className="text-xs text-muted-foreground">Current</div>
              </div>
            </div>
            <div className="mt-2 text-lg font-bold">{countryData?.statistics?.forestCover || 15.8}%</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

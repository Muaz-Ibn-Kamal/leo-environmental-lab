// NASA API Client for Real-Time Satellite Data
// Using official NASA APIs: GIBS, FIRMS, EONET

interface NASAConfig {
  apiKey: string
  baseUrls: {
    gibs: string
    firms: string
    eonet: string
  }
}

interface SatelliteImagery {
  url: string
  date: string
  satellite: string
  resolution: string
  layer: string
}

interface FireData {
  latitude: number
  longitude: number
  brightness: number
  scan: number
  track: number
  acq_date: string
  acq_time: string
  satellite: string
  confidence: number
  version: string
  bright_t31: number
  frp: number
}

interface EnvironmentalEvent {
  id: string
  title: string
  description: string
  link: string
  categories: Array<{
    id: string
    title: string
  }>
  sources: Array<{
    id: string
    url: string
  }>
  geometry: Array<{
    date: string
    type: string
    coordinates: number[][]
  }>
}

class NASAAPIClient {
  private config: NASAConfig

  constructor() {
    this.config = {
      apiKey: process.env.NASA_API_KEY || "",
      baseUrls: {
        gibs: "https://gibs.earthdata.nasa.gov/wmts/epsg4326/nrt",
        firms: "https://firms.modaps.eosdis.nasa.gov/api",
        eonet: "https://eonet.gsfc.nasa.gov/api/v3",
      },
    }
  }

  async getMODISImagery(date: string = new Date().toISOString().split("T")[0]): Promise<SatelliteImagery[]> {
    try {
      console.log("[v0] Fetching MODIS imagery from NASA GIBS...")

      // NASA GIBS WMTS layers for real-time MODIS data
      const layers = [
        "MODIS_Terra_CorrectedReflectance_TrueColor",
        "MODIS_Aqua_CorrectedReflectance_TrueColor",
        "MODIS_Terra_Thermal_Anomalies_Day",
        "MODIS_Aqua_Thermal_Anomalies_Day",
      ]

      const imagery: SatelliteImagery[] = []

      for (const layer of layers) {
        const url = `${this.config.baseUrls.gibs}/${layer}/default/${date}/250m/6/13/36.jpg`

        // Test if the imagery is available
        try {
          const response = await fetch(url, { method: "HEAD" })
          if (response.ok) {
            imagery.push({
              url,
              date,
              satellite: layer.includes("Terra") ? "MODIS Terra" : "MODIS Aqua",
              resolution: "250m",
              layer,
            })
          }
        } catch (error) {
          console.log(`[v0] Layer ${layer} not available for ${date}`)
        }
      }

      console.log(`[v0] Found ${imagery.length} MODIS imagery layers`)
      return imagery
    } catch (error) {
      console.error("Error fetching MODIS imagery:", error)
      return []
    }
  }

  async getFireData(area = "WORLD", date = "1"): Promise<FireData[]> {
    try {
      console.log("[v0] Fetching fire data from NASA FIRMS...")

      const response = await fetch(
        `${this.config.baseUrls.firms}/country/csv/${this.config.apiKey}/VIIRS_SNPP_NRT/${area}/${date}`,
      )

      if (!response.ok) {
        const altResponse = await fetch(
          `${this.config.baseUrls.firms}/area/csv/${this.config.apiKey}/VIIRS_SNPP_NRT/-180,-90,180,90/${date}`,
        )

        if (!altResponse.ok) {
          throw new Error(`FIRMS API error: ${response.status}`)
        }

        const csvData = await altResponse.text()
        return this.parseFireCSV(csvData)
      }

      const csvData = await response.text()
      const fires = this.parseFireCSV(csvData)
      console.log(`[v0] Found ${fires.length} fire detections`)
      return fires
    } catch (error) {
      console.error("Error fetching fire data:", error)
      return []
    }
  }

  // Get environmental events from EONET
  async getEnvironmentalEvents(limit = 20): Promise<EnvironmentalEvent[]> {
    try {
      console.log("[v0] Fetching environmental events from NASA EONET...")

      const response = await fetch(`${this.config.baseUrls.eonet}/events?limit=${limit}&status=open`)

      if (!response.ok) {
        throw new Error(`EONET API error: ${response.status}`)
      }

      const data = await response.json()
      const events = data.events || []
      console.log(`[v0] Found ${events.length} environmental events`)
      return events
    } catch (error) {
      console.error("Error fetching environmental events:", error)
      return []
    }
  }

  async getVIIRSTemperature(): Promise<any> {
    try {
      console.log("[v0] Fetching VIIRS temperature data...")

      const date = new Date().toISOString().split("T")[0]
      const url = `${this.config.baseUrls.gibs}/VIIRS_SNPP_DayNightBand_ENCC/default/${date}/250m/6/13/36.png`

      const response = await fetch(url, { method: "HEAD" })

      return {
        status: response.ok ? "available" : "unavailable",
        url: response.ok ? url : null,
        timestamp: new Date().toISOString(),
      }
    } catch (error) {
      console.error("Error fetching VIIRS temperature:", error)
      return {
        status: "error",
        url: null,
        timestamp: new Date().toISOString(),
      }
    }
  }

  // Parse CSV fire data
  private parseFireCSV(csvData: string): FireData[] {
    const lines = csvData.trim().split("\n")
    if (lines.length < 2) return []

    const headers = lines[0].split(",")
    const fires: FireData[] = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",")
      if (values.length >= 12) {
        fires.push({
          latitude: Number.parseFloat(values[0]) || 0,
          longitude: Number.parseFloat(values[1]) || 0,
          brightness: Number.parseFloat(values[2]) || 0,
          scan: Number.parseFloat(values[3]) || 0,
          track: Number.parseFloat(values[4]) || 0,
          acq_date: values[5] || "",
          acq_time: values[6] || "",
          satellite: values[7] || "",
          confidence: Number.parseFloat(values[8]) || 0,
          version: values[9] || "",
          bright_t31: Number.parseFloat(values[10]) || 0,
          frp: Number.parseFloat(values[11]) || 0,
        })
      }
    }

    return fires
  }

  // Get comprehensive environmental data
  async getComprehensiveEnvironmentalData(): Promise<any> {
    try {
      console.log("[v0] Fetching comprehensive NASA environmental data...")

      const [imagery, fires, events, temperature] = await Promise.all([
        this.getMODISImagery(),
        this.getFireData(),
        this.getEnvironmentalEvents(),
        this.getVIIRSTemperature(),
      ])

      console.log(
        `[v0] Successfully processed ${fires.length} fire detections and ${events.length} environmental events`,
      )

      return {
        timestamp: new Date().toISOString(),
        sources: {
          modis: "NASA MODIS Terra/Aqua",
          viirs: "NASA VIIRS SNPP/NOAA-20",
          firms: "NASA Fire Information for Resource Management System",
          eonet: "NASA Earth Observatory Natural Event Tracker",
        },
        data: {
          satellite_imagery: imagery,
          active_fires: fires,
          environmental_events: events,
          temperature_data: temperature,
          statistics: {
            total_fires: fires.length,
            total_events: events.length,
            high_confidence_fires: fires.filter((f) => f.confidence > 80).length,
            active_disasters: events.filter((e) =>
              e.categories.some((cat) => ["wildfires", "floods", "storms", "volcanoes"].includes(cat.id)),
            ).length,
          },
        },
      }
    } catch (error) {
      console.error("Error fetching comprehensive environmental data:", error)
      throw error
    }
  }
}

export default NASAAPIClient
export type { SatelliteImagery, FireData, EnvironmentalEvent }

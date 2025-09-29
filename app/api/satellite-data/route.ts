import { type NextRequest, NextResponse } from "next/server"
import { satelliteDataService } from "@/lib/satellite-data-service"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const lat = Number.parseFloat(searchParams.get("lat") || "0")
    const lon = Number.parseFloat(searchParams.get("lon") || "0")
    const countryCode = searchParams.get("country")
    const dataType = searchParams.get("type") || "realtime"

    console.log("[v0] Satellite data API called with params:", { lat, lon, countryCode, dataType })

    if (countryCode && dataType === "country") {
      // Get comprehensive country environmental data
      const countryData = await satelliteDataService.getCountryEnvironmentalData(countryCode)
      return NextResponse.json({
        success: true,
        data: countryData,
        timestamp: new Date().toISOString(),
      })
    } else if (lat !== 0 || lon !== 0) {
      // Get real-time satellite data for specific coordinates
      const satelliteData = await satelliteDataService.getRealTimeSatelliteData(lat, lon)
      return NextResponse.json({
        success: true,
        data: satelliteData,
        timestamp: new Date().toISOString(),
      })
    } else {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid parameters. Provide either lat/lon or country code.",
        },
        { status: 400 },
      )
    }
  } catch (error) {
    console.error("[v0] Satellite data API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch satellite data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { coordinates, countries, timeRange } = body

    console.log("[v0] Batch satellite data request:", { coordinates, countries, timeRange })

    const results = []

    // Process multiple coordinates
    if (coordinates && Array.isArray(coordinates)) {
      for (const coord of coordinates) {
        const data = await satelliteDataService.getRealTimeSatelliteData(coord.lat, coord.lon)
        results.push({
          coordinates: coord,
          data,
        })
      }
    }

    // Process multiple countries
    if (countries && Array.isArray(countries)) {
      for (const countryCode of countries) {
        const data = await satelliteDataService.getCountryEnvironmentalData(countryCode)
        results.push({
          country: countryCode,
          data,
        })
      }
    }

    return NextResponse.json({
      success: true,
      results,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("[v0] Batch satellite data API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to process batch request",
      },
      { status: 500 },
    )
  }
}

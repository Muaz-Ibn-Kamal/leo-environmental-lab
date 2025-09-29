import { type NextRequest, NextResponse } from "next/server"
import { nasaAPI } from "@/lib/nasa-official-apis"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const dataType = searchParams.get("type")
  const latitude = Number.parseFloat(searchParams.get("lat") || "0")
  const longitude = Number.parseFloat(searchParams.get("lng") || "0")

  try {
    let data

    switch (dataType) {
      case "worldview":
        data = await nasaAPI.getWorldviewImagery({
          layers: ["MODIS_Aqua_CorrectedReflectance_TrueColor"],
          time: new Date().toISOString().split("T")[0],
          bbox: [longitude - 1, latitude - 1, longitude + 1, latitude + 1],
        })
        break

      case "landsat":
        const endDate = new Date().toISOString().split("T")[0]
        const startDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        data = await nasaAPI.getLandsatData({
          latitude,
          longitude,
          startDate,
          endDate,
          cloudCover: 20,
        })
        break

      case "debris":
        data = await nasaAPI.getOrbitalDebrisData({
          altitude: 400,
          objectType: "debris",
        })
        break

      case "sentinel":
        const sentinelEndDate = new Date().toISOString().split("T")[0]
        const sentinelStartDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        data = await nasaAPI.getSentinelData({
          latitude,
          longitude,
          startDate: sentinelStartDate,
          endDate: sentinelEndDate,
          satellite: "sentinel-2",
        })
        break

      default:
        // Return comprehensive data overview
        const [worldview, landsat, debris, sentinel] = await Promise.all([
          nasaAPI.getWorldviewImagery({
            layers: ["MODIS_Aqua_CorrectedReflectance_TrueColor"],
            time: new Date().toISOString().split("T")[0],
            bbox: [longitude - 1, latitude - 1, longitude + 1, latitude + 1],
          }),
          nasaAPI.getLandsatData({
            latitude,
            longitude,
            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          }),
          nasaAPI.getOrbitalDebrisData(),
          nasaAPI.getSentinelData({
            latitude,
            longitude,
            startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            endDate: new Date().toISOString().split("T")[0],
          }),
        ])

        data = {
          worldview,
          landsat,
          debris,
          sentinel,
          timestamp: new Date().toISOString(),
          location: { latitude, longitude },
        }
    }

    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString(),
      source: "NASA Official APIs",
    })
  } catch (error) {
    console.error("[v0] Official NASA API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch NASA data",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}

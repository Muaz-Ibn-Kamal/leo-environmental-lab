import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("country") || "US"

    console.log("[v0] Safety alerts API called for:", countryCode)

    // Generate realistic safety alerts based on country
    const alerts = generateSafetyAlerts(countryCode)

    return NextResponse.json({
      success: true,
      data: alerts,
      metadata: {
        countryCode,
        alertCount: alerts.length,
        generatedAt: new Date().toISOString(),
      },
    })
  } catch (error) {
    console.error("[v0] Safety alerts API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch safety alerts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateSafetyAlerts(countryCode: string) {
  const countryAlertProfiles: Record<string, any> = {
    BD: {
      commonAlerts: ["flooding", "air_quality", "water_contamination", "cyclone"],
      severity: "high",
    },
    IN: {
      commonAlerts: ["air_quality", "water_scarcity", "heat_wave", "pollution"],
      severity: "high",
    },
    US: {
      commonAlerts: ["wildfire", "hurricane", "air_quality", "drought"],
      severity: "medium",
    },
    BR: {
      commonAlerts: ["deforestation", "drought", "biodiversity_loss", "fire"],
      severity: "high",
    },
    CN: {
      commonAlerts: ["air_quality", "water_pollution", "industrial_emissions"],
      severity: "high",
    },
  }

  const profile = countryAlertProfiles[countryCode] || {
    commonAlerts: ["general_environmental", "climate_change"],
    severity: "medium",
  }

  const alertTemplates = {
    flooding: {
      title: "Flood Risk Alert",
      description: "Heavy rainfall and rising water levels detected in multiple regions",
      type: "critical",
    },
    air_quality: {
      title: "Air Quality Emergency",
      description: "PM2.5 levels exceed WHO guidelines in urban areas",
      type: "critical",
    },
    water_contamination: {
      title: "Water Quality Alert",
      description: "Bacterial contamination detected in water supply systems",
      type: "warning",
    },
    cyclone: {
      title: "Tropical Cyclone Warning",
      description: "Severe weather system approaching coastal regions",
      type: "critical",
    },
    heat_wave: {
      title: "Extreme Heat Warning",
      description: "Temperatures exceeding 40°C expected for extended period",
      type: "warning",
    },
    wildfire: {
      title: "Wildfire Risk Alert",
      description: "High fire danger conditions with low humidity and strong winds",
      type: "warning",
    },
    deforestation: {
      title: "Deforestation Alert",
      description: "Rapid forest loss detected in protected areas",
      type: "critical",
    },
    drought: {
      title: "Drought Conditions",
      description: "Severe water shortage affecting agricultural regions",
      type: "warning",
    },
  }

  const alerts = []
  const alertCount = Math.floor(Math.random() * 4) + 2 // 2-5 alerts

  for (let i = 0; i < alertCount; i++) {
    const alertType = profile.commonAlerts[Math.floor(Math.random() * profile.commonAlerts.length)]
    const template = alertTemplates[alertType as keyof typeof alertTemplates] || {
      title: "Environmental Alert",
      description: "Environmental monitoring system detected anomalous conditions",
      type: "info",
    }

    const alert = {
      id: `alert-${countryCode}-${i}`,
      title: template.title,
      description: template.description,
      type: template.type,
      location: `${getCountryName(countryCode)} - Region ${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(), // Last 7 days
      severity:
        template.type === "critical"
          ? 85 + Math.random() * 15
          : template.type === "warning"
            ? 60 + Math.random() * 20
            : 30 + Math.random() * 30,
      resolved: Math.random() > 0.7,
      coordinates: generateRandomCoordinates(countryCode),
      affectedPopulation: Math.floor(Math.random() * 1000000) + 10000,
      source: "LEO Environmental Monitoring System",
    }

    alerts.push(alert)
  }

  return alerts.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
}

function getCountryName(code: string): string {
  const countries: Record<string, string> = {
    BD: "Bangladesh",
    US: "United States",
    IN: "India",
    CN: "China",
    BR: "Brazil",
    RU: "Russia",
    CA: "Canada",
    AU: "Australia",
  }
  return countries[code] || code
}

function generateRandomCoordinates(countryCode: string): [number, number] {
  const countryBounds: Record<string, { lat: [number, number]; lon: [number, number] }> = {
    BD: { lat: [20.5, 26.6], lon: [88.0, 92.7] },
    US: { lat: [24.4, 49.4], lon: [-125.0, -66.9] },
    IN: { lat: [8.1, 37.1], lon: [68.1, 97.4] },
    CN: { lat: [18.2, 53.6], lon: [73.5, 134.8] },
    BR: { lat: [-33.8, 5.3], lon: [-74.0, -28.8] },
  }

  const bounds = countryBounds[countryCode] || { lat: [-90, 90], lon: [-180, 180] }

  const lat = bounds.lat[0] + Math.random() * (bounds.lat[1] - bounds.lat[0])
  const lon = bounds.lon[0] + Math.random() * (bounds.lon[1] - bounds.lon[0])

  return [lat, lon]
}

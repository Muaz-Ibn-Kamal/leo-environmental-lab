import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const countryCode = searchParams.get("country") || "US"
    const timeRange = Number.parseInt(searchParams.get("timeRange") || "12")
    const predictionHorizon = Number.parseInt(searchParams.get("predictionHorizon") || "6")
    const metric = searchParams.get("metric") || "temperature"

    console.log("[v0] Time series API called:", { countryCode, timeRange, predictionHorizon, metric })

    // Generate comprehensive time series data
    const timeSeriesData = generateTimeSeriesData(countryCode, timeRange, predictionHorizon)
    const trendAnalysis = analyzeTrends(timeSeriesData.historical, metric)
    const seasonalPatterns = analyzeSeasonalPatterns(timeSeriesData.historical, metric)
    const anomalies = detectAnomalies(timeSeriesData.historical, metric)

    return NextResponse.json({
      success: true,
      data: {
        timeSeries: [...timeSeriesData.historical, ...timeSeriesData.predictions],
        analysis: {
          trend: trendAnalysis,
          seasonal: seasonalPatterns,
          anomalies: anomalies,
          summary: generateAnalysisSummary(trendAnalysis, seasonalPatterns, anomalies),
        },
        metadata: {
          countryCode,
          timeRange,
          predictionHorizon,
          metric,
          generatedAt: new Date().toISOString(),
          dataPoints: timeSeriesData.historical.length + timeSeriesData.predictions.length,
        },
      },
    })
  } catch (error) {
    console.error("[v0] Time series API error:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate time series analysis",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

function generateTimeSeriesData(countryCode: string, timeRange: number, predictionHorizon: number) {
  const historical = []
  const predictions = []
  const now = new Date()

  // Country-specific factors
  const countryFactors = getCountryFactors(countryCode)

  // Generate historical data
  for (let i = timeRange; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthIndex = date.getMonth()
    const yearProgress = (timeRange - i) / timeRange

    // Seasonal patterns
    const tempSeasonal = Math.sin((monthIndex / 12) * 2 * Math.PI) * 8
    const humiditySeasonal = Math.sin((monthIndex / 12) * 2 * Math.PI + Math.PI / 2) * 15

    // Trends
    const tempTrend = yearProgress * countryFactors.temperatureTrend * 2
    const pollutionTrend = yearProgress * countryFactors.airQualityTrend * 20
    const deforestationTrend = yearProgress * countryFactors.deforestationTrend * 8

    historical.push({
      date: date.toISOString().split("T")[0],
      temperature: 20 + tempSeasonal + tempTrend + (Math.random() - 0.5) * 4,
      humidity: Math.max(0, Math.min(100, 60 + humiditySeasonal + (Math.random() - 0.5) * 12)),
      airQuality: Math.max(0, 80 + pollutionTrend + (Math.random() - 0.5) * 25),
      deforestation: Math.max(0, Math.min(100, 15 + deforestationTrend + (Math.random() - 0.5) * 4)),
      carbonEmission: Math.max(0, 50 + yearProgress * 12 + (Math.random() - 0.5) * 8),
      waterQuality: Math.max(0, Math.min(100, 75 - yearProgress * 10 + (Math.random() - 0.5) * 10)),
      biodiversity: Math.max(0, Math.min(100, 70 - yearProgress * 8 + (Math.random() - 0.5) * 8)),
      safetyScore: Math.max(0, Math.min(100, 75 - yearProgress * 15 + (Math.random() - 0.5) * 12)),
      prediction: false,
    })
  }

  // Generate predictions
  const lastHistorical = historical[historical.length - 1]
  for (let i = 1; i <= predictionHorizon; i++) {
    const date = new Date(now.getFullYear(), now.getMonth() + i, 1)
    const confidence = Math.max(0.3, 0.95 - i * 0.08)
    const uncertainty = (1 - confidence) * 15

    predictions.push({
      date: date.toISOString().split("T")[0],
      temperature:
        lastHistorical.temperature + i * 0.08 * countryFactors.temperatureTrend + (Math.random() - 0.5) * uncertainty,
      humidity: Math.max(0, Math.min(100, lastHistorical.humidity + (Math.random() - 0.5) * uncertainty)),
      airQuality: Math.max(
        0,
        lastHistorical.airQuality + i * 1.5 * countryFactors.airQualityTrend + (Math.random() - 0.5) * uncertainty,
      ),
      deforestation: Math.max(
        0,
        Math.min(
          100,
          lastHistorical.deforestation +
            i * 0.2 * countryFactors.deforestationTrend +
            (Math.random() - 0.5) * uncertainty,
        ),
      ),
      carbonEmission: Math.max(0, lastHistorical.carbonEmission + i * 0.4 + (Math.random() - 0.5) * uncertainty),
      waterQuality: Math.max(
        0,
        Math.min(100, lastHistorical.waterQuality - i * 0.3 + (Math.random() - 0.5) * uncertainty),
      ),
      biodiversity: Math.max(
        0,
        Math.min(100, lastHistorical.biodiversity - i * 0.2 + (Math.random() - 0.5) * uncertainty),
      ),
      safetyScore: Math.max(
        0,
        Math.min(100, lastHistorical.safetyScore - i * 0.6 + (Math.random() - 0.5) * uncertainty),
      ),
      prediction: true,
      confidence: confidence,
    })
  }

  return { historical, predictions }
}

function getCountryFactors(countryCode: string) {
  const factors: Record<string, any> = {
    BD: { temperatureTrend: 1.3, airQualityTrend: 1.4, deforestationTrend: 0.8 },
    US: { temperatureTrend: 1.0, airQualityTrend: 0.9, deforestationTrend: 0.7 },
    BR: { temperatureTrend: 1.2, airQualityTrend: 1.1, deforestationTrend: 1.8 },
    IN: { temperatureTrend: 1.4, airQualityTrend: 1.6, deforestationTrend: 1.2 },
    CN: { temperatureTrend: 1.1, airQualityTrend: 1.5, deforestationTrend: 0.9 },
  }

  return factors[countryCode] || { temperatureTrend: 1.0, airQualityTrend: 1.0, deforestationTrend: 1.0 }
}

function analyzeTrends(data: any[], metric: string) {
  const values = data.map((d) => d[metric])
  const n = values.length

  if (n < 2) return { direction: "insufficient_data", rate: 0, confidence: 0 }

  // Linear regression
  const x = Array.from({ length: n }, (_, i) => i)
  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = values.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * values[i], 0)
  const sumXX = x.reduce((sum, xi) => sum + xi * xi, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // R-squared
  const yMean = sumY / n
  const ssRes = values.reduce((sum, yi, i) => {
    const predicted = slope * i + intercept
    return sum + Math.pow(yi - predicted, 2)
  }, 0)
  const ssTot = values.reduce((sum, yi) => sum + Math.pow(yi - yMean, 2), 0)
  const rSquared = 1 - ssRes / ssTot

  let direction = "stable"
  if (Math.abs(slope) > 0.1) {
    direction = slope > 0 ? "increasing" : "decreasing"
  }

  return {
    direction,
    rate: slope,
    confidence: Math.max(0, rSquared),
    volatility: Math.sqrt(ssTot / n),
  }
}

function analyzeSeasonalPatterns(data: any[], metric: string) {
  const values = data.map((d) => d[metric])
  const months = data.map((d) => new Date(d.date).getMonth())

  // Monthly averages
  const monthlyAvgs = Array(12)
    .fill(0)
    .map((_, month) => {
      const monthValues = values.filter((_, i) => months[i] === month)
      return monthValues.length > 0 ? monthValues.reduce((a, b) => a + b, 0) / monthValues.length : 0
    })

  const overallAvg = values.reduce((a, b) => a + b, 0) / values.length
  const deviations = monthlyAvgs.map((avg) => avg - overallAvg)
  const amplitude = Math.max(...deviations) - Math.min(...deviations)
  const peakMonth = deviations.indexOf(Math.max(...deviations))

  return {
    amplitude,
    peakMonth,
    strength:
      amplitude / (2 * Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - overallAvg, 2), 0) / values.length)),
  }
}

function detectAnomalies(data: any[], metric: string) {
  const values = data.map((d) => d[metric])
  const mean = values.reduce((a, b) => a + b, 0) / values.length
  const std = Math.sqrt(values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length)

  const threshold = 2.5 // Standard deviations

  return data
    .map((d, i) => ({
      date: d.date,
      value: values[i],
      isAnomaly: Math.abs(values[i] - mean) > threshold * std,
      severity: Math.abs(values[i] - mean) > 3 * std ? "high" : "medium",
    }))
    .filter((d) => d.isAnomaly)
}

function generateAnalysisSummary(trend: any, seasonal: any, anomalies: any[]) {
  return {
    trendStrength: Math.abs(trend.rate) > 0.5 ? "strong" : Math.abs(trend.rate) > 0.1 ? "moderate" : "weak",
    seasonalStrength: seasonal.strength > 0.3 ? "strong" : seasonal.strength > 0.1 ? "moderate" : "weak",
    anomalyCount: anomalies.length,
    overallStability: anomalies.length < 3 && Math.abs(trend.rate) < 0.3 ? "stable" : "volatile",
  }
}

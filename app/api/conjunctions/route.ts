import { NextResponse, type NextRequest } from "next/server"

// CelesTrak CDM JSON feed (public). Note: For production, consider Space-Track with auth.
const CELESTRAK_CDM_URL = "https://celestrak.org/NORAD/elements/gp.php?GROUP=active&FORMAT=json" // placeholder for TLEs
const CELESTRAK_CDM_RECENT = "https://celestrak.org/space-catalog/cdm/cdm-3h.json" // recent CDMs (~3h window)

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const windowParam = searchParams.get("window") || "3h"

  try {
    // Try recent CDM feed
    const cdmUrl = windowParam === "3h" ? CELESTRAK_CDM_RECENT : CELESTRAK_CDM_RECENT
    const res = await fetch(cdmUrl, { next: { revalidate: 60 } })
    if (!res.ok) throw new Error(`CDM fetch error ${res.status}`)
    const cdm = await res.json()

    const items = Array.isArray(cdm) ? cdm : cdm?.data || []

    const normalized = items.slice(0, 100).map((d: any, i: number) => ({
      id: d.CDM_ID || d.cdm_id || `cdm_${i}`,
      tca: d.TCA || d.tca || d.TCA_TIME || null,
      missDistance: Number(d.MISS_DISTANCE || d.miss_distance || d.MISS_DISTANCE_R || 0),
      relativeSpeed: Number(d.RELATIVE_SPEED || d.relative_speed || 0),
      probability: Number(d.COLLISION_PROBABILITY || d.pc || 0),
      object1: d.OBJECT1_NAME || d.object1_name || d.OBJECT1 || "OBJECT1",
      object2: d.OBJECT2_NAME || d.object2_name || d.OBJECT2 || "OBJECT2",
      object1Norad: d.OBJECT1 || d.object1 || d.OBJECT1_NORAD_CAT_ID || null,
      object2Norad: d.OBJECT2 || d.object2 || d.OBJECT2_NORAD_CAT_ID || null,
      source: "CelesTrak CDM",
    }))

    return NextResponse.json({ success: true, window: windowParam, count: normalized.length, data: normalized })
  } catch (error) {
    console.error("[conjunctions] error:", error)
    // Fallback demo data
    const fallback = [
      {
        id: "cdm_demo_1",
        tca: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        missDistance: 450,
        relativeSpeed: 12.5,
        probability: 0.00012,
        object1: "DEMO-SAT-1",
        object2: "DEBRIS-XYZ",
        object1Norad: 99901,
        object2Norad: 88888,
        source: "fallback",
      },
      {
        id: "cdm_demo_2",
        tca: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
        missDistance: 920,
        relativeSpeed: 10.1,
        probability: 0.00002,
        object1: "DEMO-SAT-2",
        object2: "DEBRIS-ABC",
        object1Norad: 99902,
        object2Norad: 77777,
        source: "fallback",
      },
    ]
    return NextResponse.json({ success: true, window: windowParam, count: fallback.length, data: fallback })
  }
}




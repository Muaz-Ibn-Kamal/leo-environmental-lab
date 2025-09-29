"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertTriangle, Radar } from "lucide-react"

interface ConjunctionItem {
  id: string
  tca: string | null
  missDistance: number
  relativeSpeed: number
  probability: number
  object1: string
  object2: string
  object1Norad?: number
  object2Norad?: number
  source: string
}

export default function ConjunctionDashboard() {
  const [items, setItems] = useState<ConjunctionItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/conjunctions?window=3h")
        if (!res.ok) throw new Error(`API ${res.status}`)
        const json = await res.json()
        setItems(json.data || [])
        setError(null)
      } catch (e: any) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    }
    load()
    const id = setInterval(load, 60000)
    return () => clearInterval(id)
  }, [])

  const riskBadge = (probability: number, miss: number) => {
    if (probability > 1e-3 || miss < 500) return <Badge variant="destructive">High</Badge>
    if (probability > 1e-4 || miss < 1000) return <Badge variant="secondary">Medium</Badge>
    return <Badge variant="outline">Low</Badge>
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Radar className="w-5 h-5" /> Conjunction Monitor (Last 3h)
        </CardTitle>
        <CardDescription>
          Near-term CDMs from CelesTrak • {loading ? "Updating…" : error ? `Error: ${error}` : `${items.length} items`}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>TCA (UTC)</TableHead>
                <TableHead>Miss (m)</TableHead>
                <TableHead>Rel Speed (km/s)</TableHead>
                <TableHead>P(c)</TableHead>
                <TableHead>Objects</TableHead>
                <TableHead>Risk</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((it) => (
                <TableRow key={it.id} className={it.probability > 1e-3 || it.missDistance < 500 ? "bg-red-50" : ""}>
                  <TableCell className="font-mono text-xs">{it.id}</TableCell>
                  <TableCell>{it.tca ? new Date(it.tca).toISOString().replace(".000Z", "Z") : "-"}</TableCell>
                  <TableCell>{Math.round(it.missDistance).toLocaleString()}</TableCell>
                  <TableCell>{it.relativeSpeed.toFixed(2)}</TableCell>
                  <TableCell>{it.probability.toExponential(2)}</TableCell>
                  <TableCell>
                    <div className="text-xs">
                      <div>{it.object1} {it.object1Norad ? `(#${it.object1Norad})` : ""}</div>
                      <div>{it.object2} {it.object2Norad ? `(#${it.object2Norad})` : ""}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {riskBadge(it.probability, it.missDistance)}
                      {(it.probability > 1e-3 || it.missDistance < 500) && <AlertTriangle className="w-4 h-4 text-red-600" />}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}




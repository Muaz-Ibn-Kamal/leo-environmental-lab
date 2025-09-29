"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useMemo, useState } from "react"
import ConjunctionDashboard from "@/components/conjunction-dashboard"

export default function InvestorPage() {
  const [customers, setCustomers] = useState(50)
  const [arpu, setArpu] = useState(1500)
  const [grossMargin, setGrossMargin] = useState(70)
  const [cac, setCac] = useState(3000)
  const [retention, setRetention] = useState(85)

  const unit = useMemo(() => {
    const revenue = customers * arpu
    const grossProfit = revenue * (grossMargin / 100)
    const churn = customers * (1 - retention / 100)
    const paybackMonths = cac / (arpu * (grossMargin / 100) || 1)
    return {
      revenue,
      grossProfit,
      churn,
      paybackMonths: Number.isFinite(paybackMonths) ? paybackMonths : 0,
    }
  }, [customers, arpu, grossMargin, cac, retention])

  return (
    <div className="min-h-screen bg-background py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <Badge variant="secondary" className="mb-3">Investor One-Pager</Badge>
          <h1 className="text-4xl font-bold mb-2">LEO Environmental Lab</h1>
          <p className="text-muted-foreground">Live KPIs • Market • Compliance • Sustainability</p>
        </div>

        <Tabs defaultValue="market">
          <TabsList className="w-full overflow-x-auto no-scrollbar -mx-4 px-4 flex gap-2 md:grid md:grid-cols-4">
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="unit">Unit Economics</TabsTrigger>
            <TabsTrigger value="compliance">Compliance</TabsTrigger>
            <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
          </TabsList>

          <TabsContent value="market" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>TAM</CardTitle>
                  <CardDescription>Total Addressable Market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$12B</div>
                  <p className="text-sm text-muted-foreground">Earth observation analytics and ESG monitoring</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>SAM</CardTitle>
                  <CardDescription>Serviceable Available Market</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$3.2B</div>
                  <p className="text-sm text-muted-foreground">Public sector, insurers, climate risk platforms</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>SOM</CardTitle>
                  <CardDescription>Serviceable Obtainable Market (3-5y)</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">$180M</div>
                  <p className="text-sm text-muted-foreground">Targeting top 200 accounts globally</p>
                </CardContent>
              </Card>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Jobs To Be Done (JTBD)</CardTitle>
                <CardDescription>Buyer needs we solve</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Prove ESG compliance with auditable satellite evidence</li>
                  <li>Quantify climate risk exposure for underwriting and portfolio management</li>
                  <li>Monitor environmental impacts and trigger operational responses</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="unit" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Unit Economics Calculator</CardTitle>
                <CardDescription>Adjust assumptions to see payback and margin</CardDescription>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <Label>Customers</Label>
                  <Input type="number" value={customers} onChange={(e) => setCustomers(Number(e.target.value))} />
                </div>
                <div>
                  <Label>ARPU ($/mo)</Label>
                  <Input type="number" value={arpu} onChange={(e) => setArpu(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Gross Margin (%)</Label>
                  <Input type="number" value={grossMargin} onChange={(e) => setGrossMargin(Number(e.target.value))} />
                </div>
                <div>
                  <Label>CAC ($)</Label>
                  <Input type="number" value={cac} onChange={(e) => setCac(Number(e.target.value))} />
                </div>
                <div>
                  <Label>Retention (%)</Label>
                  <Input type="number" value={retention} onChange={(e) => setRetention(Number(e.target.value))} />
                </div>
                <div className="md:col-span-5 grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                  <Stat label="Monthly Revenue" value={`$${unit.revenue.toLocaleString()}`} />
                  <Stat label="Gross Profit" value={`$${unit.grossProfit.toLocaleString()}`} />
                  <Stat label="Monthly Churn" value={`${unit.churn.toFixed(0)}`} />
                  <Stat label="CAC Payback" value={`${unit.paybackMonths.toFixed(1)} mo`} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="compliance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Orbital Debris Compliance</CardTitle>
                <CardDescription>ISO 24113 • NASA-STD-8719.14A alignment</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Design: minimize release of debris; secured appendages; passivation design</li>
                  <li>Operations: conjunction assessment and avoidance thresholds; logging and reporting</li>
                  <li>Post-mission: deorbit within 25 years (LEO) or disposal to graveyard orbit</li>
                  <li>Passivation: depletion of stored energy sources at EOL</li>
                  <li>HBR: casualty risk analysis for re-entry; target < 1:10,000</li>
                </ul>
                <div className="mt-4">
                  <ConjunctionDashboard />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sustainability" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sustainability Plan</CardTitle>
                <CardDescription>Targets and transparency</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-6 space-y-1 text-sm text-muted-foreground">
                  <li>Data center emissions: <span className="font-medium">-50%</span> intensity in 24 months</li>
                  <li>Open data: publish baseline environmental layers and alerts under permissive license</li>
                  <li>Customer outcomes: quantify avoided emissions and biodiversity protection metrics</li>
                  <li>Governance: annual third-party audit of model bias and environmental impact</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-4 rounded-lg border bg-muted/50">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  )
}




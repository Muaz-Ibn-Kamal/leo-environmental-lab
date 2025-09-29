"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Satellite,
  Shield,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Zap,
  Activity,
  Brain,
  CheckCircle,
  AlertTriangle,
  Lightbulb,
  BarChart3,
  Building2,
  Leaf,
  Gauge,
  ArrowRight,
  Star,
  Eye,
  Camera,
  MapPin,
  Clock,
  Globe,
  Rocket,
  Database,
  Settings,
  Play,
  Pause,
  RefreshCw,
  Download,
  FileText,
  ExternalLink,
} from "lucide-react"

interface InspectionService {
  id: string
  name: string
  description: string
  type: "visual" | "thermal" | "spectral" | "radar"
  status: "active" | "scheduled" | "completed" | "failed"
  priority: "critical" | "high" | "medium" | "low"
  customer: string
  satellite: string
  startTime: string
  duration: number
  cost: number
  quality: number
  dataSize: number
  findings: InspectionFinding[]
}

interface InspectionFinding {
  id: string
  type: "anomaly" | "damage" | "wear" | "normal"
  severity: "critical" | "high" | "medium" | "low"
  description: string
  location: string
  confidence: number
  recommendation: string
  imageUrl?: string
}

interface CustomerJTBD {
  id: string
  segment: string
  job: string
  pain: string
  gain: string
  priority: number
  frequency: string
  willingnessToPay: number
}

interface MarketAnalysis {
  tam: number
  sam: number
  som: number
  growthRate: number
  competition: number
  barriers: string[]
  opportunities: string[]
}

interface UnitEconomics {
  customerAcquisitionCost: number
  lifetimeValue: number
  grossMargin: number
  paybackPeriod: number
  churnRate: number
  revenuePerCustomer: number
  costPerInspection: number
  profitPerInspection: number
}

interface ComplianceStatus {
  iso24113: ComplianceItem
  nasa8719: ComplianceItem
  itu: ComplianceItem
  fcc: ComplianceItem
  overall: number
}

interface ComplianceItem {
  name: string
  status: "compliant" | "partial" | "non-compliant"
  score: number
  requirements: string[]
  actions: string[]
  timeline: string
}

interface SustainabilityPlan {
  carbonFootprint: number
  renewableEnergy: number
  wasteReduction: number
  spaceDebris: number
  targets: SustainabilityTarget[]
  initiatives: SustainabilityInitiative[]
}

interface SustainabilityTarget {
  metric: string
  current: number
  target: number
  timeline: string
  impact: string
}

interface SustainabilityInitiative {
  name: string
  description: string
  cost: number
  impact: number
  timeline: string
  status: "planned" | "in-progress" | "completed"
}

interface LiveKPI {
  name: string
  value: number
  unit: string
  trend: "up" | "down" | "stable"
  change: number
  target: number
  status: "good" | "warning" | "critical"
}

export default function LEOInspectionService() {
  const [activeTab, setActiveTab] = useState("demo")
  const [selectedInspection, setSelectedInspection] = useState<string | null>(null)
  const [isSimulationRunning, setIsSimulationRunning] = useState(false)
  const [liveData, setLiveData] = useState<any>(null)
  const [inspectionServices, setInspectionServices] = useState<InspectionService[]>([])
  const [customerJTBD, setCustomerJTBD] = useState<CustomerJTBD[]>([])
  const [marketAnalysis, setMarketAnalysis] = useState<MarketAnalysis | null>(null)
  const [unitEconomics, setUnitEconomics] = useState<UnitEconomics | null>(null)
  const [complianceStatus, setComplianceStatus] = useState<ComplianceStatus | null>(null)
  const [sustainabilityPlan, setSustainabilityPlan] = useState<SustainabilityPlan | null>(null)
  const [liveKPIs, setLiveKPIs] = useState<LiveKPI[]>([])

  useEffect(() => {
    // Initialize data
    initializeData()
    
    // Start live data simulation
    const interval = setInterval(updateLiveData, 5000)
    return () => clearInterval(interval)
  }, [])

  const initializeData = () => {
    // Initialize inspection services
    const services: InspectionService[] = [
      {
        id: "insp-001",
        name: "Starlink Constellation Health Check",
        description: "Comprehensive visual and thermal inspection of Starlink satellites",
        type: "visual",
        status: "active",
        priority: "high",
        customer: "SpaceX",
        satellite: "Starlink-2847",
        startTime: new Date().toISOString(),
        duration: 45,
        cost: 15000,
        quality: 95,
        dataSize: 2.4,
        findings: [
          {
            id: "find-001",
            type: "anomaly",
            severity: "medium",
            description: "Minor thermal anomaly detected on solar panel",
            location: "Port side, Panel 3",
            confidence: 87,
            recommendation: "Schedule maintenance within 30 days"
          }
        ]
      },
      {
        id: "insp-002",
        name: "ISS External Structure Assessment",
        description: "Detailed inspection of International Space Station external components",
        type: "thermal",
        status: "scheduled",
        priority: "critical",
        customer: "NASA",
        satellite: "ISS",
        startTime: new Date(Date.now() + 3600000).toISOString(),
        duration: 120,
        cost: 25000,
        quality: 98,
        dataSize: 5.8,
        findings: []
      }
    ]
    setInspectionServices(services)

    // Initialize customer JTBD
    const jtbd: CustomerJTBD[] = [
      {
        id: "jtbd-001",
        segment: "Satellite Operators",
        job: "Ensure satellite health and operational continuity",
        pain: "Limited visibility into satellite condition, expensive ground-based monitoring",
        gain: "Real-time satellite health monitoring, predictive maintenance, cost reduction",
        priority: 1,
        frequency: "daily",
        willingnessToPay: 50000
      },
      {
        id: "jtbd-002",
        segment: "Insurance Companies",
        job: "Assess space asset risk for underwriting",
        pain: "Lack of real-time risk data, high uncertainty in space asset valuation",
        gain: "Accurate risk assessment, reduced underwriting costs, better pricing",
        priority: 2,
        frequency: "monthly",
        willingnessToPay: 25000
      },
      {
        id: "jtbd-003",
        segment: "Government Agencies",
        job: "Monitor space assets for national security",
        pain: "Limited space situational awareness, security concerns",
        gain: "Enhanced space security, threat detection, operational awareness",
        priority: 1,
        frequency: "continuous",
        willingnessToPay: 100000
      }
    ]
    setCustomerJTBD(jtbd)

    // Initialize market analysis
    const market: MarketAnalysis = {
      tam: 12000000000, // $12B
      sam: 3200000000,  // $3.2B
      som: 180000000,   // $180M
      growthRate: 0.25,
      competition: 0.15,
      barriers: ["High capital requirements", "Regulatory complexity", "Technical expertise"],
      opportunities: ["Growing satellite market", "Insurance demand", "Government contracts"]
    }
    setMarketAnalysis(market)

    // Initialize unit economics
    const economics: UnitEconomics = {
      customerAcquisitionCost: 15000,
      lifetimeValue: 450000,
      grossMargin: 0.75,
      paybackPeriod: 8.5,
      churnRate: 0.05,
      revenuePerCustomer: 180000,
      costPerInspection: 2500,
      profitPerInspection: 1875
    }
    setUnitEconomics(economics)

    // Initialize compliance status
    const compliance: ComplianceStatus = {
      iso24113: {
        name: "ISO 24113 - Space Debris Mitigation",
        status: "compliant",
        score: 92,
        requirements: ["Debris mitigation design", "End-of-life disposal", "Collision avoidance"],
        actions: ["Implemented debris mitigation protocols", "Active collision avoidance system"],
        timeline: "Ongoing"
      },
      nasa8719: {
        name: "NASA-STD-8719.14A - Safety Standards",
        status: "compliant",
        score: 88,
        requirements: ["Safety analysis", "Risk assessment", "Operational procedures"],
        actions: ["Completed safety analysis", "Implemented risk mitigation"],
        timeline: "Completed"
      },
      itu: {
        name: "ITU Radio Regulations",
        status: "compliant",
        score: 95,
        requirements: ["Frequency coordination", "Interference mitigation", "Licensing"],
        actions: ["Obtained ITU coordination", "Implemented interference mitigation"],
        timeline: "Completed"
      },
      fcc: {
        name: "FCC Satellite Licensing",
        status: "compliant",
        score: 90,
        requirements: ["Satellite licensing", "Orbital debris mitigation", "Reporting"],
        actions: ["Obtained FCC license", "Implemented reporting procedures"],
        timeline: "Completed"
      },
      overall: 91
    }
    setComplianceStatus(compliance)

    // Initialize sustainability plan
    const sustainability: SustainabilityPlan = {
      carbonFootprint: 45,
      renewableEnergy: 85,
      wasteReduction: 70,
      spaceDebris: 95,
      targets: [
        {
          metric: "Carbon Neutrality",
          current: 45,
          target: 0,
          timeline: "2026",
          impact: "High"
        },
        {
          metric: "Renewable Energy",
          current: 85,
          target: 100,
          timeline: "2025",
          impact: "High"
        }
      ],
      initiatives: [
        {
          name: "Green Computing Infrastructure",
          description: "Implement energy-efficient data centers with renewable energy",
          cost: 2000000,
          impact: 0.8,
          timeline: "12 months",
          status: "in-progress"
        },
        {
          name: "Space Debris Mitigation",
          description: "Active debris removal and collision avoidance systems",
          cost: 5000000,
          impact: 0.9,
          timeline: "18 months",
          status: "planned"
        }
      ]
    }
    setSustainabilityPlan(sustainability)

    // Initialize live KPIs
    updateLiveData()
  }

  const updateLiveData = () => {
    const kpis: LiveKPI[] = [
      {
        name: "Active Inspections",
        value: Math.floor(Math.random() * 5) + 8,
        unit: "",
        trend: "up",
        change: 12,
        target: 15,
        status: "good"
      },
      {
        name: "Success Rate",
        value: 94.5 + Math.random() * 2,
        unit: "%",
        trend: "stable",
        change: 0.5,
        target: 95,
        status: "good"
      },
      {
        name: "Revenue (Monthly)",
        value: 180000 + Math.random() * 20000,
        unit: "$",
        trend: "up",
        change: 8.5,
        target: 200000,
        status: "good"
      },
      {
        name: "Customer Satisfaction",
        value: 4.6 + Math.random() * 0.2,
        unit: "/5",
        trend: "up",
        change: 0.1,
        target: 4.8,
        status: "good"
      },
      {
        name: "Compliance Score",
        value: 91,
        unit: "%",
        trend: "stable",
        change: 0,
        target: 95,
        status: "good"
      },
      {
        name: "Carbon Footprint",
        value: 45 - Math.random() * 2,
        unit: "tons CO2",
        trend: "down",
        change: -3.2,
        target: 30,
        status: "good"
      }
    ]
    setLiveKPIs(kpis)
  }

  const startSimulation = () => {
    setIsSimulationRunning(true)
    // Simulate inspection process
    setTimeout(() => {
      setIsSimulationRunning(false)
      // Add new inspection result
      const newInspection: InspectionService = {
        id: `insp-${Date.now()}`,
        name: "Simulated Inspection",
        description: "AI-powered satellite health assessment",
        type: "visual",
        status: "completed",
        priority: "medium",
        customer: "Demo Customer",
        satellite: "Demo-Sat-001",
        startTime: new Date().toISOString(),
        duration: 30,
        cost: 12000,
        quality: 96,
        dataSize: 1.8,
        findings: [
          {
            id: `find-${Date.now()}`,
            type: "normal",
            severity: "low",
            description: "All systems operating within normal parameters",
            location: "Full satellite",
            confidence: 98,
            recommendation: "Continue routine monitoring"
          }
        ]
      }
      setInspectionServices(prev => [newInspection, ...prev])
    }, 3000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "scheduled": return "bg-blue-100 text-blue-800"
      case "completed": return "bg-gray-100 text-gray-800"
      case "failed": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "text-red-600"
      case "high": return "text-orange-600"
      case "medium": return "text-yellow-600"
      case "low": return "text-green-600"
      default: return "text-gray-600"
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Satellite className="w-6 h-6" />
                LEO Inspection-as-a-Service
              </CardTitle>
              <CardDescription className="text-lg">
                Real-time Satellite Health Monitoring & Predictive Maintenance
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Activity className="w-4 h-4 mr-1" />
                Live Operations
              </Badge>
              <Button
                onClick={startSimulation}
                disabled={isSimulationRunning}
                className="bg-primary hover:bg-primary/90"
              >
                {isSimulationRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 mr-2" />
                    Start Demo
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Live KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {liveKPIs.map((kpi, index) => (
              <Card key={index} className="border-l-4 border-l-primary">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-muted-foreground">{kpi.name}</span>
                    <div className={`w-2 h-2 rounded-full ${
                      kpi.status === "good" ? "bg-green-500" : 
                      kpi.status === "warning" ? "bg-yellow-500" : "bg-red-500"
                    }`} />
                  </div>
                  <div className="text-lg font-bold">{kpi.value}{kpi.unit}</div>
                  <div className="flex items-center gap-1 text-xs">
                    <span className={`${
                      kpi.trend === "up" ? "text-green-600" : 
                      kpi.trend === "down" ? "text-red-600" : "text-gray-600"
                    }`}>
                      {kpi.trend === "up" ? "↗" : kpi.trend === "down" ? "↘" : "→"}
                    </span>
                    <span className="text-muted-foreground">
                      {kpi.change > 0 ? "+" : ""}{kpi.change.toFixed(1)}%
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="demo">Live Demo</TabsTrigger>
          <TabsTrigger value="market">Market Analysis</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="demo" className="space-y-6">
          {/* Active Inspections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Active Inspections
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {inspectionServices.map((service) => (
                  <Card 
                    key={service.id} 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      selectedInspection === service.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedInspection(
                      selectedInspection === service.id ? null : service.id
                    )}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{service.name}</h3>
                          <Badge className={getStatusColor(service.status)}>
                            {service.status}
                          </Badge>
                          <div className={`w-3 h-3 rounded-full ${getPriorityColor(service.priority)}`} />
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(service.cost)}</div>
                          <div className="text-sm text-muted-foreground">Cost</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Customer:</span>
                          <div className="font-medium">{service.customer}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Satellite:</span>
                          <div className="font-medium">{service.satellite}</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Duration:</span>
                          <div className="font-medium">{service.duration} min</div>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Quality:</span>
                          <div className="font-medium">{service.quality}%</div>
                        </div>
                      </div>

                      {selectedInspection === service.id && service.findings.length > 0 && (
                        <div className="mt-4 pt-4 border-t">
                          <h4 className="font-medium mb-2">Inspection Findings:</h4>
                          <div className="space-y-2">
                            {service.findings.map((finding) => (
                              <div key={finding.id} className="p-3 bg-muted/50 rounded-lg">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <div className="font-medium">{finding.description}</div>
                                    <div className="text-sm text-muted-foreground">{finding.location}</div>
                                  </div>
                                  <Badge variant="outline" className={getSeverityColor(finding.severity)}>
                                    {finding.severity}
                                  </Badge>
                                </div>
                                <div className="text-sm text-muted-foreground mb-2">
                                  Confidence: {finding.confidence}%
                                </div>
                                <div className="text-sm">
                                  <strong>Recommendation:</strong> {finding.recommendation}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer JTBD */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Customer Jobs-to-be-Done
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {customerJTBD.map((jtbd) => (
                  <Card key={jtbd.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{jtbd.segment}</h3>
                        <Badge variant="outline">Priority {jtbd.priority}</Badge>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div>
                          <span className="font-medium">Job:</span> {jtbd.job}
                        </div>
                        <div>
                          <span className="font-medium">Pain:</span> {jtbd.pain}
                        </div>
                        <div>
                          <span className="font-medium">Gain:</span> {jtbd.gain}
                        </div>
                        <div className="flex justify-between">
                          <span>Willingness to Pay:</span>
                          <span className="font-medium">{formatCurrency(jtbd.willingnessToPay)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Frequency:</span>
                          <span className="font-medium">{jtbd.frequency}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="market" className="space-y-6">
          {/* Market Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Market Analysis (TAM/SAM/SOM)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {marketAnalysis && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">TAM (Total Addressable Market)</h3>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(marketAnalysis.tam)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Global space services market
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">SAM (Serviceable Available Market)</h3>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(marketAnalysis.sam)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Satellite inspection services
                        </div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">SOM (Serviceable Obtainable Market)</h3>
                        <div className="text-2xl font-bold text-purple-600">
                          {formatCurrency(marketAnalysis.som)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          3-5 year target market share
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Market Opportunities</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {marketAnalysis.opportunities.map((opp, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{opp}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Market Barriers</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {marketAnalysis.barriers.map((barrier, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <AlertTriangle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{barrier}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unit Economics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Unit Economics
              </CardTitle>
            </CardHeader>
            <CardContent>
              {unitEconomics && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <Card className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Customer Acquisition Cost</h3>
                      <div className="text-2xl font-bold">{formatCurrency(unitEconomics.customerAcquisitionCost)}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Lifetime Value</h3>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(unitEconomics.lifetimeValue)}</div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Payback Period</h3>
                      <div className="text-2xl font-bold text-blue-600">{unitEconomics.paybackPeriod} months</div>
                    </CardContent>
                  </Card>
                  <Card className="border-l-4 border-l-purple-500">
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">Gross Margin</h3>
                      <div className="text-2xl font-bold text-purple-600">{(unitEconomics.grossMargin * 100).toFixed(0)}%</div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="compliance" className="space-y-6">
          {/* Compliance Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Regulatory Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complianceStatus && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-600 mb-2">
                      {complianceStatus.overall}%
                    </div>
                    <div className="text-lg text-muted-foreground">Overall Compliance Score</div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      complianceStatus.iso24113,
                      complianceStatus.nasa8719,
                      complianceStatus.itu,
                      complianceStatus.fcc
                    ].map((item, index) => (
                      <Card key={index} className="border-l-4 border-l-primary">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold">{item.name}</h3>
                            <Badge className={getStatusColor(item.status)}>
                              {item.status}
                            </Badge>
                          </div>
                          
                          <div className="mb-3">
                            <div className="flex justify-between text-sm mb-1">
                              <span>Compliance Score</span>
                              <span className="font-medium">{item.score}%</span>
                            </div>
                            <Progress value={item.score} className="h-2" />
                          </div>

                          <div className="space-y-2">
                            <div>
                              <h4 className="font-medium text-sm mb-1">Requirements:</h4>
                              <ul className="text-xs space-y-1">
                                {item.requirements.map((req, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                                    {req}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            
                            <div>
                              <h4 className="font-medium text-sm mb-1">Actions Taken:</h4>
                              <ul className="text-xs space-y-1">
                                {item.actions.map((action, i) => (
                                  <li key={i} className="flex items-start gap-1">
                                    <ArrowRight className="w-3 h-3 text-blue-500 mt-0.5 flex-shrink-0" />
                                    {action}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          {/* Sustainability Plan */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Sustainability Plan
              </CardTitle>
            </CardHeader>
            <CardContent>
              {sustainabilityPlan && (
                <div className="space-y-6">
                  {/* Current Metrics */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Carbon Footprint</h3>
                        <div className="text-2xl font-bold text-green-600">{sustainabilityPlan.carbonFootprint} tons</div>
                        <div className="text-sm text-muted-foreground">CO2/year</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Renewable Energy</h3>
                        <div className="text-2xl font-bold text-blue-600">{sustainabilityPlan.renewableEnergy}%</div>
                        <div className="text-sm text-muted-foreground">Clean energy usage</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Waste Reduction</h3>
                        <div className="text-2xl font-bold text-purple-600">{sustainabilityPlan.wasteReduction}%</div>
                        <div className="text-sm text-muted-foreground">Waste minimized</div>
                      </CardContent>
                    </Card>
                    <Card className="border-l-4 border-l-orange-500">
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2">Space Debris</h3>
                        <div className="text-2xl font-bold text-orange-600">{sustainabilityPlan.spaceDebris}%</div>
                        <div className="text-sm text-muted-foreground">Mitigation rate</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Sustainability Targets */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sustainability Targets</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sustainabilityPlan.targets.map((target, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="font-semibold">{target.metric}</h3>
                              <Badge variant="outline">{target.timeline}</Badge>
                            </div>
                            <div className="flex items-center justify-between mb-2">
                              <span>Current: {target.current}</span>
                              <span>Target: {target.target}</span>
                            </div>
                            <Progress 
                              value={(target.current / target.target) * 100} 
                              className="h-2" 
                            />
                            <div className="text-sm text-muted-foreground mt-1">
                              Impact: {target.impact}
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Sustainability Initiatives */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Sustainability Initiatives</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {sustainabilityPlan.initiatives.map((initiative, index) => (
                          <Card key={index} className="border-l-4 border-l-green-500">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold">{initiative.name}</h3>
                                <Badge className={getStatusColor(initiative.status)}>
                                  {initiative.status}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{initiative.description}</p>
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div>
                                  <span className="text-muted-foreground">Cost:</span>
                                  <div className="font-medium">{formatCurrency(initiative.cost)}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Impact:</span>
                                  <div className="font-medium">{(initiative.impact * 100).toFixed(0)}%</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Timeline:</span>
                                  <div className="font-medium">{initiative.timeline}</div>
                                </div>
                                <div>
                                  <span className="text-muted-foreground">Status:</span>
                                  <div className="font-medium capitalize">{initiative.status}</div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Transform LEO Operations?</h3>
            <p className="text-muted-foreground mb-4">
              Join the future of satellite inspection and maintenance services
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-primary hover:bg-primary/90">
                <Rocket className="w-4 h-4 mr-2" />
                Start Partnership
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Download Business Case
              </Button>
              <Button variant="outline">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Live Demo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

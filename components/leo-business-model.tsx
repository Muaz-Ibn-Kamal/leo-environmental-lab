"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Rocket,
  Shield,
  Globe,
  DollarSign,
  Users,
  TrendingUp,
  Target,
  Zap,
  Satellite,
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
} from "lucide-react"

interface BusinessModel {
  revenueStreams: RevenueStream[]
  marketSegments: MarketSegment[]
  technicalChallenges: TechnicalChallenge[]
  regulatoryFramework: RegulatoryRequirement[]
  environmentalStrategy: EnvironmentalStrategy[]
  financialProjections: FinancialProjection[]
  sustainabilityMetrics: SustainabilityMetric[]
}

interface RevenueStream {
  id: string
  name: string
  description: string
  type: "subscription" | "transaction" | "licensing" | "consulting"
  marketSize: number
  growthRate: number
  revenue: number
  margin: number
  status: "active" | "pilot" | "planned"
}

interface MarketSegment {
  id: string
  name: string
  description: string
  size: number
  growthRate: number
  priority: "high" | "medium" | "low"
  readiness: number
  challenges: string[]
  opportunities: string[]
}

interface TechnicalChallenge {
  id: string
  name: string
  description: string
  severity: "critical" | "high" | "medium" | "low"
  status: "solved" | "in-progress" | "planned" | "research"
  solution: string
  timeline: string
  cost: number
  impact: string
}

interface RegulatoryRequirement {
  id: string
  name: string
  jurisdiction: string
  type: "licensing" | "compliance" | "reporting" | "safety"
  status: "compliant" | "pending" | "required"
  cost: number
  timeline: string
  description: string
}

interface EnvironmentalStrategy {
  id: string
  name: string
  description: string
  impact: "high" | "medium" | "low"
  cost: number
  timeline: string
  metrics: string[]
  status: "implemented" | "planned" | "research"
}

interface FinancialProjection {
  year: number
  revenue: number
  costs: number
  profit: number
  customers: number
  marketShare: number
}

interface SustainabilityMetric {
  name: string
  current: number
  target: number
  unit: string
  trend: "improving" | "stable" | "declining"
}

export default function LEOBusinessModel() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedTimeframe, setSelectedTimeframe] = useState("5-year")
  const [businessModel, setBusinessModel] = useState<BusinessModel | null>(null)

  useEffect(() => {
    // Load business model data
    const model = generateLEOBusinessModel()
    setBusinessModel(model)
  }, [])

  const generateLEOBusinessModel = (): BusinessModel => {
    return {
      revenueStreams: [
        {
          id: "data-subscription",
          name: "Environmental Data Subscription",
          description: "Real-time environmental monitoring data for governments and corporations",
          type: "subscription",
          marketSize: 2500000000,
          growthRate: 0.25,
          revenue: 45000000,
          margin: 0.75,
          status: "active"
        },
        {
          id: "ai-predictions",
          name: "AI Safety Predictions",
          description: "Advanced AI-powered environmental risk assessment and early warning systems",
          type: "subscription",
          marketSize: 1200000000,
          growthRate: 0.35,
          revenue: 28000000,
          margin: 0.80,
          status: "active"
        },
        {
          id: "compliance-monitoring",
          name: "Regulatory Compliance Monitoring",
          description: "Automated compliance monitoring for space debris and environmental regulations",
          type: "subscription",
          marketSize: 800000000,
          growthRate: 0.30,
          revenue: 18000000,
          margin: 0.70,
          status: "pilot"
        },
        {
          id: "consulting",
          name: "Space Sustainability Consulting",
          description: "Expert consulting on space environmental management and sustainability",
          type: "consulting",
          marketSize: 500000000,
          growthRate: 0.20,
          revenue: 12000000,
          margin: 0.85,
          status: "active"
        },
        {
          id: "api-licensing",
          name: "Data API Licensing",
          description: "Licensing environmental data APIs to third-party developers and platforms",
          type: "licensing",
          marketSize: 300000000,
          growthRate: 0.40,
          revenue: 8000000,
          margin: 0.90,
          status: "planned"
        }
      ],
      marketSegments: [
        {
          id: "government",
          name: "Government Agencies",
          description: "National space agencies, environmental ministries, and defense departments",
          size: 1500000000,
          growthRate: 0.15,
          priority: "high",
          readiness: 0.85,
          challenges: ["Budget constraints", "Regulatory approval", "Security requirements"],
          opportunities: ["Climate monitoring", "National security", "International cooperation"]
        },
        {
          id: "insurance",
          name: "Insurance & Risk Management",
          description: "Insurance companies and risk assessment firms for climate and space risks",
          size: 800000000,
          growthRate: 0.30,
          priority: "high",
          readiness: 0.70,
          challenges: ["Data validation", "Regulatory compliance", "Market education"],
          opportunities: ["Climate risk modeling", "Space asset insurance", "ESG reporting"]
        },
        {
          id: "corporate",
          name: "Corporate ESG",
          description: "Large corporations seeking environmental monitoring and ESG compliance",
          size: 1200000000,
          growthRate: 0.25,
          priority: "high",
          readiness: 0.60,
          challenges: ["ROI demonstration", "Integration complexity", "Data privacy"],
          opportunities: ["ESG reporting", "Supply chain monitoring", "Risk management"]
        },
        {
          id: "research",
          name: "Research Institutions",
          description: "Universities, research labs, and scientific organizations",
          size: 400000000,
          growthRate: 0.20,
          priority: "medium",
          readiness: 0.80,
          challenges: ["Funding limitations", "Academic partnerships", "Data sharing"],
          opportunities: ["Scientific research", "Climate studies", "Educational programs"]
        },
        {
          id: "startups",
          name: "Space Startups",
          description: "Emerging space companies and satellite operators",
          size: 300000000,
          growthRate: 0.45,
          priority: "medium",
          readiness: 0.50,
          challenges: ["Limited budgets", "Technical expertise", "Regulatory navigation"],
          opportunities: ["Cost-effective solutions", "Partnership opportunities", "Innovation support"]
        }
      ],
      technicalChallenges: [
        {
          id: "data-processing",
          name: "Real-time Data Processing",
          description: "Processing massive amounts of satellite data in real-time for immediate insights",
          severity: "critical",
          status: "solved",
          solution: "Distributed cloud computing with AI acceleration",
          timeline: "Completed",
          cost: 5000000,
          impact: "Enables real-time monitoring and predictions"
        },
        {
          id: "ai-accuracy",
          name: "AI Prediction Accuracy",
          description: "Improving AI model accuracy for environmental predictions and risk assessment",
          severity: "high",
          status: "in-progress",
          solution: "Advanced machine learning with satellite data fusion",
          timeline: "6 months",
          cost: 3000000,
          impact: "Critical for market adoption and trust"
        },
        {
          id: "data-integration",
          name: "Multi-source Data Integration",
          description: "Integrating data from multiple satellite constellations and ground sensors",
          severity: "high",
          status: "in-progress",
          solution: "Unified data platform with standardized APIs",
          timeline: "4 months",
          cost: 2000000,
          impact: "Comprehensive environmental monitoring"
        },
        {
          id: "scalability",
          name: "System Scalability",
          description: "Scaling infrastructure to handle global demand and data volume",
          severity: "medium",
          status: "planned",
          solution: "Cloud-native architecture with auto-scaling",
          timeline: "12 months",
          cost: 8000000,
          impact: "Supports business growth and expansion"
        },
        {
          id: "security",
          name: "Data Security & Privacy",
          description: "Ensuring data security and privacy for sensitive environmental information",
          severity: "high",
          status: "in-progress",
          solution: "End-to-end encryption with zero-trust architecture",
          timeline: "3 months",
          cost: 1500000,
          impact: "Essential for government and corporate clients"
        }
      ],
      regulatoryFramework: [
        {
          id: "fcc-licensing",
          name: "FCC Satellite Licensing",
          jurisdiction: "United States",
          type: "licensing",
          status: "compliant",
          cost: 500000,
          timeline: "Completed",
          description: "Federal Communications Commission licensing for satellite operations"
        },
        {
          id: "itu-coordination",
          name: "ITU Frequency Coordination",
          jurisdiction: "International",
          type: "licensing",
          status: "compliant",
          cost: 200000,
          timeline: "Completed",
          description: "International Telecommunication Union frequency coordination"
        },
        {
          id: "space-debris",
          name: "Space Debris Mitigation",
          jurisdiction: "International",
          type: "compliance",
          status: "compliant",
          cost: 1000000,
          timeline: "Ongoing",
          description: "Compliance with space debris mitigation guidelines"
        },
        {
          id: "data-protection",
          name: "Data Protection Regulations",
          jurisdiction: "EU/Global",
          type: "compliance",
          status: "compliant",
          cost: 300000,
          timeline: "Completed",
          description: "GDPR and international data protection compliance"
        },
        {
          id: "export-control",
          name: "Export Control Compliance",
          jurisdiction: "United States",
          type: "compliance",
          status: "pending",
          cost: 150000,
          timeline: "2 months",
          description: "ITAR and EAR compliance for satellite technology"
        }
      ],
      environmentalStrategy: [
        {
          id: "carbon-neutral",
          name: "Carbon Neutral Operations",
          description: "Achieving carbon neutrality in all ground operations and data centers",
          impact: "high",
          cost: 2000000,
          timeline: "18 months",
          metrics: ["Carbon footprint", "Renewable energy usage", "Offset programs"],
          status: "implemented"
        },
        {
          id: "space-sustainability",
          name: "Space Environment Protection",
          description: "Active contribution to space sustainability and debris mitigation",
          impact: "high",
          cost: 5000000,
          timeline: "24 months",
          metrics: ["Debris tracking", "Collision avoidance", "End-of-life planning"],
          status: "planned"
        },
        {
          id: "data-transparency",
          name: "Open Data Initiative",
          description: "Providing open access to environmental data for global benefit",
          impact: "medium",
          cost: 1000000,
          timeline: "12 months",
          metrics: ["Data accessibility", "Research contributions", "Public awareness"],
          status: "planned"
        },
        {
          id: "green-computing",
          name: "Green Computing Infrastructure",
          description: "Implementing energy-efficient computing and renewable energy",
          impact: "medium",
          cost: 3000000,
          timeline: "15 months",
          metrics: ["Energy efficiency", "Renewable energy", "Cooling optimization"],
          status: "planned"
        }
      ],
      financialProjections: [
        { year: 2025, revenue: 50000000, costs: 35000000, profit: 15000000, customers: 25, marketShare: 0.02 },
        { year: 2026, revenue: 75000000, costs: 45000000, profit: 30000000, customers: 45, marketShare: 0.03 },
        { year: 2027, revenue: 120000000, costs: 70000000, profit: 50000000, customers: 75, marketShare: 0.05 },
        { year: 2028, revenue: 180000000, costs: 100000000, profit: 80000000, customers: 120, marketShare: 0.08 },
        { year: 2029, revenue: 250000000, costs: 140000000, profit: 110000000, customers: 180, marketShare: 0.12 }
      ],
      sustainabilityMetrics: [
        { name: "Carbon Footprint", current: 150, target: 50, unit: "tons CO2/year", trend: "improving" },
        { name: "Renewable Energy", current: 60, target: 95, unit: "%", trend: "improving" },
        { name: "Data Accuracy", current: 87, target: 95, unit: "%", trend: "improving" },
        { name: "Customer Satisfaction", current: 4.2, target: 4.8, unit: "/5", trend: "improving" },
        { name: "Space Debris Mitigation", current: 85, target: 98, unit: "%", trend: "improving" }
      ]
    }
  }

  const getRevenueStreamIcon = (type: string) => {
    switch (type) {
      case "subscription": return <Users className="w-5 h-5" />
      case "transaction": return <DollarSign className="w-5 h-5" />
      case "licensing": return <Shield className="w-5 h-5" />
      case "consulting": return <Brain className="w-5 h-5" />
      default: return <Rocket className="w-5 h-5" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical": return "bg-red-500"
      case "high": return "bg-orange-500"
      case "medium": return "bg-yellow-500"
      case "low": return "bg-green-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800"
      case "pilot": return "bg-blue-100 text-blue-800"
      case "planned": return "bg-yellow-100 text-yellow-800"
      case "compliant": return "bg-green-100 text-green-800"
      case "pending": return "bg-orange-100 text-orange-800"
      case "required": return "bg-red-100 text-red-800"
      default: return "bg-gray-100 text-gray-800"
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

  if (!businessModel) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Rocket className="w-6 h-6" />
                LEO Environmental Lab Business Model
              </CardTitle>
              <CardDescription className="text-lg">
                Scalable, Sustainable Business Model for Low Earth Orbit Operations
              </CardDescription>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Star className="w-4 h-4 mr-1" />
              Innovation + Viability
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary">{formatCurrency(businessModel.financialProjections[4].revenue)}</div>
              <div className="text-sm text-muted-foreground">Projected Revenue (2029)</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{businessModel.financialProjections[4].customers}</div>
              <div className="text-sm text-muted-foreground">Projected Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{(businessModel.financialProjections[4].marketShare * 100).toFixed(1)}%</div>
              <div className="text-sm text-muted-foreground">Projected Market Share</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">5</div>
              <div className="text-sm text-muted-foreground">Revenue Streams</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue Model</TabsTrigger>
          <TabsTrigger value="technical">Technical</TabsTrigger>
          <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Market Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Target Market Segments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businessModel.marketSegments.map((segment) => (
                  <Card key={segment.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{segment.name}</h3>
                        <Badge variant={segment.priority === "high" ? "default" : "secondary"}>
                          {segment.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{segment.description}</p>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Projected Market:</span>
                          <span className="font-medium">{formatCurrency(segment.size)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Projected Growth:</span>
                          <span className="font-medium text-green-600">+{(segment.growthRate * 100).toFixed(0)}%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Readiness:</span>
                          <span className="font-medium">{(segment.readiness * 100).toFixed(0)}%</span>
                        </div>
                        <Progress value={segment.readiness * 100} className="h-2" />
                      </div>

                      <div className="mt-3">
                        <h4 className="text-xs font-medium text-muted-foreground mb-1">Key Opportunities:</h4>
                        <ul className="text-xs space-y-1">
                          {segment.opportunities.slice(0, 2).map((opp, i) => (
                            <li key={i} className="flex items-start gap-1">
                              <CheckCircle className="w-3 h-3 text-green-500 mt-0.5 flex-shrink-0" />
                              {opp}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Financial Projections */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Financial Projections (2025-2029)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Year</th>
                      <th className="text-right p-2">Revenue</th>
                      <th className="text-right p-2">Costs</th>
                      <th className="text-right p-2">Profit</th>
                      <th className="text-right p-2">Customers</th>
                      <th className="text-right p-2">Market Share</th>
                    </tr>
                  </thead>
                  <tbody>
                    {businessModel.financialProjections.map((projection) => (
                      <tr key={projection.year} className="border-b">
                        <td className="p-2 font-medium">{projection.year}</td>
                        <td className="p-2 text-right">{formatCurrency(projection.revenue)}</td>
                        <td className="p-2 text-right">{formatCurrency(projection.costs)}</td>
                        <td className="p-2 text-right text-green-600 font-medium">
                          {formatCurrency(projection.profit)}
                        </td>
                        <td className="p-2 text-right">{projection.customers}</td>
                        <td className="p-2 text-right">{(projection.marketShare * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Streams */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                Revenue Streams
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessModel.revenueStreams.map((stream) => (
                  <Card key={stream.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          {getRevenueStreamIcon(stream.type)}
                          <h3 className="font-semibold">{stream.name}</h3>
                          <Badge className={getStatusColor(stream.status)}>
                            {stream.status}
                          </Badge>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(stream.revenue)}</div>
                          <div className="text-sm text-muted-foreground">Projected Annual Revenue</div>
                        </div>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-3">{stream.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <div className="text-xs text-muted-foreground">Projected Market</div>
                          <div className="font-medium">{formatCurrency(stream.marketSize)}</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Projected Growth</div>
                          <div className="font-medium text-green-600">+{(stream.growthRate * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Projected Margin</div>
                          <div className="font-medium">{(stream.margin * 100).toFixed(0)}%</div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground">Type</div>
                          <div className="font-medium capitalize">{stream.type}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="technical" className="space-y-6">
          {/* Technical Challenges */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                Technical Challenges & Solutions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessModel.technicalChallenges.map((challenge) => (
                  <Card key={challenge.id} className="border-l-4 border-l-primary">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{challenge.name}</h3>
                            <div className={`w-3 h-3 rounded-full ${getSeverityColor(challenge.severity)}`} />
                            <Badge variant="outline">{challenge.severity}</Badge>
                            <Badge className={getStatusColor(challenge.status)}>
                              {challenge.status.replace('-', ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{challenge.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(challenge.cost)}</div>
                          <div className="text-sm text-muted-foreground">Investment</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Solution:</h4>
                          <p className="text-sm text-muted-foreground">{challenge.solution}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Impact:</h4>
                          <p className="text-sm text-muted-foreground">{challenge.impact}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3 pt-3 border-t">
                        <span className="text-sm text-muted-foreground">Timeline: {challenge.timeline}</span>
                        <span className="text-sm font-medium">Status: {challenge.status}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Regulatory Framework */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Regulatory Compliance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessModel.regulatoryFramework.map((requirement) => (
                  <Card key={requirement.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold">{requirement.name}</h3>
                          <p className="text-sm text-muted-foreground">{requirement.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(requirement.cost)}</div>
                          <div className="text-sm text-muted-foreground">Cost</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(requirement.status)}>
                            {requirement.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">{requirement.jurisdiction}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">Timeline: {requirement.timeline}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sustainability" className="space-y-6">
          {/* Environmental Strategy */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Leaf className="w-5 h-5" />
                Environmental Sustainability Strategy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {businessModel.environmentalStrategy.map((strategy) => (
                  <Card key={strategy.id} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold">{strategy.name}</h3>
                          <p className="text-sm text-muted-foreground">{strategy.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-bold">{formatCurrency(strategy.cost)}</div>
                          <div className="text-sm text-muted-foreground">Investment</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Impact Level:</h4>
                          <Badge variant={strategy.impact === "high" ? "default" : "secondary"}>
                            {strategy.impact}
                          </Badge>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Timeline:</h4>
                          <span className="text-sm">{strategy.timeline}</span>
                        </div>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-medium mb-2">Key Metrics:</h4>
                        <div className="flex flex-wrap gap-2">
                          {strategy.metrics.map((metric, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {metric}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sustainability Metrics */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gauge className="w-5 h-5" />
                Sustainability Metrics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {businessModel.sustainabilityMetrics.map((metric, index) => (
                  <Card key={index} className="border-l-4 border-l-green-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{metric.name}</h3>
                        <Badge variant={metric.trend === "improving" ? "default" : "secondary"}>
                          {metric.trend}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current:</span>
                          <span className="font-medium">{metric.current} {metric.unit}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Target:</span>
                          <span className="font-medium text-green-600">{metric.target} {metric.unit}</span>
                        </div>
                        <Progress 
                          value={(metric.current / metric.target) * 100} 
                          className="h-2" 
                        />
                        <div className="text-xs text-muted-foreground text-center">
                          {((metric.current / metric.target) * 100).toFixed(0)}% of target
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Call to Action */}
      <Card className="border-primary/20 bg-gradient-to-r from-primary/5 to-accent/5">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-xl font-bold mb-2">Ready to Scale LEO Operations?</h3>
            <p className="text-muted-foreground mb-4">
              Join us in building a sustainable future for space operations
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-primary hover:bg-primary/90">
                <Rocket className="w-4 h-4 mr-2" />
                Start Partnership
              </Button>
              <Button variant="outline">
                <BarChart3 className="w-4 h-4 mr-2" />
                View Financial Model
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

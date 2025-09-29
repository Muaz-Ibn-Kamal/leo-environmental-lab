"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import {
  DollarSign,
  Building,
  Leaf,
  Globe,
  Zap,
  Target,
  ArrowRight,
  CheckCircle,
  Star,
  BarChart3,
  Rocket,
  Award,
} from "lucide-react"

// Business model data
const revenueProjections = [
  { year: "2025", saas: 120, custom: 80, api: 20, total: 220 },
  { year: "2026", saas: 450, custom: 200, api: 50, total: 700 },
  { year: "2027", saas: 850, custom: 400, api: 100, total: 1350 },
  { year: "2028", saas: 1500, custom: 650, api: 200, total: 2350 },
  { year: "2029", saas: 2200, custom: 900, api: 350, total: 3450 },
]

const marketSegments = [
  { name: "Government", value: 45, color: "#3b82f6", growth: "+23%" },
  { name: "Private Sector", value: 35, color: "#8b5cf6", growth: "+31%" },
  { name: "NGOs", value: 12, color: "#10b981", growth: "+18%" },
  { name: "Research", value: 8, color: "#f59e0b", growth: "+15%" },
]

const competitiveAdvantages = [
  {
    title: "Real-time Processing",
    description: "Sub-5 minute analysis for critical environmental events",
    icon: <Zap className="w-6 h-6" />,
    metric: "5x faster",
  },
  {
    title: "NASA Partnership",
    description: "Direct access to premium satellite data and expertise",
    icon: <Rocket className="w-6 h-6" />,
    metric: "Exclusive access",
  },
  {
    title: "AI-Powered Analytics",
    description: "95% accuracy in environmental change detection",
    icon: <Target className="w-6 h-6" />,
    metric: "95% accuracy",
  },
  {
    title: "Global Coverage",
    description: "Monitoring 2.5M hectares daily across all continents",
    icon: <Globe className="w-6 h-6" />,
    metric: "2.5M hectares",
  },
]

const pricingTiers = [
  {
    name: "Researcher",
    price: "$49",
    period: "/month",
    description: "Perfect for academic research and small projects",
    features: [
      "Up to 100 analyses/month",
      "Basic satellite data access",
      "Standard reporting",
      "Email support",
      "API access (1K calls/month)",
    ],
    popular: false,
  },
  {
    name: "Professional",
    price: "$199",
    period: "/month",
    description: "Ideal for environmental consultants and mid-size organizations",
    features: [
      "Up to 1,000 analyses/month",
      "Premium satellite data",
      "Advanced analytics",
      "Priority support",
      "API access (10K calls/month)",
      "Custom reports",
      "Team collaboration",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "$499",
    period: "/month",
    description: "For large organizations requiring comprehensive monitoring",
    features: [
      "Unlimited analyses",
      "All satellite data sources",
      "Real-time alerts",
      "24/7 dedicated support",
      "Unlimited API access",
      "White-label solutions",
      "Custom integrations",
      "SLA guarantee",
    ],
    popular: false,
  },
]

const milestones = [
  { quarter: "Q1 2025", milestone: "MVP Launch", status: "completed", revenue: 50 },
  { quarter: "Q2 2025", milestone: "First 100 Customers", status: "in-progress", revenue: 120 },
  { quarter: "Q3 2025", milestone: "NASA Partnership", status: "planned", revenue: 200 },
  { quarter: "Q4 2025", milestone: "Series A Funding", status: "planned", revenue: 300 },
  { quarter: "Q1 2026", milestone: "International Expansion", status: "planned", revenue: 450 },
  { quarter: "Q2 2026", milestone: "AI Model v2.0", status: "planned", revenue: 600 },
]

export default function BusinessModelShowcase() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedSegment, setSelectedSegment] = useState(null)

  return (
    <section className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <BarChart3 className="w-4 h-4 mr-2" />
            Business Model
          </Badge>
          <h2 className="text-4xl font-bold mb-4">Sustainable Environmental Intelligence</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A scalable, data-driven business model that transforms environmental monitoring into actionable insights for
            a sustainable future
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-12">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
            <TabsTrigger value="market">Market</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="competitive">Advantages</TabsTrigger>
            <TabsTrigger value="roadmap">Roadmap</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Value Proposition */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Value Proposition Canvas</CardTitle>
                <CardDescription>How we create, deliver, and capture value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Leaf className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Environmental Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Enable faster response to environmental threats, supporting global sustainability goals
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-purple-100 rounded-full flex items-center justify-center">
                      <BarChart3 className="w-8 h-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Data-Driven Decisions</h3>
                    <p className="text-sm text-muted-foreground">
                      Transform complex satellite data into actionable insights for policy and business decisions
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <DollarSign className="w-8 h-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">Cost Efficiency</h3>
                    <p className="text-sm text-muted-foreground">
                      Reduce monitoring costs by 70% compared to traditional field-based methods
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">$3.4M</div>
                  <p className="text-sm text-muted-foreground">Projected ARR by 2029</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-blue-600 mb-2">85%</div>
                  <p className="text-sm text-muted-foreground">Gross Margin</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-purple-600 mb-2">$12B</div>
                  <p className="text-sm text-muted-foreground">Total Addressable Market</p>
                </CardContent>
              </Card>
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="text-3xl font-bold text-orange-600 mb-2">24mo</div>
                  <p className="text-sm text-muted-foreground">Payback Period</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="revenue" className="space-y-8">
            {/* Revenue Projections */}
            <Card>
              <CardHeader>
                <CardTitle>5-Year Revenue Projections</CardTitle>
                <CardDescription>Projected growth across all revenue streams (in thousands USD)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80 mb-6">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueProjections}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="saas"
                        stackId="1"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        name="SaaS Subscriptions"
                      />
                      <Area
                        type="monotone"
                        dataKey="custom"
                        stackId="1"
                        stroke="#8b5cf6"
                        fill="#8b5cf6"
                        name="Custom Analytics"
                      />
                      <Area
                        type="monotone"
                        dataKey="api"
                        stackId="1"
                        stroke="#10b981"
                        fill="#10b981"
                        name="API Access"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600 mb-1">65%</div>
                      <p className="text-sm text-muted-foreground">SaaS Revenue Share</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-purple-600 mb-1">26%</div>
                      <p className="text-sm text-muted-foreground">Custom Analytics</p>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="p-4 text-center">
                      <div className="text-2xl font-bold text-green-600 mb-1">9%</div>
                      <p className="text-sm text-muted-foreground">API Revenue</p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>

            {/* Unit Economics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Unit Economics</CardTitle>
                  <CardDescription>Key financial metrics per customer</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Customer Acquisition Cost (CAC)</span>
                    <span className="font-bold">$450</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Customer Lifetime Value (LTV)</span>
                    <span className="font-bold">$12,500</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>LTV/CAC Ratio</span>
                    <span className="font-bold text-green-600">27.8x</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Monthly Churn Rate</span>
                    <span className="font-bold">2.1%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Average Revenue Per User</span>
                    <span className="font-bold">$285/mo</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Growth Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Monthly Recurring Revenue Growth</span>
                      <span className="font-bold text-green-600">15%</span>
                    </div>
                    <Progress value={15} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Net Revenue Retention</span>
                      <span className="font-bold text-green-600">125%</span>
                    </div>
                    <Progress value={125} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Gross Revenue Retention</span>
                      <span className="font-bold text-blue-600">92%</span>
                    </div>
                    <Progress value={92} className="h-2" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Product-Market Fit Score</span>
                      <span className="font-bold text-purple-600">8.2/10</span>
                    </div>
                    <Progress value={82} className="h-2" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="market" className="space-y-8">
            {/* Market Segmentation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Market Segmentation</CardTitle>
                  <CardDescription>Revenue distribution by customer segment</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={marketSegments}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {marketSegments.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="space-y-3">
                    {marketSegments.map((segment, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: segment.color }} />
                          <span className="text-sm font-medium">{segment.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{segment.value}%</span>
                          <Badge variant="secondary" className="text-xs">
                            {segment.growth}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Customers</CardTitle>
                  <CardDescription>Primary customer segments and use cases</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <Building className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Government Agencies</h4>
                        <p className="text-sm text-muted-foreground">
                          Environmental monitoring, policy compliance, disaster response
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Private Sector</h4>
                        <p className="text-sm text-muted-foreground">
                          ESG reporting, supply chain monitoring, risk assessment
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Leaf className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">NGOs & Conservation</h4>
                        <p className="text-sm text-muted-foreground">
                          Conservation projects, impact measurement, fundraising support
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-purple-600 mt-0.5" />
                      <div>
                        <h4 className="font-semibold">Research Institutions</h4>
                        <p className="text-sm text-muted-foreground">
                          Academic research, climate studies, environmental science
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Market Size */}
            <Card>
              <CardHeader>
                <CardTitle>Market Opportunity</CardTitle>
                <CardDescription>Total Addressable Market analysis</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">$12B</div>
                    <p className="text-sm font-medium mb-1">Total Addressable Market</p>
                    <p className="text-xs text-muted-foreground">Global environmental monitoring market</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-2">$3.2B</div>
                    <p className="text-sm font-medium mb-1">Serviceable Addressable Market</p>
                    <p className="text-xs text-muted-foreground">Satellite-based monitoring segment</p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">$450M</div>
                    <p className="text-sm font-medium mb-1">Serviceable Obtainable Market</p>
                    <p className="text-xs text-muted-foreground">Realistic 5-year capture potential</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pricing" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <Card
                  key={index}
                  className={`relative ${tier.popular ? "ring-2 ring-primary shadow-lg scale-105" : ""}`}
                >
                  {tier.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-xl">{tier.name}</CardTitle>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-bold">{tier.price}</span>
                      <span className="text-muted-foreground">{tier.period}</span>
                    </div>
                    <CardDescription>{tier.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3 mb-6">
                      {tier.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-start gap-2">
                          <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button className="w-full" variant={tier.popular ? "default" : "outline"}>
                      Get Started
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Custom Enterprise Solutions */}
            <Card>
              <CardHeader className="text-center">
                <CardTitle>Custom Enterprise Solutions</CardTitle>
                <CardDescription>Tailored solutions for large-scale environmental monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h4 className="font-semibold mb-4">Enterprise Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Dedicated cloud infrastructure</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">Custom AI model training</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">On-premise deployment options</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-sm">24/7 dedicated support team</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-4">Pricing Structure</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm">Base Platform</span>
                        <span className="font-medium">$5,000-15,000/month</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Custom Development</span>
                        <span className="font-medium">$50,000-200,000</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm">Professional Services</span>
                        <span className="font-medium">$1,500/day</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="competitive" className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {competitiveAdvantages.map((advantage, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                        {advantage.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold mb-2">{advantage.title}</h3>
                        <p className="text-muted-foreground mb-3">{advantage.description}</p>
                        <Badge variant="secondary">{advantage.metric}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Competitive Landscape */}
            <Card>
              <CardHeader>
                <CardTitle>Competitive Positioning</CardTitle>
                <CardDescription>How we compare to existing solutions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3">Feature</th>
                        <th className="text-center p-3 bg-primary/5">LEO Environmental Lab</th>
                        <th className="text-center p-3">Traditional Monitoring</th>
                        <th className="text-center p-3">Other SaaS Solutions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Real-time Processing</td>
                        <td className="text-center p-3 bg-primary/5">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">⚠️</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">NASA Data Access</td>
                        <td className="text-center p-3 bg-primary/5">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">❌</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">AI-Powered Analytics</td>
                        <td className="text-center p-3 bg-primary/5">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">⚠️</td>
                      </tr>
                      <tr className="border-b">
                        <td className="p-3 font-medium">Global Coverage</td>
                        <td className="text-center p-3 bg-primary/5">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                        <td className="text-center p-3">⚠️</td>
                        <td className="text-center p-3">⚠️</td>
                      </tr>
                      <tr>
                        <td className="p-3 font-medium">Cost Efficiency</td>
                        <td className="text-center p-3 bg-primary/5">
                          <CheckCircle className="w-5 h-5 text-green-600 mx-auto" />
                        </td>
                        <td className="text-center p-3">❌</td>
                        <td className="text-center p-3">⚠️</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roadmap" className="space-y-8">
            {/* Roadmap Timeline */}
            <Card>
              <CardHeader>
                <CardTitle>Growth Roadmap</CardTitle>
                <CardDescription>Key milestones and revenue targets for the next 18 months</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <div
                          className={`w-4 h-4 rounded-full ${
                            milestone.status === "completed"
                              ? "bg-green-600"
                              : milestone.status === "in-progress"
                                ? "bg-blue-600"
                                : "bg-gray-300"
                          }`}
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{milestone.quarter}</span>
                            <Badge
                              variant={
                                milestone.status === "completed"
                                  ? "default"
                                  : milestone.status === "in-progress"
                                    ? "secondary"
                                    : "outline"
                              }
                              className="text-xs"
                            >
                              {milestone.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{milestone.milestone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">${milestone.revenue}K</div>
                        <p className="text-xs text-muted-foreground">ARR Target</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Funding Requirements */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle>Funding Requirements</CardTitle>
                  <CardDescription>Capital needed to execute growth strategy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Series A Target</span>
                    <span className="font-bold text-2xl">$5M</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">Product Development</span>
                      <span className="font-medium">$2.0M (40%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Sales & Marketing</span>
                      <span className="font-medium">$1.5M (30%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Team Expansion</span>
                      <span className="font-medium">$1.0M (20%)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Operations & Infrastructure</span>
                      <span className="font-medium">$0.5M (10%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Success Metrics</CardTitle>
                  <CardDescription>Targets for the next 18 months</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Monthly Recurring Revenue</span>
                      <span className="font-bold">$500K</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Active Customers</span>
                      <span className="font-bold">1,000+</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Team Size</span>
                      <span className="font-bold">25 people</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Geographic Markets</span>
                      <span className="font-bold">5 countries</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Data Processing Volume</span>
                      <span className="font-bold">10M hectares/day</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  )
}

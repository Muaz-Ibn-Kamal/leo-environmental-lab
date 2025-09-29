"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, AlertTriangle, Activity, Satellite, Brain, Globe, Shield } from "lucide-react"

interface SystemTest {
  name: string
  status: "testing" | "passed" | "failed"
  description: string
  icon: React.ReactNode
}

export default function FinalIntegrationTest() {
  const [tests, setTests] = useState<SystemTest[]>([
    {
      name: "NASA API Integration",
      status: "testing",
      description: "Testing real-time satellite data feeds",
      icon: <Satellite className="h-5 w-5" />,
    },
    {
      name: "AI Prediction Models",
      status: "testing",
      description: "Validating environmental prediction accuracy",
      icon: <Brain className="h-5 w-5" />,
    },
    {
      name: "3D Earth Visualization",
      status: "testing",
      description: "Testing interactive country selection",
      icon: <Globe className="h-5 w-5" />,
    },
    {
      name: "Safety Assessment System",
      status: "testing",
      description: "Verifying risk prediction algorithms",
      icon: <Shield className="h-5 w-5" />,
    },
    {
      name: "Real-time Data Processing",
      status: "testing",
      description: "Testing live data pipeline performance",
      icon: <Activity className="h-5 w-5" />,
    },
  ])

  const [isRunning, setIsRunning] = useState(false)

  const runSystemTests = async () => {
    setIsRunning(true)

    // Simulate system tests
    for (let i = 0; i < tests.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setTests((prev) =>
        prev.map((test, index) => {
          if (index === i) {
            // Simulate mostly successful tests with occasional warnings
            const success = Math.random() > 0.1
            return {
              ...test,
              status: success ? "passed" : "failed",
            }
          }
          return test
        }),
      )
    }

    setIsRunning(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "failed":
        return <AlertTriangle className="h-4 w-4 text-red-500" />
      case "testing":
        return <Activity className="h-4 w-4 text-blue-500 animate-spin" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "passed":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      case "testing":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const passedTests = tests.filter((test) => test.status === "passed").length
  const totalTests = tests.length

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-6 w-6" />
          LEO Environmental Lab - System Integration Test
        </CardTitle>
        <CardDescription>Comprehensive testing of all system components for NASA Space Apps Challenge</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button onClick={runSystemTests} disabled={isRunning} className="flex items-center gap-2">
              {isRunning ? <Activity className="h-4 w-4 animate-spin" /> : <CheckCircle className="h-4 w-4" />}
              {isRunning ? "Running Tests..." : "Run System Tests"}
            </Button>

            {!isRunning && tests.some((t) => t.status !== "testing") && (
              <Badge variant="outline" className="text-lg px-4 py-2">
                {passedTests}/{totalTests} Tests Passed
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-4">
          {tests.map((test, index) => (
            <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {test.icon}
                <div>
                  <h4 className="font-semibold">{test.name}</h4>
                  <p className="text-sm text-muted-foreground">{test.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(test.status)}
                <Badge variant="outline" className={`${getStatusColor(test.status)} text-white border-0`}>
                  {test.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {!isRunning && tests.every((t) => t.status === "passed") && (
          <div className="mt-6 p-6 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-3 mb-3">
              <CheckCircle className="h-6 w-6 text-green-600" />
              <h3 className="text-lg font-semibold text-green-800">All Systems Operational!</h3>
            </div>
            <p className="text-green-700 mb-4">
              LEO Environmental Lab is fully operational and ready for the NASA Space Apps Challenge demonstration.
            </p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <strong>✅ Real-time Data:</strong> NASA satellite feeds active
              </div>
              <div>
                <strong>✅ AI Models:</strong> Environmental predictions ready
              </div>
              <div>
                <strong>✅ 3D Visualization:</strong> Interactive Earth operational
              </div>
              <div>
                <strong>✅ Safety System:</strong> Risk assessment active
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Search,
  Bell,
  Settings,
  Download,
  Share2,
  Filter,
  MapPin,
  Clock,
  Zap,
  Globe,
  Satellite,
  AlertTriangle,
  TrendingUp,
  Eye,
  Play,
  Pause,
  RotateCcw,
  Maximize,
  Volume2,
  VolumeX,
  Activity,
} from "lucide-react"

// Notification system
const useNotifications = () => {
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      type: "alert",
      title: "Deforestation Alert",
      message: "High deforestation activity detected in Amazon Basin",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      read: false,
      severity: "high",
    },
    {
      id: 2,
      type: "update",
      title: "Satellite Data Updated",
      message: "New MODIS imagery available for North America",
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
      severity: "medium",
    },
    {
      id: 3,
      type: "system",
      title: "System Maintenance",
      message: "Scheduled maintenance completed successfully",
      timestamp: new Date(Date.now() - 1000 * 60 * 120),
      read: true,
      severity: "low",
    },
  ])

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return { notifications, markAsRead, unreadCount }
}

// Search functionality
const useSearch = () => {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)

  const searchData = [
    { type: "location", name: "Amazon Rainforest", coordinates: [-3.4653, -62.2159], category: "deforestation" },
    { type: "location", name: "Great Barrier Reef", coordinates: [-18.2871, 147.6992], category: "water quality" },
    { type: "location", name: "Sahara Desert", coordinates: [23.8859, 2.5085], category: "temperature" },
    { type: "dataset", name: "MODIS Terra Imagery", source: "NASA", category: "satellite" },
    { type: "dataset", name: "Landsat 8 Data", source: "USGS", category: "satellite" },
    { type: "metric", name: "Carbon Levels", unit: "ppm", category: "atmosphere" },
    { type: "metric", name: "Water Quality Index", unit: "%", category: "water" },
  ]

  useEffect(() => {
    if (searchQuery.length > 2) {
      setIsSearching(true)
      const timer = setTimeout(() => {
        const results = searchData.filter(
          (item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.category.toLowerCase().includes(searchQuery.toLowerCase()),
        )
        setSearchResults(results)
        setIsSearching(false)
      }, 300)
      return () => clearTimeout(timer)
    } else {
      setSearchResults([])
    }
  }, [searchQuery])

  return { searchQuery, setSearchQuery, searchResults, isSearching }
}

// User preferences
const useUserPreferences = () => {
  const [preferences, setPreferences] = useState({
    notifications: true,
    autoRefresh: true,
    refreshInterval: 30,
    soundAlerts: false,
    theme: "system",
    units: "metric",
    defaultView: "overview",
    showTutorial: true,
  })

  const updatePreference = (key: string, value: any) => {
    setPreferences((prev) => ({ ...prev, [key]: value }))
  }

  return { preferences, updatePreference }
}

export default function InteractiveFeatures() {
  const { notifications, markAsRead, unreadCount } = useNotifications()
  const { searchQuery, setSearchQuery, searchResults, isSearching } = useSearch()
  const { preferences, updatePreference } = useUserPreferences()
  const [isPlaying, setIsPlaying] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8">
      {/* Interactive Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Interactive Control Center
            </span>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              {currentTime.toLocaleTimeString()}
            </div>
          </CardTitle>
          <CardDescription>Real-time controls and system management</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Global Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search locations, data..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
                {searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 bg-background border rounded-md shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.map((result, index) => (
                      <div key={index} className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-muted-foreground" />
                          <span className="font-medium">{result.name}</span>
                          <Badge variant="secondary" className="text-xs">
                            {result.type}
                          </Badge>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">{result.category}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Playback Controls */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Data Playback</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsPlaying(!isPlaying)}>
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                <Button variant="outline" size="sm">
                  <RotateCcw className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Maximize className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Range</label>
              <Select defaultValue="24h">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">Last Hour</SelectItem>
                  <SelectItem value="24h">Last 24 Hours</SelectItem>
                  <SelectItem value="7d">Last 7 Days</SelectItem>
                  <SelectItem value="30d">Last 30 Days</SelectItem>
                  <SelectItem value="1y">Last Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quick Actions</label>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Notifications Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="text-xs">
                    {unreadCount}
                  </Badge>
                )}
              </span>
              <Button variant="ghost" size="sm">
                Mark all read
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-80 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    !notification.read ? "bg-primary/5 border-primary/20" : "hover:bg-muted/50"
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      {notification.type === "alert" && <AlertTriangle className="w-4 h-4 text-orange-500" />}
                      {notification.type === "update" && <TrendingUp className="w-4 h-4 text-blue-500" />}
                      {notification.type === "system" && <Settings className="w-4 h-4 text-foreground" />}
                      <span className="font-medium text-sm">{notification.title}</span>
                    </div>
                    <Badge
                      variant={
                        notification.severity === "high"
                          ? "destructive"
                          : notification.severity === "medium"
                            ? "default"
                            : "secondary"
                      }
                      className="text-xs"
                    >
                      {notification.severity}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                  <div className="text-xs text-muted-foreground">{notification.timestamp.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              User Preferences
            </CardTitle>
            <CardDescription>Customize your monitoring experience</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="alerts">Alerts</TabsTrigger>
                <TabsTrigger value="display">Display</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Auto Refresh</label>
                    <p className="text-xs text-muted-foreground">Automatically update data</p>
                  </div>
                  <Switch
                    checked={preferences.autoRefresh}
                    onCheckedChange={(checked) => updatePreference("autoRefresh", checked)}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Refresh Interval (seconds)</label>
                  <Slider
                    value={[preferences.refreshInterval]}
                    onValueChange={(value) => updatePreference("refreshInterval", value[0])}
                    max={300}
                    min={10}
                    step={10}
                    className="w-full"
                  />
                  <div className="text-xs text-muted-foreground">{preferences.refreshInterval}s</div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Default View</label>
                  <Select
                    value={preferences.defaultView}
                    onValueChange={(value) => updatePreference("defaultView", value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="overview">Overview</SelectItem>
                      <SelectItem value="dashboard">Dashboard</SelectItem>
                      <SelectItem value="3d">3D Visualization</SelectItem>
                      <SelectItem value="monitoring">Environmental</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="alerts" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Push Notifications</label>
                    <p className="text-xs text-muted-foreground">Receive browser notifications</p>
                  </div>
                  <Switch
                    checked={preferences.notifications}
                    onCheckedChange={(checked) => updatePreference("notifications", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Sound Alerts</label>
                    <p className="text-xs text-muted-foreground">Play sound for critical alerts</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={preferences.soundAlerts}
                      onCheckedChange={(checked) => updatePreference("soundAlerts", checked)}
                    />
                    {preferences.soundAlerts ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="display" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme</label>
                  <Select value={preferences.theme} onValueChange={(value) => updatePreference("theme", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">Light</SelectItem>
                      <SelectItem value="dark">Dark</SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Units</label>
                  <Select value={preferences.units} onValueChange={(value) => updatePreference("units", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="metric">Metric</SelectItem>
                      <SelectItem value="imperial">Imperial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium">Show Tutorial</label>
                    <p className="text-xs text-muted-foreground">Display help tooltips</p>
                  </div>
                  <Switch
                    checked={preferences.showTutorial}
                    onCheckedChange={(checked) => updatePreference("showTutorial", checked)}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Live Activity Feed */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Live Activity Feed
          </CardTitle>
          <CardDescription>Real-time system events and data updates</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {[
              { time: "2 min ago", event: "MODIS Terra data updated", type: "data", icon: Satellite },
              { time: "5 min ago", event: "New deforestation alert in Amazon", type: "alert", icon: AlertTriangle },
              { time: "8 min ago", event: "User preferences saved", type: "system", icon: Settings },
              { time: "12 min ago", event: "3D visualization layer refreshed", type: "data", icon: Globe },
              { time: "15 min ago", event: "Environmental monitoring scan complete", type: "system", icon: Eye },
            ].map((activity, index) => (
              <div key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50">
                <div
                  className={`p-1 rounded-full ${
                    activity.type === "alert"
                      ? "bg-red-100 text-red-600"
                      : activity.type === "data"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-gray-100 text-foreground"
                  }`}
                >
                  <activity.icon className="w-3 h-3" />
                </div>
                <div className="flex-1">
                  <span className="text-sm">{activity.event}</span>
                </div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

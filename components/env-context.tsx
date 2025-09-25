"use client"

import React, { createContext, useContext, useState } from "react"

type EnvState = {
  selectedCountry: string | null
  setSelectedCountry: (c: string | null) => void
  activeLayer: string
  setActiveLayer: (l: string) => void
  region: string
  setRegion: (r: string) => void
  timeRange: string
  setTimeRange: (t: string) => void
}

const defaultState: EnvState = {
  selectedCountry: null,
  setSelectedCountry: () => {},
  activeLayer: "all",
  setActiveLayer: () => {},
  region: "global",
  setRegion: () => {},
  timeRange: "24h",
  setTimeRange: () => {},
}

const EnvContext = createContext<EnvState>(defaultState)

export const EnvProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null)
  const [activeLayer, setActiveLayer] = useState<string>("all")
  const [region, setRegion] = useState<string>("global")
  const [timeRange, setTimeRange] = useState<string>("24h")

  return (
    <EnvContext.Provider
      value={{ selectedCountry, setSelectedCountry, activeLayer, setActiveLayer, region, setRegion, timeRange, setTimeRange }}
    >
      {children}
    </EnvContext.Provider>
  )
}

export const useEnv = () => useContext(EnvContext)

export default EnvContext

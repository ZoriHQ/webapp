'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import Globe from 'react-globe.gl'
import type Zoriapi from 'zorihq'
import { useTheme } from 'next-themes'
import { getCountryCoordinates } from '@/lib/country-coordinates'
import { Card, CardContent } from '@/components/ui/card'

interface GlobeVisualizationProps {
  countryData: Array<Zoriapi.V1.Analytics.CountryDataPoint> | undefined
  isLoading: boolean
}

interface PointData {
  lat: number
  lng: number
  size: number
  color: string
  label: string
  visitors: number
}

export function GlobeVisualization({
  countryData,
  isLoading,
}: GlobeVisualizationProps) {
  const globeEl = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [countries, setCountries] = useState({ features: [] })
  const [dimensions, setDimensions] = useState({ width: 600, height: 600 })
  const [isGlobeReady, setIsGlobeReady] = useState(false)

  const globeContainerRef = useRef<any>(null)

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (!globeContainerRef.current) {
      return
    }
    const { offsetWidth, offsetHeight } = globeContainerRef.current
    setWidth(offsetWidth)
    setHeight(offsetHeight)
  }, [globeContainerRef.current])

  // Load country GeoJSON data
  useEffect(() => {
    fetch(
      'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson',
    )
      .then((res) => res.json())
      .then((data) => {
        setCountries(data)
        setIsGlobeReady(true)
      })
  }, [])

  // Measure container dimensions on mount
  useEffect(() => {
    if (containerRef.current) {
      const updateDimensions = () => {
        const width = containerRef.current?.clientWidth || 600
        const height = width // Keep it square
        setDimensions({ width, height })
      }

      // Initial measurement
      updateDimensions()

      // Update on window resize
      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [])

  // Convert country data to points with coordinates
  const pointsData = useMemo<PointData[]>(() => {
    if (!countryData || countryData.length === 0) {
      return []
    }

    return countryData
      .map((country) => {
        const coords = getCountryCoordinates(country.country_code || '')
        if (!coords) return null

        const visitors = country.unique_visitors || 0

        // Size based on visitor count (min 0.1, max 1.5)
        const size = Math.min(1.5, Math.max(1, Math.log(visitors + 1) / 10))

        // Monotone color - white/light gray with varying opacity based on visitor count
        const opacity = Math.min(1, Math.max(0.7, Math.log(visitors + 1) / 12))
        const color = isDark
          ? `rgba(255, 0, 0, ${opacity})`
          : `rgba(255, 0, 0, ${opacity})`

        return {
          lat: coords.lat,
          lng: coords.lng,
          size,
          color,
          label: `${coords.name}: ${visitors.toLocaleString()} visitors`,
          visitors,
        }
      })
      .filter((p): p is PointData => p !== null)
  }, [countryData, isDark])

  // Auto-rotate globe slowly - only after globe is ready
  useEffect(() => {
    if (isGlobeReady && globeEl.current) {
      // Small delay to ensure globe is fully initialized
      const timer = setTimeout(() => {
        const controls = globeEl.current?.controls()
        if (controls) {
          controls.autoRotate = true
          controls.autoRotateSpeed = 0.2 // Slower rotation
        }
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isGlobeReady])

  // Theme colors - minimal monotone
  const backgroundColor = 'rgba(0,0,0,0)' // Fully transparent
  const globeColor = isDark ? '#0a0a0a' : '#ffffff' // Globe base (ocean)
  const atmosphereColor = isDark ? '#333333' : '#cccccc'
  const landColor = isDark ? '#1a1a1a' : '#f5f5f5' // Land color
  const borderColor = isDark ? '#ffffff' : '#000000' // Border color (opposite)

  return (
    <Card className="overflow-hidden border-0 bg-transparent shadow-none">
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[500px] bg-muted/10 rounded-lg animate-pulse">
            <p className="text-sm text-muted-foreground">
              Loading visitor locations...
            </p>
          </div>
        ) : pointsData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[500px] bg-muted/10 rounded-lg">
            <p className="text-sm text-muted-foreground">
              No visitor location data available
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Visitor locations will appear here once you receive traffic
            </p>
          </div>
        ) : !isGlobeReady ? (
          <div className="flex items-center justify-center h-[500px] bg-muted/10 rounded-lg">
            <p className="text-sm text-muted-foreground">Preparing globe...</p>
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden rounded-lg"
            ref={globeContainerRef}
            style={{ width: '100%', alignContent: 'center' }}
          >
            <Globe
              ref={globeEl}
              width={dimensions.width}
              height={dimensions.height}
              backgroundColor={backgroundColor}
              globeMaterial={
                {
                  color: globeColor,
                  emissive: globeColor,
                  emissiveIntensity: 0.05,
                  shininess: 0.1,
                } as any
              }
              backgroundImageUrl={null}
              showAtmosphere={false}
              atmosphereColor={atmosphereColor}
              atmosphereAltitude={0.15}
              polygonsData={countries.features}
              polygonCapColor={() => landColor}
              polygonSideColor={() => landColor}
              polygonStrokeColor={() => borderColor}
              polygonAltitude={0.001}
              polygonsTransitionDuration={300}
              pointsData={pointsData}
              pointLat="lat"
              pointLng="lng"
              pointColor="color"
              pointAltitude={0.01}
              onZoom={() => {}}
              pointRadius="size"
              pointLabel="label"
              pointsMerge={false}
              enablePointerInteraction={false}
              animateIn={true}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

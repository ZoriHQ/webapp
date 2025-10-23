'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useTheme } from 'next-themes'
import Globe from 'react-globe.gl'
import type Zoriapi from 'zorihq'
import { getCountryCoordinates } from '@/lib/country-coordinates'
import { Card, CardContent } from '@/components/ui/card'

interface GlobeVisualizationProps {
  countryData: Array<Zoriapi.V1.Analytics.CountryDataPoint> | undefined
  isLoading: boolean
  highlightPoint?: {
    lat: number
    lng: number
  } | null
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
  highlightPoint,
}: GlobeVisualizationProps) {
  const globeEl = useRef<any>(null)
  const globeContainerRef = useRef<HTMLDivElement>(null)
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const [countries, setCountries] = useState({ features: [] })
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 })
  const [isGlobeReady, setIsGlobeReady] = useState(false)

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
    if (globeContainerRef.current) {
      const updateDimensions = () => {
        const width = globeContainerRef.current?.clientWidth || 500
        const height = width // Keep it square
        setDimensions({ width, height })
      }

      updateDimensions()

      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [isGlobeReady])

  const pointsData = useMemo<Array<PointData>>(() => {
    const points: PointData[] = []

    // Add highlight point if provided (for onboarding)
    if (highlightPoint && highlightPoint.lat !== 0 && highlightPoint.lng !== 0) {
      points.push({
        lat: highlightPoint.lat,
        lng: highlightPoint.lng,
        size: 1.5,
        color: 'rgba(255, 0, 0, 0.9)',
        label: 'First visitor!',
        visitors: 1,
      })
    }

    // Add country data points
    if (countryData && countryData.length > 0) {
      const countryPoints = countryData
        .map((country) => {
          const coords = getCountryCoordinates(country.country_code || '')
          if (!coords) return null

          const visitors = country.unique_visitors || 0

          const size = Math.min(1.5, Math.max(1, Math.log(visitors + 1) / 10))
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

      points.push(...countryPoints)
    }

    return points
  }, [countryData, isDark, highlightPoint])

  // Rotate globe to highlight point when set
  useEffect(() => {
    if (
      isGlobeReady &&
      globeEl.current &&
      highlightPoint &&
      highlightPoint.lat !== 0 &&
      highlightPoint.lng !== 0
    ) {
      const timer = setTimeout(() => {
        globeEl.current?.pointOfView(
          {
            lat: highlightPoint.lat,
            lng: highlightPoint.lng,
            altitude: 2.5,
          },
          1500,
        ) // Smooth transition over 1.5 seconds
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isGlobeReady, highlightPoint])

  // Auto-rotate globe slowly - only after globe is ready and no highlight point
  useEffect(() => {
    if (isGlobeReady && globeEl.current) {
      // Small delay to ensure globe is fully initialized
      const timer = setTimeout(() => {
        const controls = globeEl.current?.controls()
        if (controls) {
          // Disable auto-rotate if we have a highlight point
          controls.autoRotate =
            !highlightPoint || (highlightPoint.lat === 0 && highlightPoint.lng === 0)
          controls.autoRotateSpeed = 0.3 // Slow rotation
          controls.enableZoom = false // Disable zoom/scroll
          controls.enablePan = false // Disable panning
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isGlobeReady, highlightPoint])

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
          <div className="flex items-center justify-center h-[500px] rounded-lg animate-pulse">
            <p className="text-sm text-muted-foreground">
              Loading visitor locations...
            </p>
          </div>
        ) : !isGlobeReady ? (
          <div className="flex items-center justify-center h-[400px] rounded-lg">
            <p className="text-sm text-muted-foreground">Preparing globe...</p>
          </div>
        ) : (
          <div
            className="relative w-full overflow-hidden rounded-lg"
            ref={globeContainerRef}
            style={{
              width: '100%',
              alignContent: 'center',
              pointerEvents: 'none',
            }}
            onWheel={(e) => e.stopPropagation()}
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
              htmlElementsData={
                highlightPoint &&
                highlightPoint.lat !== 0 &&
                highlightPoint.lng !== 0
                  ? [highlightPoint]
                  : []
              }
              htmlLat="lat"
              htmlLng="lng"
              htmlElement={() => {
                const el = document.createElement('div')
                el.style.cssText = `
                  width: 12px;
                  height: 12px;
                  background: rgba(255, 0, 0, 0.9);
                  border-radius: 50%;
                  box-shadow: 0 0 10px rgba(255, 0, 0, 0.8);
                  animation: pulse 2s ease-in-out infinite;
                `
                // Add keyframes animation if not already present
                if (!document.getElementById('globe-pulse-animation')) {
                  const style = document.createElement('style')
                  style.id = 'globe-pulse-animation'
                  style.textContent = `
                    @keyframes pulse {
                      0%, 100% {
                        transform: scale(1);
                        opacity: 1;
                      }
                      50% {
                        transform: scale(1.5);
                        opacity: 0.7;
                      }
                    }
                  `
                  document.head.appendChild(style)
                }
                return el
              }}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}

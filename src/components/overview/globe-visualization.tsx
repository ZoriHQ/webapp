'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Globe from 'react-globe.gl'
import * as THREE from 'three'
import { getCountryCoordinates } from '@/lib/country-coordinates'
import { useTheme } from '@/components/theme-provider'
import { Card, CardContent } from '@/components/ui/card'
import { useAppContext } from '@/contexts/app.context'
import { useTrafficByCountryTile } from '@/hooks/use-analytics-tiles'

interface GlobeVisualizationProps {
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
  country: string
}

interface HoveredPoint {
  point: PointData
  x: number
  y: number
}

export function GlobeVisualization({
  highlightPoint,
}: GlobeVisualizationProps) {
  const globeEl = useRef<any>(null)
  const globeContainerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()

  const isDark = theme === 'dark'
  const [countries, setCountries] = useState({ features: [] })
  const [dimensions, setDimensions] = useState({ width: 600, height: 500 })
  const [isGlobeReady, setIsGlobeReady] = useState(false)
  const [hoveredPoint, setHoveredPoint] = useState<HoveredPoint | null>(null)

  const { storedValues } = useAppContext()
  const { data, isLoading } = useTrafficByCountryTile({
    project_id: storedValues!.projectId as string,
    time_range: storedValues?.timeRange || 'last_7_days',
  })

  useEffect(() => {
    const fetchDataAsync = async () => {
      const fetchResult = await fetch(
        'https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson',
      )
      const adminCountriesData = await fetchResult.json()
      setCountries(adminCountriesData)
      setIsGlobeReady(true)
    }
    fetchDataAsync()
  }, [])

  useEffect(() => {
    if (globeContainerRef.current) {
      const updateDimensions = () => {
        const width = globeContainerRef.current?.clientWidth || 500
        const height = width
        setDimensions({ width, height })
      }

      updateDimensions()

      window.addEventListener('resize', updateDimensions)
      return () => window.removeEventListener('resize', updateDimensions)
    }
  }, [isGlobeReady])

  const pointsData = useMemo<Array<PointData>>(() => {
    const points: Array<PointData> = []

    if (
      highlightPoint &&
      highlightPoint.lat !== 0 &&
      highlightPoint.lng !== 0
    ) {
      points.push({
        lat: highlightPoint.lat,
        lng: highlightPoint.lng,
        size: 1.2,
        color: isDark ? 'rgba(96, 165, 250, 1)' : 'rgba(234, 88, 12, 1)',
        label: 'First visitor!',
        visitors: 1,
        country: 'Unknown',
      })
    }

    if (data?.data && data.data.length > 0) {
      const countryPoints = data.data
        .map((country) => {
          const coords = getCountryCoordinates(country.country || '')
          if (!coords) return null

          const visitors = country.count || 0

          // Enhanced sizing: more pronounced difference between small and large
          const size = Math.min(1.5, Math.max(0.5, Math.log(visitors + 1) / 6))

          return {
            lat: coords.lat,
            lng: coords.lng,
            size,
            color: isDark
              ? 'rgba(96, 165, 250, 1)' // Blue-400
              : 'rgba(234, 88, 12, 1)', // Orange-600
            label: `${coords.name}: ${visitors.toLocaleString()} visitors`,
            visitors,
            country: coords.name,
          }
        })
        .filter((p): p is PointData => p !== null)

      points.push(...countryPoints)
    }

    return points
  }, [data?.data, isDark, highlightPoint])

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
        )
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [isGlobeReady, highlightPoint])

  useEffect(() => {
    if (isGlobeReady && globeEl.current) {
      const timer = setTimeout(() => {
        const controls = globeEl.current?.controls()
        if (controls) {
          controls.autoRotate =
            !highlightPoint ||
            (highlightPoint.lat === 0 && highlightPoint.lng === 0)
          controls.autoRotateSpeed = 0.3
          controls.enableZoom = false
          controls.enablePan = false
        }
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [isGlobeReady, highlightPoint])

  const backgroundColor = 'rgba(0,0,0,0)'
  // Dark theme: deep, immersive ocean with subtle land
  // Light theme: soft, airy ocean with defined land
  const globeColor = isDark ? '#0f172a' : '#dbeafe' // Ocean: deep navy / soft blue
  const atmosphereColor = isDark ? '#3b82f6' : '#fb923c' // Atmosphere: blue glow / warm glow
  const landColor = isDark ? '#1e293b' : '#94a3b8' // Land: slate-800 / slate-400
  const borderColor = isDark ? '#475569' : '#64748b' // Borders: slate-600 / slate-500

  // Create proper Three.js material for the globe (ocean)
  // Dark: subtle glow with blue specular highlights
  // Light: clean, high-shine surface
  const globeMaterial = useMemo(() => {
    return new THREE.MeshPhongMaterial({
      color: new THREE.Color(globeColor),
      emissive: new THREE.Color(isDark ? '#1e3a5f' : globeColor),
      emissiveIntensity: isDark ? 0.15 : 0.02,
      shininess: isDark ? 8 : 25,
      specular: new THREE.Color(isDark ? '#1e40af' : '#94a3b8'),
      transparent: false,
      opacity: 1,
    })
  }, [globeColor, isDark])

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
            }}
            onWheel={(e) => e.stopPropagation()}
          >
            <Globe
              ref={globeEl}
              width={dimensions.width}
              height={dimensions.height}
              backgroundColor={backgroundColor}
              globeMaterial={globeMaterial}
              backgroundImageUrl={null}
              showAtmosphere={true}
              atmosphereColor={atmosphereColor}
              atmosphereAltitude={isDark ? 0.2 : 0.12}
              polygonsData={countries.features}
              polygonCapColor={() => landColor}
              polygonSideColor={() => (isDark ? '#0f172a' : '#64748b')}
              polygonStrokeColor={() => borderColor}
              polygonAltitude={isDark ? 0.006 : 0.004}
              polygonsTransitionDuration={0}
              pointsData={pointsData}
              pointLat="lat"
              pointLng="lng"
              pointColor={(d: object) => {
                const point = d as PointData
                return hoveredPoint?.point === point
                  ? isDark
                    ? 'rgba(147, 197, 253, 1)' // Blue-300 for hover
                    : 'rgba(251, 146, 60, 1)' // Orange-400 for hover
                  : point.color
              }}
              pointAltitude={(d: object) => {
                const point = d as PointData
                return hoveredPoint?.point === point
                  ? isDark
                    ? 0.025
                    : 0.02
                  : isDark
                    ? 0.015
                    : 0.01
              }}
              pointRadius={(d: object) => {
                const point = d as PointData
                return hoveredPoint?.point === point
                  ? point.size * 1.3
                  : point.size
              }}
              pointLabel=""
              pointsMerge={false}
              enablePointerInteraction={true}
              onPointHover={(
                point: object | null,
                _prevPoint: object | null,
              ) => {
                if (point) {
                  const p = point as PointData
                  // Get mouse position from window
                  const handleMouseMove = (e: globalThis.MouseEvent) => {
                    setHoveredPoint({
                      point: p,
                      x: e.clientX,
                      y: e.clientY,
                    })
                    window.removeEventListener('mousemove', handleMouseMove)
                  }
                  window.addEventListener('mousemove', handleMouseMove)
                  // Also set immediately with approximate position
                  setHoveredPoint({
                    point: p,
                    x: window.innerWidth / 2,
                    y: window.innerHeight / 2,
                  })
                } else {
                  setHoveredPoint(null)
                }
              }}
              onPointClick={(
                point: object,
                _event: MouseEvent,
                _coords: { lat: number; lng: number; altitude: number },
              ) => {
                const p = point as PointData
                // Focus on clicked country
                if (globeEl.current) {
                  globeEl.current.pointOfView(
                    {
                      lat: p.lat,
                      lng: p.lng,
                      altitude: 1.8,
                    },
                    1000,
                  )
                }
              }}
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
                const accentColor = isDark
                  ? 'rgba(96, 165, 250, 0.9)'
                  : 'rgba(234, 88, 12, 0.9)'
                const glowColor = isDark
                  ? 'rgba(96, 165, 250, 0.6)'
                  : 'rgba(234, 88, 12, 0.6)'
                el.style.cssText = `
                  width: 10px;
                  height: 10px;
                  background: ${accentColor};
                  border-radius: 50%;
                  box-shadow: 0 0 12px ${glowColor}, 0 0 24px ${glowColor};
                  animation: pulse 2s ease-in-out infinite;
                `
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
                        transform: scale(1.3);
                        opacity: 0.8;
                      }
                    }
                  `
                  document.head.appendChild(style)
                }
                return el
              }}
            />
            {/* Custom tooltip for hovered points */}
            {hoveredPoint && (
              <div
                className="fixed z-50 pointer-events-none"
                style={{
                  left: hoveredPoint.x + 12,
                  top: hoveredPoint.y - 10,
                }}
              >
                <div
                  className={`
                    px-3 py-2 rounded-lg shadow-lg backdrop-blur-sm
                    ${isDark ? 'bg-slate-800/90 border border-slate-700' : 'bg-white/90 border border-slate-200'}
                  `}
                >
                  <p
                    className={`text-sm font-medium ${isDark ? 'text-white' : 'text-slate-900'}`}
                  >
                    {hoveredPoint.point.country}
                  </p>
                  <p
                    className={`text-xs ${isDark ? 'text-blue-400' : 'text-orange-600'}`}
                  >
                    {hoveredPoint.point.visitors.toLocaleString()} visitors
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

'use client'

import { useEffect, useRef, useState, useMemo } from 'react'
import Map, { type MapRef, Layer, Source } from 'react-map-gl/mapbox'
import type Zoriapi from 'zorihq'
import { useTheme } from 'next-themes'
import { getCountryCoordinates } from '@/lib/country-coordinates'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import 'mapbox-gl/dist/mapbox-gl.css'

interface GlobeVisualizationProps {
  countryData: Array<Zoriapi.V1.Analytics.CountryDataPoint> | undefined
  isLoading: boolean
}

// Use free tier Mapbox token - will need to be replaced with actual token
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || ''

export function GlobeVisualization({
  countryData,
  isLoading,
}: GlobeVisualizationProps) {
  const mapRef = useRef<MapRef>(null)
  const { theme, resolvedTheme } = useTheme()
  const [isRotating, setIsRotating] = useState(true)

  // Determine effective theme (dark or light)
  const effectiveTheme = resolvedTheme || theme || 'light'
  const isDark = effectiveTheme === 'dark'

  // Map style based on theme
  const mapStyle = !isDark
    ? 'mapbox://styles/mapbox/dark-v11'
    : 'mapbox://styles/mapbox/light-v11'

  // Convert country data to GeoJSON features
  const geoJsonData = useMemo(() => {
    if (!countryData || countryData.length === 0) {
      return {
        type: 'FeatureCollection' as const,
        features: [],
      }
    }

    const features = countryData
      .map((country) => {
        const coords = getCountryCoordinates(country.country_code || '')
        if (!coords) return null

        return {
          type: 'Feature' as const,
          geometry: {
            type: 'Point' as const,
            coordinates: [coords.lng, coords.lat],
          },
          properties: {
            countryCode: country.country_code,
            countryName: coords.name,
            visitors: country.unique_visitors || 0,
            percentage: country.percentage || 0,
          },
        }
      })
      .filter((f): f is NonNullable<typeof f> => f !== null)

    return {
      type: 'FeatureCollection' as const,
      features,
    }
  }, [countryData])

  // Auto-rotate globe
  useEffect(() => {
    if (!mapRef.current || !isRotating) return

    const map = mapRef.current.getMap()
    const secondsPerRevolution = 120
    const maxSpinZoom = 5
    const slowSpinZoom = 3

    let userInteracting = false
    let spinEnabled = true

    function spinGlobe() {
      if (!spinEnabled || userInteracting) return

      const zoom = map.getZoom()
      if (zoom < maxSpinZoom) {
        let distancePerSecond = 360 / secondsPerRevolution
        if (zoom > slowSpinZoom) {
          const zoomDif = (maxSpinZoom - zoom) / (maxSpinZoom - slowSpinZoom)
          distancePerSecond *= zoomDif
        }
        const center = map.getCenter()
        center.lng -= distancePerSecond / 60 // Rotate 1/60th of a second
        map.easeTo({ center, duration: 1000 / 60, easing: (n) => n })
      }
    }

    map.on('mousedown', () => {
      userInteracting = true
    })
    map.on('dragstart', () => {
      userInteracting = true
    })
    map.on('mouseup', () => {
      userInteracting = false
      spinGlobe()
    })
    map.on('dragend', () => {
      userInteracting = false
      spinGlobe()
    })

    const interval = setInterval(spinGlobe, 1000 / 60)

    return () => {
      clearInterval(interval)
      map.off('mousedown')
      map.off('dragstart')
      map.off('mouseup')
      map.off('dragend')
    }
  }, [isRotating])

  // Layer configurations for visitor markers
  const heatmapLayer = {
    id: 'visitors-heat',
    type: 'heatmap' as const,
    paint: {
      'heatmap-weight': [
        'interpolate',
        ['linear'],
        ['get', 'visitors'],
        0,
        0,
        1000,
        1,
      ],
      'heatmap-intensity': ['interpolate', ['linear'], ['zoom'], 0, 1, 9, 3],
      'heatmap-color': [
        'interpolate',
        ['linear'],
        ['heatmap-density'],
        0,
        'rgba(33,102,172,0)',
        0.2,
        'rgb(103,169,207)',
        0.4,
        'rgb(209,229,240)',
        0.6,
        'rgb(253,219,199)',
        0.8,
        'rgb(239,138,98)',
        1,
        'rgb(178,24,43)',
      ],
      'heatmap-radius': ['interpolate', ['linear'], ['zoom'], 0, 2, 9, 20],
      'heatmap-opacity': ['interpolate', ['linear'], ['zoom'], 7, 1, 9, 0],
    },
  }

  const circleLayer = {
    id: 'visitors-point',
    type: 'circle' as const,
    paint: {
      'circle-radius': [
        'interpolate',
        ['linear'],
        ['get', 'visitors'],
        1,
        4,
        100,
        8,
        1000,
        12,
        10000,
        20,
      ],
      'circle-color': [
        'interpolate',
        ['linear'],
        ['get', 'visitors'],
        1,
        isDark ? 'rgb(103,169,207)' : 'rgb(33,102,172)',
        100,
        isDark ? 'rgb(209,229,240)' : 'rgb(103,169,207)',
        1000,
        isDark ? 'rgb(253,219,199)' : 'rgb(209,229,240)',
        10000,
        isDark ? 'rgb(239,138,98)' : 'rgb(253,219,199)',
      ],
      'circle-opacity': 0.8,
      'circle-stroke-width': 2,
      'circle-stroke-color': isDark ? '#ffffff' : '#000000',
      'circle-stroke-opacity': 0.4,
    },
  }

  if (!MAPBOX_TOKEN) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Visitor Locations</CardTitle>
          <CardDescription>
            Global distribution of your visitors
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Mapbox token not configured. Please set VITE_MAPBOX_ACCESS_TOKEN
              in your environment.
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-transparent! border-none">
      <CardHeader className="bg-transparent! border-none">
        <div className="bg-transparent! border-none flex items-center justify-between">
          <div>
            <CardTitle>Visitor Locations</CardTitle>
            <CardDescription>
              Global distribution of your visitors
            </CardDescription>
          </div>
          {geoJsonData.features.length > 0 && (
            <div className="text-sm text-muted-foreground">
              {geoJsonData.features.length} countries
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[400px] bg-muted rounded-lg animate-pulse">
            <p className="text-sm text-muted-foreground">
              Loading visitor locations...
            </p>
          </div>
        ) : geoJsonData.features.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[400px] bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              No visitor location data available
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Visitor locations will appear here once you receive traffic
            </p>
          </div>
        ) : (
          <div className="relative h-[400px] w-full overflow-hidden rounded-lg">
            <Map
              ref={mapRef}
              initialViewState={{
                longitude: 0,
                latitude: 20,
                zoom: 1.5,
              }}
              style={{ width: '100%', height: '100%' }}
              onLoad={(event) => {
                const map = event.target

                // Set to your page's background color
                map.setPaintProperty(
                  'background',
                  'background-color',
                  '#1a1a1a',
                ) // or whatever your color is
              }}
              mapStyle={mapStyle}
              mapboxAccessToken={MAPBOX_TOKEN}
              projection={{ name: 'globe' }}
              interactive={true}
              onMouseDown={() => setIsRotating(false)}
              onMouseUp={() => setIsRotating(true)}
              onTouchStart={() => setIsRotating(false)}
              onTouchEnd={() => setIsRotating(true)}
            >
              <Source id="visitors" type="geojson" data={geoJsonData}>
                <Layer {...heatmapLayer} />
                <Layer {...circleLayer} />
              </Source>
            </Map>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

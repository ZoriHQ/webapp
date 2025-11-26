import { useState } from 'react'
import { Tag } from 'lucide-react'
import type { Zoriapi } from 'zorihq'

import { BarList } from '@/components/ui/bar-list'
import { Button } from '@/components/ui/button'
import { useTrafficByUTMTile } from '@/hooks/use-analytics-tiles'

interface TrafficSourceUtmTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByUtmParams
}

export function TrafficSourceUtmTile({ params }: TrafficSourceUtmTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data } = useTrafficByUTMTile(params)

  const utmData = data?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading UTM data...</p>
      </div>
    )
  }

  if (utmData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">No UTM data available</p>
      </div>
    )
  }

  const displayData = showAll ? utmData : utmData.slice(0, 6)

  const barListData = displayData.map((source) => {
    // Build UTM label from available parameters
    const utmParts = []
    if (source.utm_source) utmParts.push(`source: ${source.utm_source}`)
    if (source.utm_medium) utmParts.push(`medium: ${source.utm_medium}`)
    if (source.utm_campaign) utmParts.push(`campaign: ${source.utm_campaign}`)

    const utmLabel = utmParts.length > 0 ? utmParts.join(' / ') : 'Direct'

    return {
      name: utmLabel,
      value: source.count || 0,
      icon: <Tag className="w-4 h-4 text-muted-foreground flex-shrink-0" />,
    }
  })

  return (
    <>
      <BarList
        data={barListData}
        valueFormatter={(value) => value.toLocaleString()}
        sortOrder="none"
        color="bg-blue-500"
      />
      {utmData.length > 6 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3"
        >
          {showAll ? 'Show Less' : `Show More (${utmData.length - 6} more)`}
        </Button>
      )}
    </>
  )
}

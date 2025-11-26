import { useState } from 'react'
import { Globe } from 'lucide-react'
import type { Zoriapi } from 'zorihq'

import { BarList } from '@/components/ui/bar-list'
import { Button } from '@/components/ui/button'
import { getFaviconUrl } from '@/lib/favicon-utils'
import { useTrafficByReferrerTile } from '@/hooks/use-analytics-tiles'

interface TrafficSourceRefererTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByRefererParams
}

function FaviconIcon({ url }: { url: string }) {
  const [hasError, setHasError] = useState(false)
  const isDirect = !url || url === 'Direct'
  const faviconUrl = isDirect ? '' : getFaviconUrl(url, 32)

  if (isDirect || hasError) {
    return <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
  }

  return (
    <img
      src={faviconUrl}
      alt=""
      className="w-5 h-5 rounded flex-shrink-0"
      onError={() => setHasError(true)}
    />
  )
}

export function TrafficSourceRefererTile({
  params,
}: TrafficSourceRefererTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data } = useTrafficByReferrerTile(params)

  const refererData = data?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          Loading referrer data...
        </p>
      </div>
    )
  }

  if (refererData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No referrer data available
        </p>
      </div>
    )
  }

  const displayData = showAll ? refererData : refererData.slice(0, 6)

  const barListData = displayData.map((source) => ({
    name: source.referer_url || 'Direct',
    value: source.count || 0,
    icon: <FaviconIcon url={source.referer_url || ''} />,
  }))

  return (
    <>
      <BarList
        data={barListData}
        valueFormatter={(value) => value.toLocaleString()}
        sortOrder="none"
        color="bg-blue-500"
      />
      {refererData.length > 6 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3"
        >
          {showAll ? 'Show Less' : `Show More (${refererData.length - 6} more)`}
        </Button>
      )}
    </>
  )
}

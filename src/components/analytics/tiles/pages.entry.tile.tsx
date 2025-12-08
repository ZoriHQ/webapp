import { useState } from 'react'
import type { Zoriapi } from 'zorihq'

import { BarList } from '@/components/ui/bar-list'
import { Button } from '@/components/ui/button'
import { useTopEntryPagesTile } from '@/hooks/use-analytics-tiles'

interface TopEntryPagesTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileEntryPagesParams
}

const trimPagePath = (path: string, maxLength: number = 35): string => {
  if (path.length <= maxLength) return path

  const start = path.slice(0, Math.floor(maxLength * 0.4))
  const end = path.slice(-Math.floor(maxLength * 0.5))
  return `${start}...${end}`
}

export function TopEntryPagesTile({ params }: TopEntryPagesTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data } = useTopEntryPagesTile(params)

  const pageData = data?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">
          Loading entry pages data...
        </p>
      </div>
    )
  }

  if (pageData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No entry pages data available
        </p>
      </div>
    )
  }

  const displayData = showAll ? pageData : pageData.slice(0, 6)

  const barListData = displayData.map((page) => {
    const pagePath = page.page || '/'
    return {
      name: trimPagePath(pagePath),
      value: page.count || 0,
      key: pagePath,
    }
  })

  return (
    <>
      <BarList
        data={barListData}
        valueFormatter={(value) => value.toLocaleString()}
        sortOrder="none"
        color="bg-orange-500"
      />
      {pageData.length > 6 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3"
        >
          {showAll ? 'Show Less' : `Show More (${pageData.length - 6} more)`}
        </Button>
      )}
    </>
  )
}

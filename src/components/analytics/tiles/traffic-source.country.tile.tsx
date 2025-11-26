import { useState } from 'react'
import type { Zoriapi } from 'zorihq'

import { BarList } from '@/components/ui/bar-list'
import { Button } from '@/components/ui/button'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { useTrafficByCountryTile } from '@/hooks/use-analytics-tiles'

interface TrafficSourceCountryTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByCountryParams
}

export function TrafficSourceCountryTile({
  params,
}: TrafficSourceCountryTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data } = useTrafficByCountryTile(params)

  const countryData = data?.data || []

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-sm text-muted-foreground">Loading country data...</p>
      </div>
    )
  }

  if (countryData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <p className="text-sm text-muted-foreground">
          No country data available
        </p>
      </div>
    )
  }

  const displayData = showAll ? countryData : countryData.slice(0, 6)

  const barListData = displayData.map((country) => {
    const countryCode = country.country?.toUpperCase() || ''
    const countryName = getCountryName(countryCode)
    const flagEmoji = countryCodeToFlag(countryCode)

    return {
      name: countryName,
      value: country.count || 0,
      icon: <span className="text-lg">{flagEmoji}</span>,
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
      {countryData.length > 6 && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowAll(!showAll)}
          className="w-full mt-3"
        >
          {showAll ? 'Show Less' : `Show More (${countryData.length - 6} more)`}
        </Button>
      )}
    </>
  )
}

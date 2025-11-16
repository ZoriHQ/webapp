import { useState } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import type { Zoriapi } from 'zorihq'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { countryCodeToFlag, getCountryName } from '@/lib/country-utils'
import { useTrafficByCountryTile } from '@/hooks/use-analytics-tiles'

interface TrafficSourceCountryTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByCountryParams
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: '#3b82f6',
  },
} satisfies ChartConfig

export function TrafficSourceCountryTile({
  params,
}: TrafficSourceCountryTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data, isError } = useTrafficByCountryTile(params)

  const countryData = data?.data || []
  const maxValue =
    countryData.reduce((max, item) => {
      const count = item.count || 0
      return Math.max(max, count)
    }, 0) || 1

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

  return (
    <>
      <div className="space-y-4">
        {displayData.map((country, idx) => {
          const countryCode = country.country?.toUpperCase() || ''
          const countryName = getCountryName(countryCode)
          const flagEmoji = countryCodeToFlag(countryCode)

          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex items-center gap-3 w-48 flex-shrink-0">
                <div className="text-2xl">{flagEmoji}</div>
                <p className="text-sm font-medium truncate">{countryName}</p>
              </div>

              <ChartContainer
                config={chartConfig}
                className="h-10 w-full flex-1"
              >
                <BarChart
                  layout="vertical"
                  data={[
                    {
                      name: countryName,
                      visitors: country.count || 0,
                    },
                  ]}
                  margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
                >
                  <XAxis type="number" hide domain={[0, maxValue]} />
                  <YAxis type="category" dataKey="name" hide />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => {
                          if (name === 'visitors') {
                            return (
                              <div className="flex items-center justify-between w-full gap-3">
                                <span className="text-muted-foreground flex items-center gap-1.5">
                                  <span>=e</span>
                                  Visitors
                                </span>
                                <span className="font-mono font-medium tabular-nums">
                                  {Number(value).toLocaleString()}
                                </span>
                              </div>
                            )
                          }
                          return null
                        }}
                      />
                    }
                    cursor={false}
                  />
                  <Bar
                    dataKey="visitors"
                    fill="var(--color-visitors)"
                    radius={4}
                  />
                </BarChart>
              </ChartContainer>
            </div>
          )
        })}
      </div>
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

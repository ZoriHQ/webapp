import { useState } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Tag } from 'lucide-react'
import type { Zoriapi } from 'zorihq'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { useTrafficByUTMTile } from '@/hooks/use-analytics-tiles'

interface TrafficSourceUtmTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByUtmParams
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: '#3b82f6',
  },
} satisfies ChartConfig

export function TrafficSourceUtmTile({ params }: TrafficSourceUtmTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data } = useTrafficByUTMTile(params)

  const utmData = data?.data || []
  const maxValue =
    utmData.reduce((max, item) => {
      const count = item.count || 0
      return Math.max(max, count)
    }, 0) || 1

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

  return (
    <>
      <div className="space-y-4">
        {displayData.map((source, idx) => {
          // Build UTM label from available parameters
          const utmParts = []
          if (source.utm_source) utmParts.push(`source: ${source.utm_source}`)
          if (source.utm_medium) utmParts.push(`medium: ${source.utm_medium}`)
          if (source.utm_campaign)
            utmParts.push(`campaign: ${source.utm_campaign}`)

          const utmLabel = utmParts.length > 0 ? utmParts.join(' • ') : 'Direct'

          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex items-center gap-3 w-48 flex-shrink-0">
                <Tag className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                <p className="text-sm font-medium truncate" title={utmLabel}>
                  {utmLabel}
                </p>
              </div>

              <ChartContainer
                config={chartConfig}
                className="h-10 w-full flex-1"
              >
                <BarChart
                  layout="vertical"
                  data={[
                    {
                      name: utmLabel,
                      visitors: source.count || 0,
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
                                  <span>👥</span>
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

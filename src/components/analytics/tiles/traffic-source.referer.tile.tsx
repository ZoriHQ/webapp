import { useState } from 'react'
import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Globe } from 'lucide-react'
import type { Zoriapi } from 'zorihq'
import type { ChartConfig } from '@/components/ui/chart'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import { Button } from '@/components/ui/button'
import { getFaviconUrl } from '@/lib/favicon-utils'
import { useTrafficByReferrerTile } from '@/hooks/use-analytics-tiles'

interface TrafficSourceRefererTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileTrafficByRefererParams
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: '#3b82f6',
  },
} satisfies ChartConfig

export function TrafficSourceRefererTile({
  params,
}: TrafficSourceRefererTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data } = useTrafficByReferrerTile(params)

  const refererData = data?.data || []
  const maxValue =
    refererData.reduce((max, item) => {
      const count = item.count || 0
      return Math.max(max, count)
    }, 0) || 1

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

  return (
    <>
      <div className="space-y-4">
        {displayData.map((source, idx) => {
          const isDirect =
            !source.referer_url || source.referer_url === 'Direct'
          const faviconUrl = isDirect
            ? ''
            : getFaviconUrl(source.referer_url || '', 32)

          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex items-center gap-3 w-48 flex-shrink-0">
                {isDirect ? (
                  <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                ) : (
                  <>
                    <img
                      src={faviconUrl}
                      alt=""
                      className="w-5 h-5 rounded flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        const globe = e.currentTarget.nextElementSibling
                        if (globe) {
                          ;(globe as HTMLElement).style.display = 'block'
                        }
                      }}
                    />
                    <Globe className="w-5 h-5 text-muted-foreground flex-shrink-0 hidden" />
                  </>
                )}
                <p className="text-sm font-medium truncate">
                  {source.referer_url || 'Direct'}
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
                      name: source.referer_url || 'Direct',
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

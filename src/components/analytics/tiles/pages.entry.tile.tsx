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
import { useTopEntryPagesTile } from '@/hooks/use-analytics-tiles'

interface TopEntryPagesTileProps {
  params: Zoriapi.V1.Analytics.Tiles.TileEntryPagesParams
}

const chartConfig = {
  visitors: {
    label: 'Visitors',
    color: '#3b82f6',
  },
} satisfies ChartConfig

const trimPagePath = (path: string, maxLength: number = 35): string => {
  if (path.length <= maxLength) return path

  const start = path.slice(0, Math.floor(maxLength * 0.4))
  const end = path.slice(-Math.floor(maxLength * 0.5))
  return `${start}...${end}`
}

export function TopEntryPagesTile({ params }: TopEntryPagesTileProps) {
  const [showAll, setShowAll] = useState(false)
  const { isLoading, data, isError } = useTopEntryPagesTile(params)

  const pageData = data?.data || []
  const maxValue =
    pageData.reduce((max, item) => {
      const count = item.count || 0
      return Math.max(max, count)
    }, 0) || 1

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

  return (
    <>
      <div className="space-y-4">
        {displayData.map((page, idx) => {
          const pagePath = page.page || '/'
          const displayPath = trimPagePath(pagePath)

          return (
            <div key={idx} className="flex items-center gap-4">
              <div className="flex items-center gap-3 w-48 flex-shrink-0">
                <p className="text-sm font-medium" title={pagePath}>
                  {displayPath}
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
                      name: pagePath,
                      visitors: page.count || 0,
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

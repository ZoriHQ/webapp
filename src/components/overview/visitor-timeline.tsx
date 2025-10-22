'use client'

import * as React from 'react'
import type Zoriapi from 'zorihq'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'

import type { ChartConfig } from '@/components/ui/chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import type { TimeRange } from '@/hooks/use-analytics'

const chartConfig = {
  visitors: {
    label: 'Visitors',
  },
  desktop: {
    label: 'Desktop',
    color: 'hsl(217, 91%, 60%)',
  },
  mobile: {
    label: 'Mobile',
    color: 'hsl(32, 98%, 56%)',
  },
} satisfies ChartConfig

interface VisitorTimelineProps {
  data?: Zoriapi.V1.Analytics.UniqueVisitorsDataPoint[]
  isLoading?: boolean
  timeRange: TimeRange
}

export function VisitorTimeline({
  data,
  isLoading = false,
  timeRange,
}: VisitorTimelineProps) {
  // Transform API data to chart format with proper grouping
  const chartData = React.useMemo(() => {
    if (!data || data.length === 0) {
      return []
    }

    // For hourly data (last_hour, today), don't aggregate - show each data point
    if (timeRange === 'last_hour' || timeRange === 'today') {
      return data.map((item) => ({
        date: item.timestamp || '',
        desktop: item.desktop || 0,
        mobile: item.mobile || 0,
      }))
    }

    // For multi-day periods, aggregate by day
    const aggregatedByDay = new Map<
      string,
      { desktop: number; mobile: number }
    >()

    data.forEach((item) => {
      if (!item.timestamp) return

      // Get the date portion only (YYYY-MM-DD)
      const date = new Date(item.timestamp)
      const dateKey = date.toISOString().split('T')[0]

      const existing = aggregatedByDay.get(dateKey) || {
        desktop: 0,
        mobile: 0,
      }
      aggregatedByDay.set(dateKey, {
        desktop: existing.desktop + (item.desktop || 0),
        mobile: existing.mobile + (item.mobile || 0),
      })
    })

    // Convert map to array and sort by date
    return Array.from(aggregatedByDay.entries())
      .map(([dateKey, values]) => ({
        date: `${dateKey}T00:00:00Z`,
        desktop: values.desktop,
        mobile: values.mobile,
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [data, timeRange])

  const hasData = chartData.length > 0

  // Calculate total visitors
  const totalVisitors = React.useMemo(() => {
    if (!hasData) return 0
    return chartData.reduce((sum, item) => sum + item.desktop + item.mobile, 0)
  }, [chartData, hasData])

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Visitor Activity</CardTitle>
        <CardDescription>
          {hasData && !isLoading
            ? `${totalVisitors.toLocaleString()} total visitors`
            : 'Visitor timeline over time'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-[320px]">
            <p className="text-sm text-muted-foreground">
              Loading timeline data...
            </p>
          </div>
        ) : !hasData ? (
          <div className="flex flex-col items-center justify-center h-[320px] text-center">
            <p className="text-sm text-muted-foreground">
              No visitor data available for this period
            </p>
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[320px] w-full"
          >
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-desktop)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.6}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-mobile)"
                    stopOpacity={0.2}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value)
                  if (timeRange === 'last_hour' || timeRange === 'today') {
                    return date.toLocaleTimeString('en-US', {
                      hour: 'numeric',
                      minute: '2-digit',
                      hour12: true,
                    })
                  }
                  return date.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      const date = new Date(value)
                      if (timeRange === 'last_hour' || timeRange === 'today') {
                        return date.toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          hour: 'numeric',
                          minute: '2-digit',
                          hour12: true,
                        })
                      }
                      return date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="mobile"
                type="monotone"
                fill="url(#fillMobile)"
                stroke="var(--color-mobile)"
                strokeWidth={2}
                stackId="a"
              />
              <Area
                dataKey="desktop"
                type="monotone"
                fill="url(#fillDesktop)"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  )
}
